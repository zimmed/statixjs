const { resolve } = require('path');
const process = require('process');
const nodeExternals = require('webpack-node-externals');
const SITE = require('./helpers/getConfig')();

module.exports = {
  entry: resolve(__dirname, '..', 'src', 'index.ts'),
  devtool: 'inline-source-map',
  target: 'node',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?|jx?ss|tx?ss)$/i,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(x?css|scss|sxss|sass|style|stylesheet|sheet)$/i,
        use: 'raw-loader',
        // include: resolve(process.cwd(), SITE.buildOptions.srcPath),
        // exclude: /node_modules/,
      },
      {
        test: /\.(x?html?|xml)$/i,
        use: 'raw-loader',
        // include: resolve(process.cwd(), SITE.buildOptions.srcPath),
        // exclude: /node_modules/,
      },
      {
        test: /siteconfig\.json$/i,
        use: 'raw-loader',
        // include: resolve(process.cwd()),
        // exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [resolve(process.cwd()), resolve(__dirname, '..'), 'node_modules'],
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.json',
      '.txss',
      '.tss',
      '.jxss',
      '.jss',
      '.htm',
      '.html',
      '.xhtm',
      '.xhtml',
      '.xml',
      '.sass',
      '.scss',
      '.sxss',
      '.xcss',
      '.css',
      '.style',
      '.stylesheet',
      '.sheet',
    ],
  },
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, '..', 'build'),
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()],
};
