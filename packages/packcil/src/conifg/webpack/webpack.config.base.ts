import { Configuration } from 'webpack';
import babelConfig from '../babel/base';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const resolve = {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.less', '.scss'],
}

const module = {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: babelConfig,
        },
      ],
    },
    {
      test: /\.(css|scss)$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
          },
        },
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 2,
          },
        },
        {
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: true,
            implementation: require('sass'),
          },
        },
      ],
    },
    {
      test: /\.less$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
          },
        },
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 2,
          },
        },
        {
          loader: require.resolve('less-loader'),
        },
      ],
    },
    {
      test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: 1,
            name: 'images/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    {
      test: /\.(woff|woff2|ttf|eot)$/,
      use: [
        {
          loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
        },
      ],
    },
  ]
}

const config: Configuration = {
  module,
  resolve,
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheet/[name].[contenthash:8].css',
      chunkFilename: 'stylesheet/[id].[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
  ],
}

export default config;