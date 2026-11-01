
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                document: "readonly",
                window: "readonly",
                console: "readonly",
                alert: "readonly",
                localStorage: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "single"]
        }
    }
];
