// const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  pages: ['src/page/home/index.tsx', 'src/page/overview/index.tsx'],
  boot: './src/page/bootstrap.tsx',
  template: './src/page/index.html',
};