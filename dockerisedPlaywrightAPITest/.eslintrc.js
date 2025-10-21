module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  rules: {
    // Enforce double quotes consistently
    "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": false }],
    
    // TypeScript-specific rules
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-inferrable-types": "off",
    
    // Code quality rules
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    
    // Commenting and documentation
    "spaced-comment": ["error", "always", { "markers": ["/"] }],
    "multiline-comment-style": ["error", "starred-block"],
    
    // Spacing and formatting
    "indent": ["error", 2],
    "comma-dangle": ["error", "never"],
    "semi": ["error", "always"],
    "no-trailing-spaces": "error",
    "eol-last": ["error", "always"]
  },
  env: {
    node: true,
    es2022: true
  },
  ignorePatterns: [
    "dist/**/*",
    "node_modules/**/*",
    "docker/**/*",
    "*.js"
  ]
};