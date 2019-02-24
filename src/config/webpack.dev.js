const merge = require('webpack-merge');

const common = require('./webpack.common.js');
path = require("path"),
    module.exports = merge(common, {
        devtool: 'cheap-module-eval-source-map',
        mode: 'development',
        watch: true,
        devServer: {
            contentBase: path.join(__dirname, "../../dist/"),
            port: process.env.port
        },
    });