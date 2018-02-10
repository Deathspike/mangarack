const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [new UglifyJSPlugin({sourceMap: true})]
});
