/**
 * Falls back to Afram's staging backend. Set GRAPHQL_API_URL once a
 * production endpoint exists.
 */
export const graphqlEndpoint =
  process.env.GRAPHQL_API_URL || "https://afram-core-staging.fly.dev/graph";

export async function graphqlFetch<TData, TVariables extends object = object>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
}
