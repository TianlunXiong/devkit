const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  app: 'component',
  components: 'src',
  plugins: [
    new ModuleFederationPlugin({
      name: "mcore",
      filename: 'remoteManifest.js',
      library: { type: "var", name: "mcore" },
      exposes: {
        './button': './src/button',
        './button/style': './src/button/style',
        './style': './src/style/index'
      },
      shared: ['react'],
    })
  ]
}