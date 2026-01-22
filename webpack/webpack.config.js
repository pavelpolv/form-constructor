const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ReactCompilerConfig = {
  target: '19'
};

module.exports = {
  entry: path.resolve(__dirname, '..', './src/app/index.tsx'),

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@app': path.resolve(__dirname, '../src/app'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@widgets': path.resolve(__dirname, '../src/widgets'),
      '@features': path.resolve(__dirname, '../src/features'),
      '@entities': path.resolve(__dirname, '../src/entities'),
      '@shared': path.resolve(__dirname, '../src/shared'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                ['babel-plugin-react-compiler', ReactCompilerConfig],
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './public/index.html'),
    }),
  ],

  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: 'bundle.js',
  },
};
