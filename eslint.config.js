import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    html: true,
  },
  ignores: [
    '**/playwright-report/',
    '**/test-results/',
    '**/dist/',
  ],
}, {
  rules: {
    'array-bracket-newline': [
      'error',
      'consistent',
    ],
    'array-element-newline': [
      'error',
      'consistent',
    ],
    'object-curly-newline': [
      'error',
      { consistent: true },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],

    'no-console': 'off',
    'node/prefer-global/process': 'off',
    'ts/consistent-type-definitions': 'off',
  },
})
