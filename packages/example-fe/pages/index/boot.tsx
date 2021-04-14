
import React from 'react';
import ReactDOM from 'react-dom';
// import loadable from '@loadable/component'
// import {
//   BrowserRouter,
//   HashRouter,
//   Switch,
//   Route,
// } from "react-router-dom";

export default (P) => {
  console.log(P)
  const App = <P />;
  ReactDOM.render(App, document.getElementById('app'))
};
