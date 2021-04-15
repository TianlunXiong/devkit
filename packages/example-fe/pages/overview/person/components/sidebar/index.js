import React, { useState, Fragment, useContext, useEffect } from 'react';
import { Menu, Input, Button, Modal, message, Typography } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import superagent from 'superagent';
import { ServerContext } from '@components/App';
import NewPage from './newPageForm';

const { SubMenu, Item } = Menu;

const { Text } = Typography;

export default () => {
  const commonData = useContext(ServerContext) || {};
  const {
    type, id, user, siderData = [],
  } = commonData;
  const [showNewPage, setShowNewPage] = useState(false);
  const [pageData, setPageData] = useState(siderData);
  const [updateSider, setUpdateSider] = useState(false);

  const dashboard = pageData.filter((item) => item.pageType === 1);
  const report = pageData.filter((item) => item.pageType === 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Fragment>
        <div style={{ flexGrow: 0, margin: '20px 16px 12px 16px' }}>
          <Input
            onChange={({ target: { value } }) => {
              if (value === '') {
                setUpdateSider(!updateSider);
              }
            }}
            onPressEnter={({ target: { value } }) => {
              superagent
                .post('/api/moviebi/frontconfiguration/page/query')
                .send({
                  pageName: value,
                  pageLocation: 1,
                  pageParentId: 0,
                  user: user.username,
                })
                .then(({ body }) => {
                  const { success, error, data } = body;
                  if (success) {
                    setPageData(data || []);
                  }
                });
            }}
            placeholder="搜索"
          />
        </div>
        <div style={{ flexGrow: 1, height: '65vh', overflow: 'auto' }}>
          <Menu
            mode="inline"
            theme="light"
            selectedKeys={[`/overview/person/${type}/${id}`]}
            // defaultOpenKeys={[`/overview/person/${type}`]}
            defaultOpenKeys={['/overview/person/dashboard', '/overview/person/report']}
          >
            <SubMenu
              title={<Text type="secondary">数据看板</Text>}
              key="/overview/person/dashboard"
            >
              {
                dashboard.map((item) => (
                  <Item key={`/overview/person/dashboard/${item.pageId}`}>
                    <a href={`/overview/person/dashboard/${item.pageId}`}>{item.pageName}</a>
                  </Item>
                ))
              }
            </SubMenu>
            <SubMenu
              title={<Text type="secondary">数据报表</Text>}
              key="/overview/person/report"
            >
              {
                report.map((item) => (
                  <Item key={`/overview/person/report/${item.pageId}`}>
                    <a href={`/overview/person/report/${item.pageId}`}>{item.pageName}</a>
                  </Item>
                ))
              }
            </SubMenu>
          </Menu>
        </div>
        <div style={{ flexGrow: 0, marginBottom: '12px', textAlign: 'center' }}>
          <Button
            style={{ color: '#24445c' }}
            icon={<PlusOutlined />}
            onClick={() => setShowNewPage(true)}
          >
            新建页面
          </Button>
          <Modal
            title="新建页面"
            visible={showNewPage}
            footer={false}
            onCancel={() => setShowNewPage(false)}
          >
            <NewPage setShowNewPage={setShowNewPage} />
          </Modal>
        </div>
        {/* <div style={{ flexGrow: 0, margin: '4px 12px', marginBottom: '20px' }}>
          <Button
            type="link"
            style={{ color: '#fff' }}
            icon={<SettingOutlined />}
          >
            页面排序
          </Button>
        </div> */}
      </Fragment>
    </div>
  );
};