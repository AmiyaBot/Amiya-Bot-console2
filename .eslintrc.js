module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        '@typescript-eslint/no-explicit-any': ['off'],
        'generator-star-spacing': 'off',
        'no-throw-literal': 'off',
        'no-return-assign': 'off',
        'no-return-await': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}
