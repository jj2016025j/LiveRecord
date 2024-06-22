module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '*.cjs'],
  parser: '@typescript-eslint/parser',

  plugins: ['react-refresh', 'prettier', 'import', 'prettierx'],
  extends: [
    "plugin:react/recommended",
    'plugin:prettier/recommended',
    'airbnb-typescript'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/react-in-jsx-scope': 0,
    'linebreak-style': ["off", "windows"],
    "import/extensions": [0],
    "@typescript-eslint/indent": "off",
  }
};
