module.exports = {
  extends: [
    `react-app`,
    `plugin:sonarjs/recommended`,
    `plugin:import/errors`,
    `plugin:import/warnings`,
    `plugin:import/typescript`,
    `plugin:markdown/recommended`,
  ],
  globals: {
    __PATH_PREFIX__: true,
  },
  overrides: [
    {
      files: [`**/*.md`],
      processor: `markdown/markdown`,
    },
  ],
  parser: `@typescript-eslint/parser`,
  plugins: [
    `@typescript-eslint`,
    `sonarjs`,
    `sort-keys-fix`,
    `import`,
  ],
  processor: `disable/disable`,
  root: true,
  rules: {
    "@typescript-eslint/no-redeclare": [`error`],
    "comma-dangle": [
      `warn`,
      `always-multiline`,
    ],
    "jsx-a11y/accessible-emoji": `off`,
    "no-redeclare": `off`,
    "prefer-const": `warn`,
    quotes: [
      `error`,
      `backtick`,
    ],
    semi: [
      `warn`,
      `never`,
    ],
    "sort-keys-fix/sort-keys-fix": `warn`,
  },
}