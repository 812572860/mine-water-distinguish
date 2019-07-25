const path = require('path')
require('babel-polyfill')

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  }
}
