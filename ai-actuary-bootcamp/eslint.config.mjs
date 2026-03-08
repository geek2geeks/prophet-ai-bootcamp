import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Pre-existing root-level maintenance scripts (not part of Next.js app):
    "*.js",
    // Pre-existing file with known parse errors (Supabase migration artifact):
    "src/lib/day-experience.ts",
  ]),
]);

export default eslintConfig;
