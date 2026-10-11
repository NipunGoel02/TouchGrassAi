import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [...compat.extends("next/core-web-vitals", "next/typescript"), { rules: { "@typescript-eslint/no-explicit-any": "off", "@typescript-eslint/triple-slash-reference": "off", "prefer-const": "off" } }, globalIgnores([".next/**", "node_modules/**"] )];
export default config;
