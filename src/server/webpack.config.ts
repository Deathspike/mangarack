const rules = [
  {test: /\.css$/, use: 'css-loader'},
  {test: /\.(woff|woff2)$/, use: 'url-loader'}
];

export const webpackConfig = {
  entry: __dirname + '/web/app.js',
  output: {filename: 'web.js'},
  module: {rules}
};
