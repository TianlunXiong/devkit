import React, { Component } from 'react';
import { Mount, ServerContext } from '@components/App';
import { Button, Result } from 'antd';
import lxCallback from '../components/Tools/callback';
import superagent from 'superagent';

import CommonTpl from './lib/commontpl';
import CONSTS from './lib/consts';

const {
  scoreDetailStatDims,
  scoreDetailShowDims,
  scoreDetailTableForms,
  scoreDetailColumnsHeadCategory,
  halfHourChartConfig,
} = CONSTS;

@Mount({
  sidebar: {
    type: 'custom',
    show: false,
  },
  callback: lxCallback,
})
export default class Page extends Component {
  static contextType = ServerContext;

  state = {
    isAdmin: false,
  };

  componentDidMount() {
    const { scoreAdmin, user } = this.context;
    if (scoreAdmin && scoreAdmin.bool === true) {
      superagent
        .get('/api/moviebi/systemadmin/userpoweradmin/judgescoreutilsadminuser')
        .query({
          userMis: user.username || 'unknown',
        })
        .then(({ body }) => {
          const { success, data } = body;
          if (success) {
            const { bool } = data;
            if (bool === true) {
              this.setState({
                isAdmin: true,
              });
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  render() {
    const { isAdmin } = this.state;
    if (isAdmin === true) {
      return (
        <CommonTpl
          from="antispam"
          resultApi="scoredetail"
          isDetail
          opsType={2}
          statDims={scoreDetailStatDims}
          showDims={scoreDetailShowDims}
          radioOpts={scoreDetailTableForms}
          columnsCategory={scoreDetailColumnsHeadCategory}
          halfHourChartConfig={halfHourChartConfig}
        />
      );
    }
    return (
      <Result
        status="403"
        title="抱歉，您尚无权限访问的此页面"
        subTitle="请联系管理员"
        extra={
          <Button type="primary" href="/">
            回到首页
          </Button>
        }
      />
    );
  }
}
