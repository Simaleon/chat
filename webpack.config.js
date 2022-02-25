const path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    { VueLoaderPlugin } = require('vue-loader'),
    CopyPlugin = require("copy-webpack-plugin"),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = require('./buildConfig.json');

module.exports = [
    // сервер
    function (env, argv) {
        return {
            name: 'server',
            mode: env.production ? 'production' : 'development',
            target: 'node',
            entry: './src/server/start.ts',
            output: {
                path: path.resolve(__dirname, './dist/server'),
                filename: 'start.js',
                clean: true
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: 'ts-loader',
                        exclude: /node_modules/,
                    }
                ]
            },
            plugins: [
                //new CleanWebpackPlugin(),
                new CopyPlugin({
                    patterns: [
                        { from: path.resolve(__dirname, './src/configs'), to: "./configs" }
                    ]
                }),
                new webpack.DefinePlugin({
                    $IS_PRODUCTION: JSON.stringify(!!env.production)
                })
            ],
            node: {
                __dirname: false
            },
            externals: [ nodeExternals() ],
            resolve: {
                alias: {
                    "@": path.resolve(__dirname, './src')
                },
                extensions: ['.js', '.ts']
            }
        };
    },

    // клиент
    function (env, argv) {
        return {
            name: 'client',
            mode: env.production ? 'production' : 'development',
            entry: {
                vue: 'vue',
                main: {
                    import: './src/client/index.ts',
                    dependOn: 'vue'
                }
            },
            output: {
                path: path.resolve(__dirname, './dist/client/scripts'),
                filename: '[name].js',
                clean: true
            },
            optimization: {
                splitChunks: {
                    chunks: 'all'
                }
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                        },
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'vue-style-loader',
                            'css-loader'
                        ]
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/i,
                        type: 'asset/resource',
                        generator: {
                            filename: '../fonts/[name][ext]'
                        }
                    },
                    {
                        test: /\.(png|jpg|jpeg)$/i,
                        type: 'asset/resource',
                        generator: {
                            filename: '../images/[name][ext]'
                        }
                    }
                ]
            },
            plugins: [
                //new CleanWebpackPlugin(),
                new VueLoaderPlugin(),
                new HtmlWebpackPlugin({
                    title: config.title,
                    template: 'src/client/index.html',
                    filename: '../index.html',
                    chunks: ['vue', 'main'],
                    minify: env.production
                })
            ],
            resolve: {
                alias: {
                    "@": path.resolve(__dirname, './src')
                },
                extensions: ['.js', '.ts']
            }
        };
    }
];