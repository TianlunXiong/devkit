import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log('😄')
    }, 2000)
  }, [])

  return <div className="title">
    Student
  </div>
};

export default App;