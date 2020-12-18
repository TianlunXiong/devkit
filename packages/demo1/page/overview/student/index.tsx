import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log('😄')
    }, 2000)
  }, [])

  return <div className="title">
    Student1
  </div>
};

export default App;