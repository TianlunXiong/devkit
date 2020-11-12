

const WebpackTemplate = () => 
`// const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  entries: {
    index: {
      entry: ['./src/bootstrap'],
      template: './src/index.html',
    },
  },
  output: {
    filename: '[id].entry.js',
    chunkFilename: '[id].chunk.js',
  },
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

const BootstrapTemplate = () => `import('./app');`;
const AppTemplate = () => 
`import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

const App = () => <div className="title">Hello, World!</div>;

ReactDOM.render(<App />, document.getElementById('app'));
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
  AppTemplate,
  BootstrapTemplate,
  WebpackTemplate,
  HtmlTemplate,
  ScssTemplate,
}