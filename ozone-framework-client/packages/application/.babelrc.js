module.exports = {

    presets: [
        [require("@babel/preset-env").default, {
            corejs: "3",
            modules: false,
            useBuiltIns: "entry",
            targets: {
                browsers: ["last 2 versions", "ie >= 11"]
            }
        }],
        [require("@babel/preset-typescript").default],
        [require("@babel/preset-react").default]
    ],

    plugins: [
        [require("react-hot-loader/babel")],
        [require("@babel/plugin-proposal-object-rest-spread").default],
        [require("@babel/plugin-proposal-class-properties").default, {
            loose: true
        }],
        [require("@babel/plugin-transform-runtime").default, {
            absoluteRuntime: false,
            corejs: false,
            helpers: true,
            regenerator: true,
            useESModules: false
        }]
    ],

    env: {
        test: {
            presets: [
                "@babel/react",
                "@babel/typescript",
                ["@babel/env", { "modules": "commonjs" }]
            ],
            plugins: [
                "@babel/plugin-transform-modules-commonjs"
            ]
        }
    }

};
