const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const webpack = require('webpack');

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    experiments: {
        asyncWebAssembly: true
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode: "development"
}