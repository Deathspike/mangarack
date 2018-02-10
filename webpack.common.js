const rules = [
  {test: /\.css$/, use: 'css-loader'},
  {test: /\.js$/, use: 'source-map-loader'},
  {test: /\.(woff|woff2)$/, use: 'url-loader'}
];

module.exports = {
  entry: './dist/client.js',
  output: {filename: 'client.min.js', path: __dirname + '/public'},
  module: {rules}
};
