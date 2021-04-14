

const WebpackTemplate = () => 
`// const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  app: 'mpa',
  boot: 'pages/boot',
  output: {
    publicPath: '/',
  },
  pages: [
    {
      pathname: '/',
      src: 'pages/index.tsx',
      exact: true,
    }
  ],
  plugins: [
    // /**
    //  * Webpack 5's new feature.
    //  */
    // new ModuleFederationPlugin({
    //   name: 'app',
    //   library: { type: 'var', name: 'app' },
    //   filename: 'remoteEntry.js',
    //   shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    // }),
  ]
};
`;

const BootstrapTemplate = () => `
import React from 'react';
import { render } from 'react-dom';
// import loadable from '@loadable/component'
// import {
//   BrowserRouter,
//   HashRouter,
//   Switch,
//   Route,
// } from "react-router-dom";

export default (P) => {
  const App = <P />;
  render(App, document.getElementById('app'))
};
`;

const PageTemplate = () => 
`import React from 'react';
import './index.scss';

const Page = () => <div className="title">Hello, World!</div>;

export default Page;

`

const HtmlTemplate = () => 
`<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <meta name="format-detection" content="telephone=no, email=no">
  <title>wp5</title>
</head>

<body>
  <div id="app"></div>
</body>

</html>
`

const ScssTemplate = () => 
`.title {
  font-size: 24px;
  text-align: center;
}
`

export {
  PageTemplate,
  BootstrapTemplate,
  WebpackTemplate,
  HtmlTemplate,
  ScssTemplate,
}