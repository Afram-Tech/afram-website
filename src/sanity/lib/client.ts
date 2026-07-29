import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "@/sanity/lib/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
