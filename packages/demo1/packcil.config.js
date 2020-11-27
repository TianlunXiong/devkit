// const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // mode: 'development',
  pages: ['src/page/home/home.tsx', 'src/page/overview/overview.tsx'],
  boot: './src/page/bootstrap.tsx',
  template: './src/page/index.html',
  devServer: {
    writeToDisk: true
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'oka',
  //     // template: './src/page/index.html',
  //     chunks: ['home']
  //   })
  // ],
  // optimization: {
  //   runtimeChunk: { name: "runtime" },
  // },
};