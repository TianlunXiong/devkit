
import React from 'react';
import { render } from 'react-dom';

export default (Page) => {
  const App = <Page />;
  render(App, document.getElementById('app'))
};
