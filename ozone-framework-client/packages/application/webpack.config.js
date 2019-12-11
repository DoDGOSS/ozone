const path = require("path");

const webpack = require("webpack");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleTracker = require('webpack-bundle-tracker');

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { getLocalIdent } = require("./scripts/getCSSModuleLocalIdent");

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV !== "production";

const BUILD_PATH = path.join(__dirname, "/build");

const SASS_REGEX = /\.(scss|sass)$/;
const SASS_MODULE_REGEX = /\.module\.(scss|sass)$/;

const STATS_OPTIONS = {
    all: false,
    entrypoints: true,
    errorDetails: true,
    errors: true,
    maxModules: 0,
    modules: false,
    moduleTrace: true,
    warnings: true
};

module.exports = {

    mode: isProduction ? "production" : "development",

    stats: STATS_OPTIONS,

    performance: {
        hints: false
    },

    devtool: isProduction ? "source-map" : "cheap-module-source-map",

    devServer: {
        host: "0.0.0.0",
        port: process.env.PORT || "3000",
        hot: true,
        contentBase: path.join(__dirname, "public"),
        watchContentBase: true,
        writeToDisk: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        historyApiFallback: true,
        stats: STATS_OPTIONS
    },

    entry: {
        main: ["react-hot-loader/patch", path.join(__dirname, "/src/pages/MainPage/index.tsx")],
        consent: ["react-hot-loader/patch", path.join(__dirname, "/src/pages/ConsentPage/index.tsx")],
        login: ["react-hot-loader/patch", path.join(__dirname, "/src/pages/LoginPage/index.tsx")]
    },

    output: {
        filename: isDevelopment ? "scripts/[name].js" : "scripts/[name].[contenthash:8].js",
        chunkFilename: isDevelopment ? `scripts/[name].chunk.js` : "scripts/[name].[contenthash:8].chunk.js",
        path: BUILD_PATH,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: require.resolve("babel-loader")
            },

            {
                enforce: "pre",
                test: /\.js$/,
                loader: require.resolve("source-map-loader")
            },

            {
                test: /\.css$/,
                loaders: [
                    getStyleLoader(),
                    require.resolve("css-loader")
                ]
            },

            {
                test: SASS_REGEX,
                exclude: SASS_MODULE_REGEX,
                loaders: [
                    getStyleLoader(),
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            modules: "global",
                            getLocalIdent: getLocalIdent
                        }
                    },
                    require.resolve("sass-loader")
                ]
            },

            {
                test: SASS_MODULE_REGEX,
                loaders: [
                    getStyleLoader(),
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            modules: "local",
                            getLocalIdent: getLocalIdent
                        }
                    },
                    require.resolve("sass-loader")
                ]
            },

            {
                test: /\.hbs$/,
                loader: "handlebars-loader"
            },

            {
                test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                loader: require.resolve("file-loader"),
                options: {
                    name: "assets/[name].[contenthash:8].[ext]"
                }
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    plugins: getPlugins(),

    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                polyfill: {
                    name: "polyfill",
                    test: /[\\/]node_modules[\\/](core-js|regenerator-runtime)[\\/]/,
                    priority: 0,
                    enforce: true
                },
                blueprint: {
                    name: "blueprint",
                    test: /[\\/]node_modules[\\/](@blueprintjs|dom4|normalize\.css|popper\.js|react-popper|react-transition-group|resize-observer-polyfill|typed-styles|warning)[\\/]/,
                    priority: 0,
                    enforce: true
                },
                mosaic: {
                    name: "mosaic",
                    test: /[\\/]node_modules[\\/](react-mosaic-component|react-dnd|react-dnd-html5-backend)[\\/]/,
                    priority: 0,
                    enforce: true
                },
                vendors: {
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    enforce: true
                },
                default: {
                    minChunks: 5,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }

};

function getPlugins() {
    const plugins = [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({'envChecker': isProduction}),
        new BundleTracker({
            filename: './webpack-stats.json'
        })
    ];

    if (isProduction) {
        plugins.push(
            new webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash:8].css",
                chunkFilename: "css/[name].[contenthash:8].chunk.css"
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify("production")
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
                reportFilename: "../reports/bundle-analysis.html",
                logLevel: "warn"
            }),
        );
    } else {
        plugins.push(
            new webpack.NamedModulesPlugin(),
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: true,
                cwd: process.cwd()
            }),
            new webpack.HotModuleReplacementPlugin(),
        );
    }

    return plugins;
}

function getStyleLoader() {
    if (isDevelopment) return require.resolve("style-loader");

    return {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: "../"
        }
    };
}
