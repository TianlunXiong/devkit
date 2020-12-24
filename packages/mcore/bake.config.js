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
    }),
  ],
};

function ExposedComponent(src) {
  if (!src) return {};
  const files = fs.readdirSync(src);
  const validFiles = files.filter(
    (item) => {
      return !/^\./.test(item) && item !== 'utils' && item !== 'utils-pc' && item !== 'index.tsx';
    }
  );

  const obj = {};
  obj['.'] = './src/index.tsx';
  obj['./style'] = './src/style/entry.tsx';
  obj['./style-pc'] = './src/style-pc/entry.tsx';

  validFiles.forEach((item) => {
    if (item !== 'style' && item !== 'style-pc') {
      obj[`./${item}`] = `./${path.join('./', src, `${item}/index.tsx`)}`;
      obj[`./${item}/style`] = `./${path.join('./', src, item, 'style/index.tsx')}`;
    }
  });
  return obj;
}
