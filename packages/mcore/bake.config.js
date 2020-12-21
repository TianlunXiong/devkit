const { ModuleFederationPlugin } = require('webpack').container;
const fs = require('fs');
const path = require('path');

const src = './src';

module.exports = {
  app: 'spa',
  components: src,
  plugins: [
    new ModuleFederationPlugin({
      name: 'mcore',
      filename: 'remoteManifest.js',
      exposes: ExposedComponent(src),
      shared: ['react', '@babel/runtime', '@babel/runtime-corejs3'],
    }),
  ],
};

function ExposedComponent(src) {
  if (!src) return {};
  const files = fs.readdirSync(src);
  let hasIndex = false;
  const validFiles = files.filter(
    (item) => {
      if (item === 'index.tsx') hasIndex = true
      return !/^\./.test(item) && item !== 'utils' && item !== 'index.tsx';
    }
  );

  const obj = {};
  if (hasIndex) obj['.'] = './src/index.tsx';

  validFiles.forEach((item) => {
    obj[`./${item}`] = `./${path.join('./', src, `${item}/index.tsx`)}`;
    if (item !== 'style') {
      obj[`./${item}/style`] = `./${path.join('./', src, item, 'style/index.tsx')}`;
    }
  });
  return obj;
}
