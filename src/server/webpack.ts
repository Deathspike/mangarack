import * as webpack from 'webpack';
import * as webpackMiddleware from 'webpack-dev-middleware';
const rules = [
  {test: /\.css$/, use: 'css-loader'},
  {test: /\.(woff|woff2)$/, use: 'url-loader'}
];

const config = {
  entry: __dirname + '/web/app.js',
  output: {filename: 'web.js'},
  module: {rules}
};

// TODO: webpack should happen only when running as dev-build, otherwise use a prebuilt bundle.
export function webpackFactory() {
  return webpackMiddleware(webpack(config), {
    lazy: true,
    publicPath: '/',
    stats: 'errors-only'
  });
}
