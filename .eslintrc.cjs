module.exports = {
  env: {
    browser: true,
    es2022: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ['./.eslintrc.js'],
      parserOptions: { project: null },
      rules: {}
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json']
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'space-before-function-paren': ['warn', 'never'],
    '@typescript-eslint/space-before-function-paren': ['warn', 'never'],
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-trailing-spaces': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'no-debugger': 'off',
    eqeqeq: 'off',
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          attributes: false
        }
      }
    ]
  }
}
