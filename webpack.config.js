var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
var CompressionPlugin = require("compression-webpack-plugin");
var configDev =require('./config/dev.json')
var configProduct=require('./config/product.json')
var url=require('url')
require('babel-polyfill')

var remoteDevServer = configDev.remoteDevServer["dev"]
var Version = new Date().getTime();
module.exports = {
    entry: {
        vendor:['vue','vuex','vue-router','axios'],
        build:['babel-polyfill','./src/main.js']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: process.env.NODE_ENV === 'production'?'./':'/dist/',
        filename: process.env.NODE_ENV === 'production'?'[name].js?[chunkhash]' + Version:'[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader?sourceMap!sass-loader',
                        'sass': 'vue-style-loader!css-loader?sourceMap!sass-loader?indentedSyntax'
                    },
                    transformToRequire: {
                        "audio": "src"
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|mp3|svg|woff|eot|ttf)$/,
                loader: 'file-loader',
                options: {
                    limit:8192,
                    name: 'assets/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devServer: {
        historyApiFallback: {
            rewrites:[
                { from: /^\/$/, to: configDev.localDevServer.defaultPage },
                { from :/./,to:configDev.localDevServer.defaultPage}
            ]
        },
        noInfo: true,
        host:configDev.localDevServer.host,
        port:configDev.localDevServer.port,
        disableHostCheck: true,
        proxy:{
            '/api/*':{
                target:url.format(remoteDevServer),
                changeOrigin:true,
                secure:false
            },
            '/frontWeb/websocket/*':{
                target:url.format({protocol:'ws',host:remoteDevServer.host,port:remoteDevServer.port}),
                ws:true,
                changeOrigin:true
            },
            '/frontWeb/*':{
                target:url.format({protocol:remoteDevServer.protocol,host:remoteDevServer.host,port:remoteDevServer.port}),
                secure:false
            },
            '/vapi':{
                target:'https://vapi.coinmec.com/',
                changeOrigin:true,
                secure:false
            }
        }
    },
    performance: {
        hints: false
    },
    devtool: '#cheap-module-source-map'
}
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names:['vendor','manifest']
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: true,
                /*不显示控制台打印信息*/
		        drop_debugger: true,
		        drop_console: true,
		        pure_funcs: ['console.log']
            },
            except: ['$super', '$', 'exports', 'require','import']
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new CleanWebpackPlugin(
            ['dist/*'],{root:__dirname,verbose:true,dry:false}
        ),
        // new UglifyjsWebpackPlugin({
        //     beautify:true,
        //     exclude:['/node_modules/'],
        //     compress:{warnings:false},
        //     output:{comments:false}
        // }),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'index-template.html',
            title:configProduct.title,
            favicon:'./src/favicon.ico'
        })
    ])
}
