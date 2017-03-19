module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": false
    },
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-constant-condition": ["error", { "checkLoops": false }]
    },
    "globals": {
        "describe": true,
        "it": true,
        "context": true,
        "before": true,
        "beforeEach": true,
        "after": true,
        "afterEach": true,
        "require": true
    }
};