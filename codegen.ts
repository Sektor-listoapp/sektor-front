import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: 
  process.env.NEXT_PUBLIC_SEKTOR_API_URL || "http://localhost:3001/graphql",
  documents: ["src/**/*.tsx"],
  generates: {
    "./src/lib/sektor-api/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "./src/lib/sektor-api/__generated__/types.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
