import React, { useEffect, useState } from "react";
import { Button, DateSelect } from 'vikit__ui/index';

console.log(DateSelect)

function Index() {
  const [d, setD] = useState('ok')
  // useEffect(() => {
  //   console.log('ok')
  // }, [])
  return (
    <div onClick={() => setD((v) => v + '1')}>
      <div>{`123${d}`}</div>
      <Me />
      <Button theme="primary">Hi3</Button>
      <DateSelect placeholder="Please input start date" mode="date" />
    </div>
  );
}

class Me extends React.Component {
  render() {
    return <div>ok</div>
  }
}

export default Index;
