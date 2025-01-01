import { ApolloClient, InMemoryCache } from "@apollo/client";

const createSektorApiClient = () => {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SEKTOR_API_URL || "",
    cache: new InMemoryCache(),
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  });
};

export default createSektorApiClient;
