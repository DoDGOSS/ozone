const path = require("path");

const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");


const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";


const DefinePluginConfig = new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("production"),
});


const PUBLIC_PATH = "/";

const HTML_TEMPLATES = [
    htmlTemplate("src/widgets/channel-listener/index.html", "channel_listener.html"),
    htmlTemplate("src/widgets/channel-shouter/index.html", "channel_shouter.html"),
    htmlTemplate("src/widgets/color-client/index.html", "color_client.html"),
    htmlTemplate("src/widgets/color-server/index.html", "color_server.html"),
    htmlTemplate("src/widgets/preferences/index.html", "preferences.html"),
    htmlTemplate("src/widgets/widget-search/index.html", "widget_search.html"),
];


module.exports = {

    devServer: {
        host: "localhost",
        port: "4000",
        hot: true,
        publicPath: PUBLIC_PATH,
        contentBase: path.join(__dirname, "public"),
        watchContentBase: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        historyApiFallback: true,
    },

    entry: {
        channel_listener: [
            "react-hot-loader/patch",
            path.join(__dirname, "/src/widgets/channel-listener/index.tsx")
        ],
        channel_shouter: [
            "react-hot-loader/patch",
            path.join(__dirname, "/src/widgets/channel-shouter/index.tsx")
        ],
        color_client: [
            "react-hot-loader/patch",
            path.join(__dirname, "/src/widgets/color-client/index.tsx")
        ],
        color_server: [
            "react-hot-loader/patch",
            path.join(__dirname, "/src/widgets/color-server/index.tsx")
        ],
        preferences: [
            "react-hot-loader/patch",
            path.join(__dirname, "/src/widgets/preferences/index.tsx")
        ],
        widget_search: [
            "react-hot-loader/patch",
            path.join(__dirname, "/src/widgets/widget-search/index.tsx")
        ]
    },

    output: {
        filename: "[name].js",
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
                exclude: /\.module\.css$/,
                loaders: [
                    require.resolve("style-loader"),
                    require.resolve("css-loader")
                ]
            },

            {
                test: /\.(scss|sass)$/,
                exclude: /\.module\.(scss|sass)$/,
                loaders: [
                    require.resolve("style-loader"),
                    require.resolve("css-loader"),
                    require.resolve("sass-loader")
                ]
            },

            {
                test: /\.module\.(scss|sass)$/,
                loaders: [
                    require.resolve("style-loader"),
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            modules: true
                        }
                    },
                    require.resolve("sass-loader")
                ]
            },

            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: require.resolve("url-loader"),
                options: {
                    limit: 10000,
                }
            },

            {
                test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                loader: require.resolve("file-loader"),
                options: {
                    name: "/static/media/[name].[hash:8].[ext]",
                    publicPath: "assets"
                }
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },

    mode: IS_DEVELOPMENT ? "development" : "production",

    plugins: IS_DEVELOPMENT ? [
        new webpack.HotModuleReplacementPlugin(),
        ...HTML_TEMPLATES
    ] : [
        DefinePluginConfig,
        ...HTML_TEMPLATES
    ],

    optimization: {

        splitChunks: {
            cacheGroups: {
                blueprintjs: {
                    name: "blueprintjs",
                    enforce: true,
                    test: /[\\/]node_modules[\\/]@blueprintjs[\\/]/,
                    filename: "vendor/[name].js",
                    chunks: "all",
                    priority: -10
                }
            }
        }

    }

};


function htmlTemplate(template, filename) {
    return new HTMLWebpackPlugin({
        filename,
        template,
        templateParameters: {
            PUBLIC_PATH: PUBLIC_PATH.replace(/\/*$/, "")
        },
        inject: false
    })
}
