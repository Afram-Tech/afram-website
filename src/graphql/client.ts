import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { OperationTypeNode } from "graphql";

import { graphqlEndpoint } from "./endpoint";

/**
 * Queries are cached by Next for an hour. Mutations (requestAccess,
 * contactUs) change data and must reach the API every time. Next rejects a
 * fetch that sets both `cache: "no-store"` and `revalidate`, so the choice is
 * made here per operation, not as one HttpLink default.
 */
const fetchCachingLink = new ApolloLink((operation, forward) => {
  const isMutation = operation.operationType === OperationTypeNode.MUTATION;
  operation.setContext(({ fetchOptions }: { fetchOptions?: RequestInit }) => ({
    fetchOptions: {
      ...(isMutation ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
      ...fetchOptions,
    },
  }));
  return forward(operation);
});

/**
 * One Apollo client per server request, for server components and server
 * actions. Every call to the API runs on the server, so the browser never
 * talks to the GraphQL endpoint and there is no client-side provider.
 *
 * GraphQL errors throw (Apollo's default `errorPolicy: "none"`), so callers
 * can keep a plain try/catch around each request.
 */
export const { getClient, query } = registerApolloClient(
  () =>
    new ApolloClient({
      link: ApolloLink.from([fetchCachingLink, new HttpLink({ uri: graphqlEndpoint })]),
      cache: new InMemoryCache(),
    }),
);
