const { ModuleFederationPlugin } = require('webpack').container;


module.exports = {
  app: 'mpa',
  pages: [
    'page/index.tsx',
    'page/detail/index.tsx',
    'page/overview/index.tsx',
    'page/overview/key.tsx',
    'page/overview/student/index.tsx',
  ],
  output: {
    publicPath: 'auto'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "demo1",
      remotes: {
        component_site: 'component_site@http://0.0.0.0:3002/remoteManifest.js',
        mcore: 'mcore@http://0.0.0.0:3004/remoteManifest.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    })
  ]
};
