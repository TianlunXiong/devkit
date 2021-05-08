import React, { useContext } from 'react';
import superagent from 'superagent';
import {
  Input, Select, Form, message, Row, Col, Button, Divider,
} from 'antd';
import { ServerContext } from '@components/App';

const { Item } = Form;

export default (props) => {
  const { setShowNewPage } = props;
  const commonData = useContext(ServerContext);
  const {
    modulePath, specialPage, user, type,
  } = commonData;
  const moduleData = specialPage.find((item) => item.modulePath === modulePath);

  return (
    <Form
      name="create-public-page"
      initialValues={{
        pageLocation: 0,
      }}
      onFinish={(vals) => {
        const { pageType } = vals;
        superagent
          .post('/api/moviebi/frontconfiguration/page/save')
          .send({
            ...vals,
            pageParentId: moduleData.pageId,
            creator: user.username,
          })
          .then(({ body }) => {
            const { success, error, data } = body;
            if (success) {
              message.success(data);
              const { pageId } = data;
              if (pageId !== undefined) {
                window.location.pathname = `/overview/common/${moduleData.modulePath}/${pageType === 1 ? 'dashboard' : 'report'}/${pageId}`;
              } else {
                window.location.pathname = `/overview/common/${moduleData.modulePath}/${pageType === 1 ? 'dashboard' : 'report'}`;
              }
            } else {
              message.error(error.message);
            }
          })
      }}
    >
      <Row>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Item
                label="页面名称"
                name="pageName"
                rules={[{
                  required: true,
                  message: '请填写页面名称',
                }]}
              >
                <Input />
              </Item>
              <Item
                label="页面位置"
                name="pageLocation"
                rules={[{
                  required: true,
                  message: '请选择页面位置',
                }]}
              >
                <Select style={{ width: '171px' }} disabled>
                  <Select.Option value={0}>
                    公共概览
                  </Select.Option>
                </Select>
              </Item>
              <Item
                label="页面类型"
                name="pageType"
                rules={[{
                  required: true,
                  message: '请选择页面类型',
                }]}
              >
                <Select style={{ width: '171px' }}>
                  <Select.Option value={1}>
                    数据看板
                  </Select.Option>
                  <Select.Option value={2}>
                    数据报表
                  </Select.Option>
                </Select>
              </Item>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={4} offset={16}>
              <Button htmlType="submit" type="primary">确定</Button>
            </Col>
            <Col span={4}>
              <Button onClick={() => setShowNewPage(false)}>取消</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
