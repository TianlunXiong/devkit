// const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  pages: [
    'page/home/index.tsx',
    'page/overview/index.tsx',
  ],
  boot: 'page/bootstrap.tsx',
  template: 'page/index.html',
};