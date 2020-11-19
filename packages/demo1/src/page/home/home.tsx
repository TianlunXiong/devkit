import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      console.log('😄')
    }, 1000)
  }, [])

  return <div>
    OK
  </div>
};

export default App;