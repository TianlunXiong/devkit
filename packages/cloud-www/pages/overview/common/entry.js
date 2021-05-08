import React from 'react';
import { Mount, ServerContext } from '@components/App';
import { Row, Col, Card, Typography } from 'antd';
import {
  LinkOutlined,
} from '@ant-design/icons';
import Sidebar from '../components/Sider';
import lxCallback from '../components/Tools/callback';

const { Title, Text } = Typography;
const { Meta } = Card;

@Mount({
  sidebar: {
    type: 'custom',
    data: <Sidebar type="common" />,
  },
  callback: lxCallback,
})
export default class extends React.Component {

  static contextType = ServerContext;

  render() {
    const { modulePath, siderData } = this.context;

    const dashboard = siderData.filter((item) => item.pageType === 1).slice(0, 8);
    const report = siderData.filter((item) => item.pageType === 2).slice(0, 8);

    return (
      <div style={{ margin: '0px 8px'}}>
        <div className="module-main">
          <Title level={3} type="secondary">
            你可能感兴趣的...
          </Title>
        </div>
        {
          dashboard.length ? (
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Text type="secondary">
                  数据看板
                </Text>
              </Col>
              {
                dashboard.map((item) => {
                  return (
                    <Col key={item.pageId} lg={{ span: 6 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                      <Card className="shadows" style={{ border: 'none' }}>
                        <Meta
                          title={item.pageName}
                          description={
                            (
                              <a href={`/overview/common/${modulePath}/dashboard/${item.pageId}`}>
                                点击查看看板
                                <LinkOutlined />
                              </a>
                            )
                          }
                        />
                      </Card>
                    </Col>
                  );
                })
              }
            </Row>
          ) : null
        }
        {
          report.length ? (
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Text type="secondary">
                  数据报表
                </Text>
              </Col>
              {
                report.map((item) => {
                  return (
                    <Col key={item.pageId} lg={{ span: 6 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                      <Card className="shadows" style={{ border: 'none' }}>
                        <Meta
                          title={item.pageName}
                          description={
                            (
                              <a href={`/overview/common/${modulePath}/report/${item.pageId}`}>
                                点击查看报表
                                <LinkOutlined />
                              </a>
                            )
                          }
                        />
                      </Card>
                    </Col>
                  );
                })
              }
            </Row>
          ) : null
        }
      </div>
    );
  }
}
