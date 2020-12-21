import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from './pages/index';
import Components from './pages/components';
import './app.scss';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Index} />
      <Route exact path="/components" component={Components} />
    </Switch>
  );
}

export default App;