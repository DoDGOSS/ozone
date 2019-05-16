const HTMLWebpackPlugin = require("html-webpack-plugin");

function getTemplateForEntrypoint(entryPointName) {
    return (compilation, assets, assetTags, options) => {
        const webpack = compilation.getStats().toJson();

        const _assets = webpack.entrypoints[entryPointName].assets;

        const scripts = _assets.filter((asset) => asset.endsWith(".js"));
        const stylesheets = _assets.filter((asset) => asset.endsWith(".css"));

        return { scripts, stylesheets };
    };
}

const IndexPageTemplate = new HTMLWebpackPlugin({
    filename: "index.html",
    template: "templates/index.html.hbs",
    templateParameters: getTemplateForEntrypoint("main"),
    inject: false
});

const IndexPageGspTemplate = new HTMLWebpackPlugin({
    filename: "index.gsp",
    template: "templates/index.gsp.hbs",
    templateParameters: getTemplateForEntrypoint("main"),
    inject: false
});

const ConsentPageTemplate = new HTMLWebpackPlugin({
    filename: "consent.html",
    template: "templates/consent.html.hbs",
    templateParameters: getTemplateForEntrypoint("consent"),
    inject: false
});

const ConsentPageGspTemplate = new HTMLWebpackPlugin({
    filename: "consent.gsp",
    template: "templates/consent.gsp.hbs",
    templateParameters: getTemplateForEntrypoint("consent"),
    inject: false
});


const LoginPageTemplate = new HTMLWebpackPlugin({
    filename: "login.html",
    template: "templates/login.html.hbs",
    templateParameters: getTemplateForEntrypoint("login"),
    inject: false
});

const LoginPageGspTemplate = new HTMLWebpackPlugin({
    filename: "login.gsp",
    template: "templates/login.gsp.hbs",
    templateParameters: getTemplateForEntrypoint("login"),
    inject: false
});

module.exports = {
    htmlTemplates: [
        IndexPageTemplate,
        ConsentPageTemplate,
        LoginPageTemplate
    ],
    gspTemplates: [
        IndexPageGspTemplate,
        ConsentPageGspTemplate,
        LoginPageGspTemplate
    ]
};
