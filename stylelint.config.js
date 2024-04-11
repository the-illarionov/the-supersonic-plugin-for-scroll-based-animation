/** @type {import('stylelint').Config} */

export default {
  plugins: [
    '@stylistic/stylelint-plugin',
  ],
  extends: [
    'stylelint-config-standard',
    '@stylistic/stylelint-config',
    'stylelint-config-clean-order',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
  },
}
