const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path')

module.exports = {
  name: 'site',
  app: 'mpa',
  pages: [
    {
      pathname: '/',
      src: 'pages/web/app.tsx',
      boot: 'pages/web/bootstrap.tsx',
      html: './pages/web/index.html',
    },
    'pages/demo/index.tsx',
  ],
  resolve: {
    alias: {
      '@': path.join(process.cwd(), '/'),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'site',
      shared: ['react', 'react-dom', 'react-router-dom'],
      remotes: {
        mmodule: 'mmodule@http://0.0.0.0:3005/remoteManifest.js',
        mcore: 'mcore@http://0.0.0.0:3004/remoteManifest.js',
      },
    }),
  ],
};
