import React from 'react';
import RemoteModules from 'component_site/mts';
import Button from 'mcore/button';
import 'mcore/button/style';
import './index.scss'

const App = () => {

  return (
    <div className="title">
      Home1
      <RemoteModules />
      <Button>Hi</Button>
    </div>
  );
};

export default App;