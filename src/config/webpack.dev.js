const merge = require('webpack-merge');
const port = process.env.NODE_PORT ? process.env.NODE_PORT : '8080';
const common = require('./webpack.common.js');
path = require("path"),
    module.exports = merge(common, {
        devtool: 'inline-source-map',
        mode: 'development',
        output: {
            filename: '[name].min.js',
            chunkFilename: '[name].min.js',
            publicPath: 'http://localhost:' + port + '/',
            libraryTarget: 'umd',
            umdNamedDefine: true,
        },
        devServer: {
            contentBase: path.join(__dirname, "../../dist/"),
            port: port,
            hot: true,
            open: true
        },
        watch: true,
    });