const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
  devtool: 'inline-source-map',
});
