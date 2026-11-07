import { useAuthStore } from "@/store/auth";
import { ApolloClient, InMemoryCache, ApolloLink, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const API_URL = process.env.NEXT_PUBLIC_SEKTOR_API_URL || "";

/** The server rejected the session token (expired or invalid). */
const isUnauthorized = (message?: string, code?: unknown) =>
  code === "UNAUTHENTICATED" || /^unauthorized$/i.test((message ?? "").trim());

// Shared so parallel requests that fail at once trigger a single refresh.
let refreshing: Promise<string | null> | null = null;

/**
 * Exchanges the refresh token for a new access token. On failure the session
 * is dropped, so the UI goes back to the logged-out state (login button)
 * instead of looking logged in while every request fails.
 */
const refreshAccessToken = (): Promise<string | null> => {
  if (refreshing) return refreshing;
  const { refreshToken, setAccessToken, resetAuthStore } = useAuthStore.getState();
  if (!refreshToken) {
    resetAuthStore();
    return Promise.resolve(null);
  }
  refreshing = fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Apollo-Require-Preflight": "true" },
    body: JSON.stringify({
      query:
        "mutation refreshToken($refreshToken: String!) { refreshToken(refreshToken: $refreshToken) }",
      variables: { refreshToken },
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      const token: string | undefined = json?.data?.refreshToken;
      if (!token) throw new Error("refresh failed");
      setAccessToken(token);
      return token;
    })
    .catch(() => {
      resetAuthStore();
      return null;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
};

const createSektorApiClient = () => {
  const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().accessToken;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // Expired session (the access token lasts 7 days): refresh it once and
  // retry the operation. authLink runs again on retry and picks up the new token.
  const refreshLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    const unauthorized =
      graphQLErrors?.some((e) => isUnauthorized(e.message, e.extensions?.code)) ||
      (!!networkError && "statusCode" in networkError && networkError.statusCode === 401);
    if (!unauthorized || operation.getContext().retriedAfterRefresh) return;
    if (!useAuthStore.getState().accessToken) return;

    return new Observable((observer) => {
      let subscription: { unsubscribe: () => void } | undefined;
      refreshAccessToken().then((token) => {
        if (!token) {
          observer.error(new Error("Tu sesión expiró. Inicia sesión de nuevo."));
          return;
        }
        operation.setContext({ retriedAfterRefresh: true });
        subscription = forward(operation).subscribe(observer);
      });
      return () => subscription?.unsubscribe();
    });
  });

  const httpLink = createUploadLink({
    uri: API_URL,
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([refreshLink, authLink, httpLink as unknown as ApolloLink]),
  });

  // Drop cached data from the previous session when the user logs out or
  // another account logs in, so pages like "Mi cuenta" never show stale data.
  useAuthStore.subscribe((state, prevState) => {
    if (state.user?.id !== prevState.user?.id) {
      client.clearStore().catch(() => undefined);
    }
  });

  return client;
};

export default createSektorApiClient;
