import pluginNext from "@next/eslint-plugin-next";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import pluginTypeScriptEslint from "typescript-eslint";

const reactConfig = {
  files: ["**/*.{ts,tsx}"],
  plugins: {
    react: pluginReact,
    "react-hooks": pluginReactHooks,
    "@next/next": pluginNext,
  },
  rules: {
    ...pluginReact.configs["jsx-runtime"].rules,
    ...pluginReactHooks.configs.recommended.rules,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs["core-web-vitals"].rules,
    semi: ["error", "never"],
    quotes: [
      "error",
      "single",
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
  },
};

const importConfig = {
  files: ["**/*.{ts,tsx}"],
  plugins: {
    import: pluginImport,
    "unused-imports": pluginUnusedImports,
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    ...pluginImport.configs.recommended.rules,
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "import/no-cycle": "error",
    "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        pathGroups: [
          {
            pattern: "{react,react-dom/**,react-router-dom}",
            group: "builtin",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order: "asc",
        },
        "newlines-between": "never",
      },
    ],
  },
};

const tsEslintConfigs = [
  ...pluginTypeScriptEslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: pluginTypeScriptEslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": pluginTypeScriptEslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: true,
        },
      ],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/require-array-sort-compare": [
        "error",
        {
          ignoreStringArrays: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react/jsx-curly-brace-presence": "error",
    },
  },
  {
    files: ["**/page.@(ts|tsx)", "**/route.@(ts|tsx)"],
    rules: {
      "@typescript-eslint/require-await": "off",
    },
  },
];

export default pluginTypeScriptEslint.config(
  { ignores: ["**/*"] },
  reactConfig,
  importConfig,
  ...tsEslintConfigs
);
