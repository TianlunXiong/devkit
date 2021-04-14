// const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  app: 'mpa',
  boot: 'pages/index/boot',
  output: {
    publicPath: '/',
  },
  pages: [
    {
      pathname: '/gogo',
      html: 'pages/index/index.html',
      src: 'pages/index/index.tsx',
      exact: true,
    }
  ],
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
  ]
};
