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
    {
      pathname: '/demo',
      src: 'pages/demo/app.tsx',
      boot: 'pages/demo/bootstrap.tsx',
      html: './pages/demo/index.html',
    },
  ],
  resolve: {
    alias: {
      '@': path.join(process.cwd(), './'),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'site',
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        '@babel/runtime-corejs3': {
          singleton: true,
        },
      },
      remotes: {
        mmodule: 'mmodule@http://0.0.0.0:3005/remoteManifest.js',
        mcore: 'mcore@http://0.0.0.0:3004/remoteManifest.js',
      },
    }),
  ],
};
