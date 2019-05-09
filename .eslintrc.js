module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
        '@vue/typescript'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4],
        'max-len': ['error', 500],
        'no-plusplus': ['off'],
        'class-methods-use-this': ['off'],
        'comma-dangle': ['error', 'never'],
        'no-param-reassign': ['off'],
        'prefer-destructuring': ['off'],
        'import/prefer-default-export': ['off'],
        'prefer-const': ['off'],
        eqeqeq: ['off'],
        'import/no-webpack-loader-syntax': ['off'],
        'import/no-dynamic-require': ['off'],
        'global-require': ['off'],
        'import/no-cycle': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'func-names': ['off'],
        'no-use-before-define': ['off'],
        'brace-style': ['off'],
        'guard-for-in': ['off'],
        'no-restricted-syntax': ['off'],
        'no-continue': ['off'],
        'no-underscore-dangle': ['off'],
        'no-shadow': ['off'],
        'implicit-arrow-linebreak': ['off'],
        'consistent-return': ['off']
    },
    parserOptions: {
        parser: '@typescript-eslint/parser'
    }
};
