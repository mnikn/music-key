const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './examples/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        }]
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src/')
        },
        extensions: ['.js', '.ts']
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./examples/index.html"
        })
    ]
};