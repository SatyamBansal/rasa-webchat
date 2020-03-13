const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    // entry: ['babel-polyfill', './index.js'],
    mode: "development",
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "/lib"),
        filename: "index.js",
        library: "WebChat",
        libraryTarget: "umd"
    },
    devServer: {
        stats: "errors-only",
        host: process.env.HOST, // Defaults to `localhost`
        port: process.env.PORT, // Defaults to 8080
        open: true, // Open the page in browser
        contentBase: path.resolve(__dirname, "/lib")
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            { parser: { amd: false } },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "sass-loader",
                        options: {
                            includePaths: [path.resolve(__dirname, "src/scss/")]
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: {
                    loader: "url-loader"
                }
            }
        ]
    },
    plugins: [new CleanWebpackPlugin(["lib"])]
};
