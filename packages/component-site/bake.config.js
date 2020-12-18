const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  app: 'mpa',
  // pages: [
  //   {
  //     pathname: '/',
  //     src: 'pages/web/index.tsx',
  //     html: 'pages/web/index.html',
  //     boot: 'pages/web/bootstrap.tsx',
  //   },
  //   {
  //     pathname: '/demo',
  //     src: 'pages/demo/index.tsx',
  //     html: 'pages/demo/index.html',
  //     boot: 'pages/demo/bootstrap.tsx',
  //   },
  // ],
  css: 'link',
  plugins: [
    new ModuleFederationPlugin({
      name: "component_site",
      filename: 'remoteManifest.js',
      library: { type: "var", name: "component_site" },
      exposes: {
        '.': './pages/web/index.tsx',
        './Homing': './pages/web/index.tsx',
        './mts': './pages/web/msa.tsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'react-intl'],
    })
  ]
};
