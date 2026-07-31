import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl,
  },
});
