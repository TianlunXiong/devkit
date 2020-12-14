// const { ModuleFederationPlugin } = require("webpack").container;

/**
 * @description bake 配置文件
 * 
 * @field app 应用类型
 * @type {string}
 * @requires
 * @name spa 单页 Web 应用
 * @name mpa 多页 Web 应用
 * @name cmp 组件库
 * 
 * @field html 页面的 html 模版文件
 * @description 比如 spa，针对首页就会生成一个 index.html 文件，而 mpa 就会生成多个
 * @type {string}
 * @default true
 */
module.exports = {
  app: 'spa',
  html: 'page/index.html',
  boot: 'page/bootstrap.tsx',
  pages: [
    'page/index/index.tsx',
    'page/overview/index.tsx',
  ],
  css: 'style',
};
