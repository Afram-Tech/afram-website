/**
 * Falls back to Afram's staging backend. Set GRAPHQL_API_URL once a
 * production endpoint exists.
 */
export const graphqlEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "https://backend.afram.co/graph";

/**
 * Queries are cached for an hour. Pass `{ mutation: true }` for anything that
 * changes data (e.g. contactUs) — those must reach the API every time.
 */
export async function graphqlFetch<TData, TVariables extends object = object>(
  query: string,
  variables?: TVariables,
  { mutation = false, headers }: { mutation?: boolean; headers?: Record<string, string> } = {},
): Promise<TData> {
  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ query, variables }),
    ...(mutation ? { cache: "no-store" as const } : { next: { revalidate: 3600 } }),
  });

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
}
