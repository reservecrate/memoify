module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'comma-dangle': 0,
    'linebreak-style': ['error', 'windows'],
    eqeqeq: 'error'
  }
};
