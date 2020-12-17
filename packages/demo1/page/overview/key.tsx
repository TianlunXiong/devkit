import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log('😄')
    }, 3000)
  }, [])

  return <div className="title">
    Key1
  </div>
};

export default App;