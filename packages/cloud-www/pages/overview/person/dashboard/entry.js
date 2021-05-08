import React from 'react';
import { Mount } from '@components/App';
import Sidebar from '../../components/Sider';
// import Sidebar from '../components/sidebar';
import MainPanel from '../../components/MainPanel';
import TabPanel from '../../components/TabPanel';
import lxCallback from '../../components/Tools/callback';

@Mount({
  sidebar: {
    type: 'custom',
    data: <Sidebar type="person" />,
    // data: Sidebar,
  },
  callback: lxCallback,
})
export default class extends React.Component {
  render() {
    return <TabPanel main={<MainPanel />} />;
  }
}
