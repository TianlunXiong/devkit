import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from './pages/index';
import Components from './pages/components';
import NotFound from './pages/NotFound';
import { Favicon } from './components/Meta';
import './app.scss';
import 'mcore/style';
import 'mcore/style-pc';

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/components/:component" component={Components} />
        <Route component={NotFound} />
      </Switch>
      <Favicon />
    </>
  );
}

export default App;