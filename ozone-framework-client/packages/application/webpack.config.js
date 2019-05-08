const path = require("path");

const webpack = require("webpack");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const { pageTemplates } = require("./scripts/page-templates");
const { getLocalIdent } = require("./scripts/getCSSModuleLocalIdent");


const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";


const DefinePluginConfig = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("production")
});

const PUBLIC_PATH = "/";

const SASS_REGEX = /\.(scss|sass)$/;
const SASS_MODULE_REGEX = /\.module\.(scss|sass)$/;


module.exports = {

    devServer: {
        host: "0.0.0.0",
        port: process.env.PORT || "3000",
        hot: true,
        publicPath: PUBLIC_PATH,
        contentBase: path.join(__dirname, "public"),
        watchContentBase: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        historyApiFallback: true
    },

    entry: {
        main: ["react-hot-loader/patch", path.join(__dirname, "/src/pages/MainPage/index.tsx")],
        consent: ["react-hot-loader/patch", path.join(__dirname, "/src/pages/ConsentPage/index.tsx")],
        login: ["react-hot-loader/patch", path.join(__dirname, "/src/pages/LoginPage/index.tsx")]
    },

    output: {
        filename: "[name].bundle.js",
        chunkFilename: `[name].chunk.js`,
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
                test: SASS_REGEX,
                exclude: SASS_MODULE_REGEX,
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
                test: SASS_MODULE_REGEX,
                loaders: [
                    require.resolve("style-loader"),
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
        extensions: [".ts", ".tsx", ".js"]
    },

    mode: IS_DEVELOPMENT ? "development" : "production",

    plugins: IS_DEVELOPMENT ? [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            cwd: process.cwd()
        }),
        new webpack.HotModuleReplacementPlugin(),
        ...pageTemplates
    ] : [
        DefinePluginConfig,
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "../reports/bundle-analysis.html"
        }),
        ...pageTemplates
    ],

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
