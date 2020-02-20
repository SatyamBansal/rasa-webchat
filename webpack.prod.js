const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    // entry: ['babel-polyfill', './index.js'],
    mode: "production",
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "/lib"),
        filename: "index.js",
        library: "WebChat",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    mode: "production",
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
