import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

export default (App) => {
  ReactDOM.render((
    <HashRouter>
      <App />
    </HashRouter>
  ), document.getElementById('app'));
}
