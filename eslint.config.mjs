
export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                document: "readonly",
                window: "readonly",
                console: "readonly",
                alert: "readonly",
                localStorage: "readonly"
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
