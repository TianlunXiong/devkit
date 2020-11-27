import React, { useEffect } from 'react';
import './index.scss';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log('😄')
    }, 2000)
  }, [])

  return <div className="title">
    OK23
  </div>
};

export default App;