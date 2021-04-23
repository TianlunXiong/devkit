const WebpackTemplate = () => 
`
module.exports = {
  boot: 'pages/index/boot',
  src: {
    'home': 'pages/index/index.tsx',
  },
  pages: {
    '/': 'home'
  },
};
`;

const BootstrapTemplate = () => `
import React from 'react';
import { render } from 'react-dom';

export default (Page) => {
  const App = <Page />;
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
  <title>xcloud-react</title>
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