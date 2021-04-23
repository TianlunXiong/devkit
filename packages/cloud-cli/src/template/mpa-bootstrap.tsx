import React from 'react';
import ReactDOM from 'react-dom';

export default (Page) => {
  ReactDOM.render(<Page />, document.getElementById('app'))
};

