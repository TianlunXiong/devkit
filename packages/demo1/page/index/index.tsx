import React, { useEffect } from 'react';
import loadable from '@loadable/component';
// import A from './a';
// import './index.scss';

const A = loadable(() => import('./a'))

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log('看看')
    }, 2000)
  }, [])

  return <div className="title">
    OK23232
    <A fallback={<div>Loading...</div>}  />
  </div>
};

export default App;