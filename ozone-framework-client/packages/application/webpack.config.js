const path = require("path");

const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { getLocalIdent } = require("./scripts/getCSSModuleLocalIdent");


const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";


const DefinePluginConfig = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("production"),
});


const PUBLIC_PATH = "/";

const HTMLTemplateConfig = new HTMLWebpackPlugin({
    filename: "index.html",
    template: "public/index.html",
    templateParameters: {
        PUBLIC_PATH: PUBLIC_PATH.replace(/\/*$/, "")
    },
    inject: false
});

module.exports = {

    devServer: {
        host: "localhost",
        port: "3000",
        hot: true,
        publicPath: PUBLIC_PATH,
        contentBase: path.join(__dirname, "public"),
        watchContentBase: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        historyApiFallback: true,
    },

    entry: [
        "react-hot-loader/patch",
        path.join(__dirname, "/src/index.tsx")
    ],

    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "/build"),
        publicPath: PUBLIC_PATH
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
                    require.resolve("style-loader"),
                    require.resolve("css-loader")
                ]
            },

            {
                test: /\.(scss|sass)$/,
                loaders: [
                    require.resolve("style-loader"),
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
                test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                loader: require.resolve("file-loader"),
                options: {
                    name: "[name].[hash:8].[ext]",
                    outputPath: "static/"
                }
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },

    mode: IS_DEVELOPMENT ? "development" : "production",

    plugins: IS_DEVELOPMENT ? [
        new CheckerPlugin(),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            cwd: process.cwd(),
        }),
        new webpack.HotModuleReplacementPlugin(),
        HTMLTemplateConfig,
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "bundle-analysis.html"
        })
    ] : [
        new CheckerPlugin(),
        DefinePluginConfig,
        HTMLTemplateConfig,
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "bundle-analysis.html"
        })
    ],

    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    filename: "vendor.js",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }
    }

};

