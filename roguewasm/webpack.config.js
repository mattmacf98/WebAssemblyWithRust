const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const webpack = require('webpack');

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    externals: {
        rot: 'ROT'
    },
    experiments: {
        asyncWebAssembly: true
    },
    plugins: [
        new HtmlWebpackPlugin({
             template: './index.html'
        })
    ],
    mode: "development"
}