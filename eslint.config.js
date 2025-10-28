import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,    // fixes 'process' is not defined
        ...globals.vitest,  // for tests: describe/it/expect
      },
    },
    settings: {
      react: {
        version: "detect", // removes the "React version not specified" warning
      },
    },
    rules: {
      // allow unused underscore-prefixed args, e.g. (_req, _res, _next)
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
]);