import React from 'react';
import { Link } from 'react-router-dom'
import './index.scss'

const App = () => {

  return (
    <div className="title">
      Home
      <br/>
      <Link to="/detail">detail1</Link>
      <br/>
      <Link to="/overview">overview</Link>
      <br/>
      <Link to="/overview/student">student</Link>
      <br/>
      <Link to="/overview/key">key</Link>
    </div>
  );
};

export default App;