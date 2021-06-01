module.exports = {
  env: {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true,
  },
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    extraFileExtensions: ['.json'],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "max-len": [1, 140, 2, { "ignoreComments": true }],
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/unified-signatures": "warn",
    // "http://eslint.org/docs/rules/comma-dangle": "warn",
    "comma-dangle": ["error", {
      "arrays": "only-multiline",
      "objects": "only-multiline",
      "imports": "only-multiline",
      "exports": "only-multiline",
      "functions": "ignore"
    }],
    "constructor-super": "error",
    eqeqeq: ["warn", "always"],
    "import/no-deprecated": "warn",
    "import/no-extraneous-dependencies": "error",
    "import/no-unassigned-import": "warn",
    "no-cond-assign": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-empty": [
      "error",
      {
        allowEmptyCatch: true,
      },
    ],
    // "no-invalid-this": "error",
    "no-new-wrappers": "error",
    "no-param-reassign": "error",
    "no-redeclare": "error",
    "no-sequences": "error",
    "no-shadow": [
      "error",
      {
        hoist: "all",
      },
    ],
    "no-throw-literal": "error",
    "no-unsafe-finally": "error",
    "no-unused-labels": "error",
    "no-unused-vars": "off", // sometimes unused vars improve readability
    "no-var": "warn",
    "no-void": "error",
    "prefer-const": "warn",
    // "no-loops/no-loops": "error",
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.spec.js*"] // don't complain about test imports
    }],
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: "return",
      },
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
