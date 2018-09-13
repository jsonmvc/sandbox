import webpack from 'webpack'
import path from 'path'
import { Config } from 'webpack-config'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const tailwindConfig = require('./tailwind')

process.env.CLIENT_PATH = __dirname + '/src/client'
process.env.SCHEMA_PATH = __dirname + '/src/schema'
process.env.SERVER_PATH = __dirname + '/src/server'
process.env.DIST_PATH = __dirname + '/www'
process.env.HOST_IP = 'localhost'
process.env.HOST_PORT = '8010'
process.env.ROOT_ELEMENT_ID = 'app'
process.env.APP_TITLE = ''
process.env.LIB_PATH = __dirname + '/src/shared/lib'
process.env.TAILWIND_FLAVOUR='tachyons'

const envVars = {
  'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  'process.env.APP_TITLE': `"${process.env.APP_TITLE}"`,
  'process.env.ROOT_VIEW': `"${process.env.ROOT_VIEW}"`,
  'process.env.ROOT_ELEMENT_ID': `"${process.env.ROOT_ELEMENT_ID}"`,
  'process.env.RESPONSIVE': `${JSON.stringify(tailwindConfig.screens)}`,
  BASE_URL: `"${process.env.BASE_URL}"`,
  BASE_PATH: `"${process.env.BASE_PATH}"`,
}

let exclude
if (process.env.NODE_ENV === 'development') {
  exclude = /node_modules/
} else {
  exclude = /^asdfwerqweasd$/
}

const conf = new Config()
  .merge({
    node: {
      fs: 'empty'
    },
    filename: __filename,
    devtool: 'source-map',
    output: {
      filename: '[name].js',
      path: process.env.DIST_PATH,
      publicPath: '/'
    },
    entry: {
      vendor: [
        //'@firebase/auth',
        //'@firebase/app',
        //'@firebase/firestore',
        'jsonmvc',
        'jsonmvc-datastore',
        //'jsonmvc-helper-observer',
        //'jsonmvc-helper-stream',
        //'moment',
        //'ajv',
        //'most',
        //'hammerjs',
        'jsonmvc-module-ui',
        //'jsonmvc-module-time',
        //'enquire.js',
        //'camelcase',
        //'jsonmvc-util-changes',
        //'jsonmvc-util-load'
      ],
      app: [
         `${process.env.CLIENT_PATH}/app`
      ]
    },
    resolve: {
      modules: [
        process.env.CLIENT_PATH,
        'node_modules'
      ],
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
      extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml']
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ExtractTextPlugin('[name].css?[hash]'),
      new PurgecssPlugin({
        paths: glob.sync(__dirname + '/src/client/views/**/*.pug')
      }),
      new webpack.DefinePlugin(envVars),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
      new BundleAnalyzerPlugin(),
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: `${process.env.CLIENT_PATH}/assets/index.production.ejs`,
        mobile: true,
        baseHref: process.env.HOST_IP,
        appMountId: process.env.ROOT_ELEMENT_ID,
        title: process.env.APP_TITLE,
        hash: true
      })
    ],
    module: {
      rules: [
        { enforce: 'pre', test: /\.yml|\.yaml$/, exclude: exclude, loaders: ['json-loader', 'yaml-loader'] },
        { enforce: 'pre', test: /\.json$/, loader: 'json-loader' },
        { enforce: 'pre', test: /\.png$/, loader: 'url-loader?limit=5000' },
        { enforce: 'pre', test: /\.css$/, exclude: /node_modules(?!\/framework7)(?!\/flatpickr)(?!\/bulma)(?!\/materialize)|global\.css/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                    loader: 'css-loader',
                    options: {
                      importLoaders: 1,
                      minimize: true
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
          })
        },
        { enforce: 'pre', test: /\.jpg$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
        { enforce: 'pre', test: /\.gif$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
        { enforce: 'pre', test: /\.woff/, loader: 'url-loader?prefix=font/&limit=5000' },
        { enforce: 'pre', test: /\.woff2/, loader: 'url-loader?prefix=font/&limit=5000' },
        { enforce: 'pre', test: /\.eot/, loader: 'file-loader?prefix=font/' },
        { enforce: 'pre', test: /\.ttf/, loader: 'file-loader?prefix=font/' },
        { enforce: 'pre', test: /\.svg/, loader: 'file-loader?prefix=font/' },
        { enforce: 'pre', test: /\.pug$/, loader: 'jsonmvc-pug-view-loader' },
        { enforce: 'pre', test: /\.html$/, loader: 'html-loader', query: { minimize: true } },
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        },
        { test: /\.js$/, exclude: exclude, loader: 'babel-loader',
          query: {
            compact: false,
            cacheDirectory: true,
            presets: ['es2015'],
            plugins: [
              'add-module-exports',
              'transform-pug-html'
            ]
          }
        }
      ]
    }
  })

module.exports = conf




