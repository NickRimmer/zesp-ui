const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "@typescript-eslint/no-namespace": OFF, // I would like to disable it, to use singleton alternatives
        "@typescript-eslint/explicit-module-boundary-types": OFF, // it is more comfortable to control it by developers itself
        "@typescript-eslint/no-unused-vars": [WARN, {"args": "none"}], // disable warnings for unused function args
        "@typescript-eslint/no-non-null-assertion": OFF, // developers are responsible for null possible vars
    }
};