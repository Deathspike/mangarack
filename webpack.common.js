const rules = [
  {test: /\.css$/, use: 'css-loader'},
  {test: /\.(woff|woff2)$/, use: 'url-loader'}
];

module.exports = {
  entry: './dist/web/app.js',
  output: {filename: 'web.min.js', path: __dirname + '/public'},
  module: {rules}
};
