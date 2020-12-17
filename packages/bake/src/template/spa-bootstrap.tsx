import React from 'react';
import ReactDOM from 'react-dom';
import loadable from '@loadable/component'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


export default (pages) => {
  function App() {
    return (
      <Router>
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
  ReactDOM.render(<App />, document.getElementById('app'))
};

