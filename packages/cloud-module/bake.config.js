const { ModuleFederationPlugin } = require('webpack').container;
const fs = require('fs');
const path = require('path');

// const src = './src';

module.exports = {
  app: 'spa',
  plugins: [
    new ModuleFederationPlugin({
      name: 'mmodule',
      filename: 'remoteManifest.js',
      shared: ['react'],
      remotes: {
        mcore: 'mcore@http://0.0.0.0:3004/remoteManifest.js'
      },
      exposes: {
        '.': './src/button.tsx'
      },
    }),
  ],
};

// function ExposedComponent(src) {
//   if (!src) return {};
//   const files = fs.readdirSync(src);
//   let hasIndex = false;
//   const validFiles = files.filter(
//     (item) => {
//       if (item === 'index.tsx') hasIndex = true
//       return !/^\./.test(item) && item !== 'utils' && item !== 'index.tsx';
//     }
//   );

//   const obj = {};
//   if (hasIndex) obj['.'] = './src/index.tsx';

//   validFiles.forEach((item) => {
//     obj[`./${item}`] = `./${path.join('./', src, `${item}/index.tsx`)}`;
//     if (item !== 'style') {
//       obj[`./${item}/style`] = `./${path.join('./', src, item, 'style/index.tsx')}`;
//     }
//   });
//   return obj;
// }
