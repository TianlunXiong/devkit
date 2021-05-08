import React, { useContext, useEffect, useState } from 'react';
import {
  Layout, Menu, Avatar, Typography,
  Row, Col, Space, Divider, Button,
  Dropdown,
} from 'antd';
import {
  CaretDownOutlined,
  UserOutlined, MenuOutlined,
} from '@ant-design/icons';
import superagent from 'superagent';

const { SubMenu } = Menu;
const { Text } = Typography;

const checkInitial = [
  {
    test: /^\/overview\/common/,
    key: (pathname) => {
      const k = pathname.match(/^\/overview\/common\/pageId_\d+/);
      return k ? k[0] : 'none';
    },
    name: '公共概览',
  },
  {
    test: /^\/overview\/person/,
    key: () => '/overview/person',
    name: '个人概览',
  },
  {
    test: /^\/warehouse/,
    key: () => '/warehouse',
    name: '数据仓库',
  },
  {
    test: /^\/analysis/,
    key: () => '/analysis',
    name: '数据分析',
  },
  {
    test: /^\/management/,
    key: () => '/management',
    name: '系统管理',
  },
  {
    test: /^\/tagsystem/,
    key: () => '/tagsystem',
    name: '标签透视',
  },
];

const { Header } = Layout;
const commonData = {};
const user = { isSuper: false };
const specialPage = {};

export default (props) => {
  const { pathname } = window.location;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isScoreSuper, setIsScoreSuper] = useState(false);
  const [check, setCheck] = useState(checkInitial)
  const { isSuper } = user;
  const isMobile = window.innerWidth <= 768;
  useEffect(() => {
    const head = document.getElementsByTagName('head');
    const img = drawText(user.username);
    if (head[0]) {
      const styleContent = `
      .watermark {
        position: fixed;
        pointer-events: none;
        left: 0;
        right: 0;
        top: ${isMobile ? '0px' : '44px'};
        bottom: ${isMobile ? '44px' : '0'};
        background-image: url(${img});
      }
    `;
      const styleElem = document.createElement('style');
      styleElem.innerHTML = styleContent;
      head[0].appendChild(styleElem);
    }
  }, []);

  useEffect(() => {
    const selected = check
      .filter((item) => item.test.test(pathname))
      .map((item) => item.key(pathname));
    setSelectedKeys(selected);
  }, [check]);

  useEffect(() => {
    superagent
    .get('/api/moviebi/systemadmin/userpoweradmin/judgescoreutilsadminuser')
    .query({
      userMis: user.username || 'unknown'
    })
    .then(({ body }) => {
      const { success, data } = body;
      if (success) {
        const { bool } = data;
        if (bool === true) {
          setIsScoreSuper(true);
          setCheck((v) => [...v, {
            test: /^\/scoreutils\/scorequery/,
            key: () => '/scoreutils/scorequery',
            name: '评分报表',
          }])
        }
      }
    })
    .catch((e) => {
      console.error(e);
    })
  }, [])

  return (
    <Header>
      <Row justify="space-between">
        <Col
          style={{ textAlign: 'center', minWidth: 240 }}
          flex="0 0 240px"
          lg={{ span: 3 }}
          md={{ span: 6 }}
          sm={{ span: 0, order: 0 }}
          xs={{ span: 0 }}
        >
          <Space>
            <img
              src="/images/home/avatar.png"
              style={{ height: 20, width: 20 }}
              alt=""
            />
            <Text>
              <a style={{ color: '#1f2d3d' }} href="/">猫眼数据平台</a>
            </Text>
          </Space>
          <Divider type="vertical" />
        </Col>
        <Col
          style={{ textAlign: 'center' }}
          lg={{ span: 0 }}
          md={{ span: 0 }}
          sm={{ order: 2 }}
          xs={{ order: 2 }}
        >
          <Space>
            <img
              src="/images/home/avatar.png"
              style={{ height: 20, width: 20 }}
              alt=""
            />
            <Text style={{ color: '#1f2d3d' }}>猫眼数据平台</Text>
          </Space>
        </Col>
        <Col
          flex="auto"
          lg={{ span: 19 }}
          md={{ offset: 0, span: 18 }}
          sm={{ span: 18, order: 1 }}
          xs={{ span: 4, order: 1 }}
        >
          <Row>
            {/* <Col lg={{ span: 0 }} md={{ span: 0 }} sm={{ span: 4 }} xs={{ span: 12 }}>
              {siderButton}
            </Col> */}
            <Col
              lg={{ span: 24 }}
              md={{ span: 24 }}
              sm={{ span: 20 }}
              xs={{ span: 12 }}
            >
              <Menu
                mode="horizontal"
                theme="light"
                overflowedIndicator={<MenuOutlined />}
                style={{ border: 'none' }}
                className="mobile-submenu-icon"
              >
                <Menu.Item key="/overview/common">
                  <Dropdown
                    trigger={['click', 'hover']}
                    overlay={
                      <Menu selectedKeys={selectedKeys}>
                        {specialPage.map((item) => (
                          <Menu.Item
                            key={`/overview/common/${item.modulePath}`}
                          >
                            <a
                              href={
                                `/overview/common/${item.modulePath}` +
                                `${isMobile ? '#opensider' : ''}`
                              }
                            >
                              {item.pageName}
                            </a>
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                  >
                    <div>
                      <CaretDownOutlined />
                      公共概览
                    </div>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item key="/overview/person">
                  <a href="/overview/person">个人概览</a>
                </Menu.Item>
                { isScoreSuper && (
                  <Menu.Item key="/scoreutils/scorequery">
                    <a href="/scoreutils/scorequery">评分报表</a>
                  </Menu.Item>
                )}
                <Menu.Item disabled={isMobile} key="/analysis">
                  <a href="/analysis">数据分析</a>
                </Menu.Item>
                {isSuper && (
                  <Menu.Item disabled={isMobile} key="/warehouse">
                    <a href="/warehouse">数据仓库</a>
                  </Menu.Item>
                )}
                {isSuper && (
                  <Menu.Item disabled={isMobile} key="/management">
                    <a href="/management">系统管理</a>
                  </Menu.Item>
                )}
                <Menu.Item disabled={isMobile} key="/tagsystem">
                  <Dropdown
                    trigger={['click', 'hover']}
                    overlay={
                      <Menu selectedKeys={selectedKeys}>
                        <Menu.Item key="/tagsystem/user">
                          <a href="/tagsystem/user">用户体系</a>
                        </Menu.Item>
                        <Menu.Item key="/tagsystem/cinema">
                          <a href="/tagsystem/cinema">影院体系</a>
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <div>标签透视</div>
                  </Dropdown>
                </Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Col>
        <Col
          lg={{ offset: 0, span: 2 }}
          md={{ offset: 1, span: 2 }}
          sm={{ span: 4, order: 3 }}
          xs={{ order: 3 }}
        >
          <Menu
            mode="horizontal"
            style={{ border: 'none' }}
            className="mobile-submenu-icon"
          >
            <SubMenu
              icon={<UserOutlined />}
              title={
                <Avatar
                  size="small"
                  shape="square"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    color: '#1f2d3d',
                  }}
                >
                  {user?.name?.slice(1) || null}
                </Avatar>
              }
            >
              <Menu.Item>
                <a href="/user/logout">退出登录</a>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Col>
      </Row>
      <div className="watermark" />
    </Header>
  );
};


function drawText(text) {
  // 创建画布
  const canvas = document.createElement('canvas');
  // 绘制文字环境
  const context = canvas.getContext('2d');

  const deg = 0.1 * Math.PI;

  const { width } = context.measureText(text);

  const n = window.innerHeight / (width * 6);

  canvas.width = width * n;
  // 画布高度
  canvas.height = width * n;
  // 填充
  context.fillStyle = 'rgba(255,255,255,0)';

  context.fillRect(0, 0, canvas.width, canvas.height);
  // 设置水平对齐方式
  context.textAlign = 'center';
  // 设置垂直对齐方式
  context.textBaseline = 'middle';
  // 设置字体颜色
  context.fillStyle = 'rgba(0, 0, 0, 0.07)';
  // 设置字体
  context.font = 'normal normal lighter 18px Helvetica';

  const ox = canvas.width / 2;
  const oy = canvas.height / 2;

  context.translate(ox, oy);
  context.rotate(deg);
  context.fillText(text, 0, 0);
  context.translate(-ox, -oy);

  // 生成图片信息
  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl;
}
