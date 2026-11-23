import nextEsLint from "eslint-config-next"

export default [
  ...nextEsLint,
  {
    ignores: ["node_modules", ".next", "out", "build", "dist", "coverage", "prisma/migrations"],
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]
