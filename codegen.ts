import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  schema: ["https://afram-core-staging.fly.dev/graph"],
  documents: ["src/graphql/**/*.graphql"],
  generates: {
    "./src/types/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        scalars: {
          Date: "string",
          ObjectID: "string",
          JSON: "Record<string, any>",
        },
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
