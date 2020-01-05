const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const baseConfig = {
  mode: 'development',
  context: path.resolve(__dirname, '../src'),
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'isomorphic-style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
              importLoaders: 1,
              sourceMap: true
            }
          },
          'sass-loader',
        ]
      },
    ]
  },
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new webpack.NamedModulesPlugin()
  // ]
};

const serverConfig = {
  ...baseConfig,
  entry: {
    'index.js': path.resolve(__dirname, '../src/server/index.js')
  },
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]',
    publicPath: '/'
  },
};

const clientConfig = {
  ...baseConfig,
  entry: {
    'home.js': path.resolve(__dirname, '../src/shared/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist/public'),
    filename: '[name]',
    publicPath: '/'
  }
};

module.exports = [ clientConfig, serverConfig ];