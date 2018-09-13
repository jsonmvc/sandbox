
import { Config, environment } from 'webpack-config'

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var assetsPath = __dirname + '/src/client/assets'
var host = 'localhost'
var port = 8010;

environment.setAll({
    env: function() {
        return process.env.NODE_ENV
    }
});

module.exports = new Config().merge({
  devtool: 'source-map',
  context: __dirname,
  entry: {
    vendor: [
      'firebase',
      '@firebase/auth',
      '@firebase/app',
      '@firebase/firestore',
      'jsonmvc',
      'jsonmvc-datastore',
      'jsonmvc-helper-observer',
      'jsonmvc-helper-stream',
      'moment',
      'ajv',
      'most',
      'jsonmvc-module-ui',
      'jsonmvc-module-time',
      'enquire.js',
      'camelcase',
      'jsonmvc-util-changes',
      'jsonmvc-util-load',
    ],
  },
  output: {
    path: assetsPath,
    filename: 'vendor.js',
    library: "vendor_lib_[hash]",
  },
  resolve: {
    modules: [
      'src',
      'assets',
      'node_modules'
    ],
    extensions: [ '.json', '.js', '.jsx' ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DllPlugin({
      name: "vendor_lib_[hash]",
      path: path.join( assetsPath, '[name]-manifest.json' ),
      context: __dirname
    }),
    new webpack.IgnorePlugin( /webpack-stats\.json$/ ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false
    }),
  ]
});
