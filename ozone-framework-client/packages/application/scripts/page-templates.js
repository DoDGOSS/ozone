const HTMLWebpackPlugin = require("html-webpack-plugin");

const PUBLIC_PATH = "/";

const IndexPageTemplate = new HTMLWebpackPlugin({
    filename: "index.html",
    template: "public/index.html",
    templateParameters: {
        PUBLIC_PATH: PUBLIC_PATH.replace(/\/*$/, "")
    },
    inject: false
});

const ConsentPageTemplate = new HTMLWebpackPlugin({
    filename: "consent.html",
    template: "public/consent.html",
    templateParameters: {
        PUBLIC_PATH: PUBLIC_PATH.replace(/\/*$/, "")
    },
    inject: false
});

const LoginPageTemplate = new HTMLWebpackPlugin({
    filename: "login.html",
    template: "public/login.html",
    templateParameters: {
        PUBLIC_PATH: PUBLIC_PATH.replace(/\/*$/, "")
    },
    inject: false
});


module.exports = {
    pageTemplates: [
        IndexPageTemplate,
        ConsentPageTemplate,
        LoginPageTemplate
    ]
};
