import React, { useState, useContext } from 'react';
import { Menu, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, OrderedListOutlined } from '@ant-design/icons';
import { ServerContext } from '@components/App';
import styled from 'styled-components';
import { FlexBox, FlexBoxItem as FlexItem } from '@components/BiComponents/Box';
import { pageQuery } from '@client/api/core/overview/page';
import useApi from '@components/BiComponents/Hook/useApi';
import NewPage from './newPageForm';
import BiMenu from '../../../components/Bi/Menu';
import Input from '../../../components/Bi/Input';

const { SubMenu, Item } = Menu;

const NoBarFlexItem = styled(FlexItem)`
  &::-webkit-scrollbar {
    width:0px;
    height:0px;
  }
`;

const HoverFlexItem = styled(FlexItem)`
  background-color: #eb212d;
  &:hover {
    background-color: #ab212d;
  }
  &:active {
    background-color: #9b212d;
  }
`;
const HippyTagStyle = {
  css_bgColor: '#e8eef2',
  css_m: '0 24px 0 0 ',
  css_p: '0 5px',
  css_borderRadius: '8px',
};

export default () => {
  const commonData = useContext(ServerContext);
  const {
    specialPage, type, id, user = {}, modulePath, siderData,
  } = commonData;
  const [showNewPage, setShowNewPage] = useState(false);
  const [pageData, setPageData] = useState(siderData);

  const { run: runPageQuery } = useApi(pageQuery, {
    manual: true,
    onSuccess(body) {
      const { success, error, data } = body;
      if (success) {
        setPageData(data || []);
      } else {
        message.error(error.message);
      }
    },
  });

  const moduleData = specialPage.find((item) => item.modulePath === modulePath);
  const dashboard = pageData.filter((item) => item.pageType === 1);
  const report = pageData.filter((item) => item.pageType === 2);

  const { pageId, pageName } = moduleData;

  return (
    <FlexBox css_h="calc(100vh - 44px)" css_flexDir="column">
      {
        modulePath ? (
          <>
            <FlexItem css_flexGrow="0" css_m="12px 0 0 0" css_p="0 12px 16px 21px">
              <Input
                prefix={<SearchOutlined />}
                onPressEnter={({ target: { value } }) => {
                  if (value) {
                    runPageQuery({
                      pageName: value,
                      pageLocation: 0,
                      pageParentId: pageId,
                      user: user.username,
                    });
                  } else {
                    setPageData(siderData);
                  }
                }}
                placeholder={pageName}
              />
            </FlexItem>
            {/* <FlexItem>
              {
                `公共概览-${moduleData.pageName}`
              }
            </FlexItem> */}
            <NoBarFlexItem css_overflow="auto" css_flexGrow="1" css_flexShrink="1">
              <BiMenu
                mode="inline"
                theme="light"
                defaultOpenKeys={[`/overview/common/${moduleData.modulePath}/dashboard`, `/overview/common/${moduleData.modulePath}/report`]}
                selectedKeys={[`/overview/common/${moduleData.modulePath}/${type}/${id}`]}
              >
                <SubMenu
                  title={(
                    <FlexBox css_color="#8492A6" css_justifyContent="space-between" css_alignItems="center">
                      <FlexItem>
                        数据看板
                      </FlexItem>
                      <FlexItem {...HippyTagStyle}>
                        {dashboard.length}
                      </FlexItem>
                    </FlexBox>
                  )}
                  key={`/overview/common/${moduleData.modulePath}/dashboard`}
                >
                  {
                    dashboard.map((item) => (
                      <Item key={`/overview/common/${moduleData.modulePath}/dashboard/${item.pageId}`}>
                        <a href={`/overview/common/${moduleData.modulePath}/dashboard/${item.pageId}`}>{item.pageName}</a>
                      </Item>
                    ))
                  }
                </SubMenu>
                <SubMenu
                  title={(
                    <FlexBox css_color="#8492A6" css_justifyContent="space-between" css_alignItems="center">
                      <FlexItem>
                        数据报表
                      </FlexItem>
                      <FlexItem {...HippyTagStyle}>
                        {report.length}
                      </FlexItem>
                    </FlexBox>
                  )}
                  key={`/overview/common/${moduleData.modulePath}/report`}
                >
                  {
                    report.map((item) => (
                      <Item key={`/overview/common/${moduleData.modulePath}/report/${item.pageId}`}>
                        <a href={`/overview/common/${moduleData.modulePath}/report/${item.pageId}`}>{item.pageName}</a>
                      </Item>
                    ))
                  }
                </SubMenu>
              </BiMenu>
            </NoBarFlexItem>
            <FlexItem css_m="16px 32px" css_flexGrow="0" css_flexShrink="0">
              <FlexBox
                css_shadow="1px 1px 3px 1px rgba(219,223,228,.69)"
                css_h="40px"
                css_textAlign="center"
                css_fontSize="14px"
                css_color="#fff"
                css_lineHeight="40px"
                css_borderRadius="20px"
              >
                <HoverFlexItem
                  css_flex="1"
                  css_bgColor="#eb212d"
                  css_borderRadius="20px 0 0 20px"
                  onClick={() => setShowNewPage(true)}
                >
                  <PlusOutlined />
                </HoverFlexItem>
                <HoverFlexItem css_flex="1" css_bgColor="#eb212d" css_borderRadius="0 20px 20px 0">
                  <OrderedListOutlined />
                </HoverFlexItem>
              </FlexBox>
            </FlexItem>
            <Modal
              title="新建页面"
              visible={showNewPage}
              footer={false}
              onCancel={() => setShowNewPage(false)}
            >
              <NewPage setShowNewPage={setShowNewPage} />
            </Modal>
          </>
        ) : null
      }
    </FlexBox>
  );
};
