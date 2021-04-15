import React from 'react';
import { Mount, ServerContext } from '@components/App';
import { Result, Button } from 'antd';
import {
  DotChartOutlined,
} from '@ant-design/icons';
import Sidebar from './components/sidebar';

@Mount({
  sidebar: {
    type: 'custom',
    data: Sidebar,
  },
})
export default class extends React.Component {
  render() {
    return (
      <Result
        icon={<DotChartOutlined />}
        title="页面正在施工中"
        extra={<Button href="/warehouse/dims" type="primary">去数据仓库看看</Button>}
      />
    );
  }
}
