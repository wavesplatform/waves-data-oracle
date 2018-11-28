const webpack = require('webpack');
const path = require('path');

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './build');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
    context: sourcePath,
    entry: {
        app: './main.tsx'
    },
    output: {
        path: outPath,
        filename: 'bundle.js',
        chunkFilename: '[chunkhash].js'
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        mainFields: ['module', 'browser', 'main'],
        alias: {
            app: path.resolve(__dirname, 'src/app/')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: ['**/test'],
                use: [
                    !isProduction && {
                        loader: 'babel-loader',
                        options: { plugins: ['react-hot-loader/babel'] }
                    },
                    'ts-loader'
                ].filter(Boolean)
            },
            {
                test: /\.less$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        query: {
                            modules: true,
                            sourceMap: !isProduction,
                            importLoaders: 1,
                            localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'less-loader' // compiles Less to CSS
                    }
                ]
            },
            {
                test: /\.css$/,
                include: [/node_modules/],
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            { test: /\.html$/, use: 'html-loader' },
            { test: /\.(a?png|svg)$/, use: 'url-loader?limit=10000' },
            { test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/, use: 'file-loader' }
        ]
    },
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: -10
                }
            }
        },
        runtimeChunk: true
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false
        }),
        new WebpackCleanupPlugin(),
        new MiniCssExtractPlugin({
            filename: '[contenthash].css',
            disable: !isProduction
        }),
        new HtmlWebpackPlugin({
            template: 'assets/index.html'
        })
    ],
    devServer: {
        contentBase: sourcePath,
        hot: true,
        inline: true,
        historyApiFallback: {
            disableDotRule: true
        },
        stats: 'minimal',
        clientLogLevel: 'warning'
    },
    // https://webpack.js.org/configuration/devtool/
    devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
    node: {
        // workaround for webpack-dev-server issue
        // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
        fs: 'empty',
        net: 'empty'
    }
};
