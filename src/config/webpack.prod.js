const webpack = require('webpack'),
    merge = require('webpack-merge'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
    OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
    path = require('path');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    output: {
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[id].[hash:6].min.js',
        path: path.join(__dirname, "../../dist/"),
    },
    mode: 'production',
    devtool: 'source-map',
    watch: false,
    stats: {
        colors: false,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: true,
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        minimize: true,
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor_app',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        new ExtractTextPlugin('css/[name].min.css'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
        }),
    ],
});