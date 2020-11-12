// const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  entries: {
    index: {
      entry: ['./src/bootstrap'],
      template: './src/index.html',
    },
  },
  output: {
    filename: '[id].entry.js',
    chunkFilename: '[id].chunk.js',
  },
  plugins: [
    // /**
    //  * Webpack 5's new feature.
    //  */
    // new ModuleFederationPlugin({
    //   name: 'app',
    //   library: { type: 'var', name: 'app' },
    //   filename: 'remoteEntry.js',
    //   shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    // }),
  ],
};
