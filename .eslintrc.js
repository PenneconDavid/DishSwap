module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@next/next/no-img-element": "off", // Only if you want to disable this rule project-wide
  },
};
