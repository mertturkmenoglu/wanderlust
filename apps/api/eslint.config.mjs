import pluginJs from "@eslint/js";
import eslintConfigDrizzle from "eslint-config-drizzle";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintConfigDrizzle,
];
