import { DocumentNode, print } from "graphql";

/**
 * Minimal GraphQL fetch for getServerSideProps (public, unauthenticated
 * queries only). The browser Apollo client depends on the persisted auth
 * store, which doesn't exist on the server.
 */
export async function serverQuery<T>(
  query: DocumentNode,
  variables?: Record<string, unknown>
): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SEKTOR_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SEKTOR_API_URL is not set");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
    body: JSON.stringify({ query: print(query), variables }),
  });
  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  if (!json.data) throw new Error(`GraphQL request failed (${res.status})`);
  return json.data;
}

/** Absolute site origin for canonical URLs, sitemap and Open Graph. */
export const getSiteUrl = (host?: string) =>
  (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (host ? `https://${host}` : "https://sektor.app")
  ).replace(/\/$/, "");
