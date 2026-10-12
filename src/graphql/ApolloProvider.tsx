"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import type { ReactNode } from "react";

import { graphqlEndpoint } from "./endpoint";

function makeClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: graphqlEndpoint }),
    cache: new InMemoryCache(),
  });
}

export function ApolloProvider({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
