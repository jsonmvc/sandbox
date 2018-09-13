import path from 'path'
import webpack from 'webpack'
import { Config } from 'webpack-config'
import HtmlWebpackPlugin from 'html-webpack-plugin'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const exclude = /node_modules/

process.env.NODE_ENV = 'development'
process.env.CLIENT_PATH = __dirname + '/src/client'
process.env.SCHEMA_PATH = __dirname + '/src/schema'
process.env.SERVER_PATH = __dirname + '/src/server'
process.env.DIST_PATH = __dirname + '/www'
process.env.HOST_IP = 'localhost'
process.env.HOST_PORT = '8080'
process.env.ROOT_ELEMENT_ID = 'app'
process.env.APP_TITLE = ''
process.env.LIB_PATH = __dirname + '/src/client/lib'
process.env.TAILWIND_FLAVOUR = 'tachyons'

console.log('NODE_ENV', process.env.NODE_ENV)

const tailwindConfig = require('./tailwind.js')

const envVars = {
  'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  'process.env.APP_TITLE': `"${process.env.APP_TITLE}"`,
  'process.env.ROOT_VIEW': `"${process.env.ROOT_VIEW}"`,
  'process.env.ROOT_ELEMENT_ID': `"${process.env.ROOT_ELEMENT_ID}"`,
  'process.env.RESPONSIVE': `${JSON.stringify(tailwindConfig.screens)}`,
  BASE_URL: `"${process.env.BASE_URL}"`,
  BASE_PATH: `"${process.env.BASE_PATH}"`,
}

module.exports = new Config().merge({
  cache: true,
  node: {
    fs: 'empty'
  },
  devtool: 'inline-eval-cheap-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    path: process.env.DIST_PATH,
    pathinfo: true,
    publicPath: `http://${process.env.HOST_IP}:${process.env.HOST_PORT}/`
  },
  resolve: {
    alias: {
      'lib': process.env.LIB_PATH,

      'controllers': `${process.env.CLIENT_PATH}/controllers`,
      'models': `${process.env.CLIENT_PATH}/models`,
      'views': `${process.env.CLIENT_PATH}/views`,

      'model': `${process.env.CLIENT_PATH}/model`,
      'db': `${process.env.CLIENT_PATH}/db`,
      'controller': `${process.env.CLIENT_PATH}/controller`,
      'view': `${process.env.CLIENT_PATH}/view`,

      'schema': `${process.env.SCHEMA_PATH}`,
      'data': `${process.env.DATA_PATH}`,

      'assets': `${process.env.CLIENT_PATH}/assets`,
      'css': `${process.env.CLIENT_PATH}/assets/css`,
      'fonts': `${process.env.CLIENT_PATH}/assets/fonts`,
      'js': `${process.env.CLIENT_PATH}/assets/js`,
      'images': `${process.env.CLIENT_PATH}/assets/images`
    },
    modules: [
      process.env.CLIENT_PATH,
      'node_modules'
    ],
    extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml'],
  },
  entry: {
    server: [
      `webpack-dev-server/client?http://${process.env.HOST_IP}:${process.env.HOST_PORT}`,
      'webpack/hot/dev-server'
    ],
    app: [
      `${process.env.CLIENT_PATH}/app`
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envVars),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    // new BundleAnalyzerPlugin(),
    //new webpack.LoaderOptionsPlugin({
    //  debug: true
    //}),
    new webpack.DllReferencePlugin({
      manifest: require(__dirname + '/src/client/assets/vendor-manifest.json'),
      context: "."
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: `${process.env.CLIENT_PATH}/assets/index.development.ejs`,
      mobile: true,
      baseHref: process.env.HOST_IP,
      appMountId: process.env.ROOT_ELEMENT_ID,
      devServer: `http://${process.env.HOST_IP}:${process.env.HOST_PORT}`,
      title: process.env.APP_TITLE,
      hash: true
    })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: `${process.env.CLIENT_PATH}/assets`,
    hot: true,
    inline: true,
    stats: {
      timings: true,
      chunks: false,
      assets: false,
      hash: false,
      cached: false,
      chunkModules: false,
      entrypoints: false,
      modules: false,
      usedExports: false,
      version: false
    },
    port: process.env.HOST_PORT,
    host: process.env.HOST_IP,
  },
  module: {
    rules: [
      { enforce: 'pre', test: /\.yml|\.yaml$/, exclude: exclude, loaders: ['json-loader', 'yaml-loader']  },
      { enforce: 'pre', test: /\.json$/, exclude: exclude, loader: 'json-loader' },
      { enforce: 'pre', test: /\.png$/, exclude: exclude, loader: 'url-loader?limit=5000' },
      { enforce: 'pre', test: /\.css$/, exclude: exclude,
          use: [
            'style-loader',
             {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  alias: {
                    './fonts': '../fonts'
                  }
                }
             },
             {
                loader: 'postcss-loader',
                options: {
                  plugins: (loader) => ([
                    require('postcss-import'),
                    require('tailwindcss')(__dirname + '/tailwind.js'),
                    require('autoprefixer')
                  ])
                }
             }
          ]
      },
      { enforce: 'pre', test: /\.jpg$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { enforce: 'pre', test: /\.gif$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { enforce: 'pre', test: /\.woff/, exclude: exclude, loader: 'url-loader?prefix=font/&limit=5000' },
      { enforce: 'pre', test: /\.woff2/, exclude: exclude, loader: 'url-loader?prefix=font/&limit=5000' },
      { enforce: 'pre', test: /\.eot/, exclude: exclude, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.ttf/, exclude: exclude, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.svg/, exclude: exclude, loader: 'file-loader?prefix=font/' },
      { enforce: 'pre', test: /\.pug$/, exclude: exclude, loader: 'jsonmvc-pug-view-loader' },
      { enforce: 'pre', test: /\.html$/, exclude: exclude, loader: 'html-loader', query: { minimize: true } },
      { test: /\.js$/, exclude: exclude, loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          cacheDirectory: true,
          compact: false,
        }
      }
    ]
  }
})
