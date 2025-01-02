import { useAuthStore } from "@/store/auth";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

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

  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_SEKTOR_API_URL || "",
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  return client;
};

export default createSektorApiClient;
