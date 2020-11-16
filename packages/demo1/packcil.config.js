// const { ModuleFederationPlugin } = require("webpack").container;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const IntermediateEntryPlugin = require("webpack-intermediate-entry");

module.exports = {
  page: ['src/bootstrap.tsx'],
  mode: 'development',
  devServer: {
    before: function (app, server, compiler) {
      app.get('/', function (req, res) {
        res.send(`
        <!DOCTYPE html>
          <html>

          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
            <meta name="format-detection" content="telephone=no, email=no">
            <title>wp5</title>
          </head>

          <body>
            <div id="app"></div>
          </body>
          <script src="bootstrap.entry.js" ></script>
          <script src="vendor.entry.js" ></script>
          </html>
        `);
      });
    },
    writeToDisk: true,
  },
  optimization: {
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendor',
    //       chunks: 'all',
    //     },
    //   },
    // },
    // runtimeChunk: { name: "runtime" },
  },
  // plugins: [
  //   new IntermediateEntryPlugin({ insert: "./src/init.js" })
  // ]
};