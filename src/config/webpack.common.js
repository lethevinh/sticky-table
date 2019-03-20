var webpack = require("webpack"),
    path = require("path"),
    env = ENV = process.env.NODE_ENV = process.env.ENV = 'production',
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    WriteFilePlugin = require("write-file-webpack-plugin");

const extractAppStyle = new ExtractTextPlugin({
    filename: "css/sticky-table.min.css",
});

var options = {
    entry: {
        "sticky-table": path.join(__dirname, "../", "main.ts"),
    },
    output: {
        filename: "[name].min.js"
    },
    resolve: {
        extensions: ['.ts', '.js', ".scss", '.pug', '.css']
    },
    module: {
        rules: [{
                test: /\.(sa|sc|c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                exclude: /node_modules/
            },
            { test: /\.pug$/, loader: 'pug-loader' },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // clean the build folder
        new CleanWebpackPlugin(),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../template/", "base.pug"),
            filename: "index.html",
            chunks: ["sticky-table"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../template/", "top-bottom.pug"),
            filename: "top-bottom.html",
            chunks: ["sticky-table"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../template/", "left-top.pug"),
            filename: "left-top.html",
            chunks: ["sticky-table"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../template/", "left-right.pug"),
            filename: "left-right.html",
            chunks: ["sticky-table"]
        }),
        extractAppStyle,
        new WriteFilePlugin()
    ]
};

if (env.NODE_ENV === "development") {
    options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;