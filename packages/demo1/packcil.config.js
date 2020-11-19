// const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  pages: ['src/page/home/home.tsx'],
  boot: './src/page/bootstrap.tsx',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/page/index.html'
    })
  ]
};