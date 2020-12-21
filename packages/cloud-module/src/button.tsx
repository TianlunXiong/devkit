import React from 'react';

const RemoteButtonContainer = React.lazy(() => import('mcore/button'));

const App = () => (
  <div>
    <h1>Nested</h1>
    <h2>App 1</h2>
    <p>app 1 body</p>
    <React.Suspense fallback="Loading Button Container">
      <RemoteButtonContainer>Haha</RemoteButtonContainer>
    </React.Suspense>
  </div>
);

export default App;