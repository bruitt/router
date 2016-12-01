var path = require('path')

module.exports = {
  entry: ['./src'],

  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
    publicPath: '/dist/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          extends: path.resolve('./.babelrc')
        }
      }
    ]
  },

  resolve: {
    alias: {
      router: path.resolve(__dirname, '../src')
    }
  }
}