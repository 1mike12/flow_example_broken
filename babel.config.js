module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    env: {
        production: {},
    },
    plugins: [
        ["@babel/plugin-proposal-decorators", {legacy: true,}],
        ["@babel/plugin-transform-flow-strip-types"],
        ["@babel/plugin-proposal-class-properties", {"loose": false}],
        ["@babel/plugin-proposal-optional-catch-binding"],
    ],
}
