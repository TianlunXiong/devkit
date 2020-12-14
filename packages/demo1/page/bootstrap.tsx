import React from 'react';
import ReactDOM from 'react-dom';
import loadable from '@loadable/component'
import './index/index.scss'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


export default (Page) => {
  ReactDOM.render(<App pages={Page} />, document.getElementById('app'))
};

function App(props) {
  const { pages } = props;

  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/overview">About</Link>
        </li>
      </ul>
      <Switch>
        {pages.map(({ component, src, pathname, exact }) => {
          const P = loadable(component);
          return (
            <Route key={src} path={pathname} exact={exact}>
              <P />
            </Route>
          );
        })}
      </Switch>
    </Router>
  );
}