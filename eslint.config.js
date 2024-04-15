import antfu from '@antfu/eslint-config'
import tailwind from '@kalimahapps/eslint-plugin-tailwind'

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
  plugins: {
    tailwind,
  },
  rules: {
    'tailwind/sort': 'error',
    'tailwind/multiline': [
      'error',
      {
        maxLen: 40,
      },
    ],
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
