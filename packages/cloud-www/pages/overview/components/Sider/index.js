import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Menu, Modal, message, Select, Input as AntdInput } from 'antd';
import { PlusOutlined, SearchOutlined, OrderedListOutlined, SaveOutlined } from '@ant-design/icons';
import { ServerContext } from '@components/App';
import styled from 'styled-components';
import { FlexBox, FlexBoxItem as FlexItem } from '@components/BiComponents/Box';
import { pageQuery, pageSave, sortorder, pageModule, pageExactQuery } from '@client/api/core/overview/page';
import { useForm, Controller } from 'react-hook-form';
import FormItem from '@client/pages/management/components/FormItem';
import useApi from '@components/BiComponents/Hook/useApi';
import useDragList from '@client/pages/management/components/useDragList';
import BiMenu from '../Bi/Menu';
import Input from '../Bi/Input';

const { Option } = Select;
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

export default (props) => {
  const { type: pathType } = props;
  const commonData = useContext(ServerContext);
  const {
    specialPage, type, id, user = {}, modulePath, siderData,
  } = commonData;
  const [pageData, setPageData] = useState(siderData);
  const [moduleData, setModuleData] = useState({});
  const [sort, setSort] = useState(false);

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

  const { run: runExactquery } = useApi(pageExactQuery, {
    manual: true,
    onSuccess(body) {
      const { success, error, data } = body;
      if (success) {
        setModuleData(data);
      } else {
        message.error(error.message);
      }
    },
  });

  const { run: runSortorder } = useApi(sortorder, {
    manual: true,
  });

  const { run: runPageModule } = useApi(pageModule, {
    manual: true,
    onSuccess(body) {
      const { success, error, data } = body;
      if (success) {
        const { tableContentList } = data;
        setPageData(tableContentList || []);
      } else {
        message.error(error.message);
      }
    },
  });

  const [
    pageQ,
    dashboard,
    report,
    {
      prefixDashBoard, prefixReport, selectedKey, prefix, pageParentId,
    },
  ] = useMemo(() => {
    if (pageData && pageData instanceof Array) {
      if (modulePath) {
        const m = specialPage.find((item) => item.modulePath === modulePath);
        const d = pageData.filter((item) => item.pageType === 1).sort((a, b) => (a.pageOrder - b.pageOrder));
        const r = pageData.filter((item) => item.pageType === 2).sort((a, b) => (a.pageOrder - b.pageOrder));
        const { pageId, modulePath: mp, pageName } = m;
        const pageQ = {
          pageLocation: pathType === 'common' ? 0 : 1,
          pageParentId: pageId,
          pageName,
        };
        const prefixDashBoard = `/overview/common/${mp}/dashboard`;
        const prefixReport = `/overview/common/${mp}/report`;
        const selectedKey = `/overview/common/${mp}/${type}/${id}`;
        const prefix = `/overview/common/${mp}`;

        return [pageQ, d, r, { prefix, prefixDashBoard, prefixReport, selectedKey, pageParentId: pageId }];
      }
      const d = pageData.filter((item) => item.pageType === 1).sort((a, b) => (a.pageOrder - b.pageOrder));
      const r = pageData.filter((item) => item.pageType === 2).sort((a, b) => (a.pageOrder - b.pageOrder));
      const pageQ = {
        pageLocation: pathType === 'common' ? 0 : 1,
        pageParentId: 0,
        pageName: '搜索你的看板/报表',
      };
      const prefixDashBoard = '/overview/person/dashboard';
      const prefixReport = '/overview/person/report';
      const selectedKey = `/overview/person/${type}/${id}`;
      const prefix = '/overview/person';

      return [pageQ, d, r, { prefix, prefixDashBoard, prefixReport, selectedKey, pageParentId: 0 }];
    }
    return [];
  }, [pageData]);

  // console.log(dashboard, report);

  const { layout: dashboardLayout, component: dg } = useDragList(dashboard);
  const { layout: reportLayout, component: rg } = useDragList(report);

  const saveOrder = useCallback(() => {
    const { pageLocation, pageParentId } = pageQ;
    const reqs = [];
    if (dashboardLayout && dashboardLayout instanceof Array) {
      const pageOrder = {};
      dashboardLayout.sort((a, b) => (a.y - b.y));
      for (let i = 0; i < dashboardLayout.length; i += 1) {
        const { i: ii } = dashboardLayout[i];
        pageOrder[ii] = i + 1;
      }
      reqs.push(
        runSortorder({
          pageOrder,
          pageLocation,
          editor: user.username,
        }),
      );
    }

    if (reportLayout && reportLayout instanceof Array) {
      const pageOrder = {};
      reportLayout.sort((a, b) => (a.y - b.y));
      for (let i = 0; i < reportLayout.length; i += 1) {
        const { i: ii } = reportLayout[i];
        pageOrder[ii] = i + 1;
      }
      reqs.push(
        runSortorder({
          pageOrder,
          pageLocation,
          editor: user.username,
        }),
      );
    }
    Promise
      .all(reqs)
      .then((rs) => {
        for (let i = 0; i < rs.length; i += 1) {
          const { success, data, error } = rs[i];
          if (success) {
            message.success(data);
          } else {
            message.error(error.message);
          }
          break;
        }
        runPageModule({
          pageId: pageParentId,
          pageLocation,
          user: user.username,
        });
      });
  }, [dashboardLayout, reportLayout, pageQ]);

  const init = useCallback(() => {
    if (pageQ.pageParentId) {
      runExactquery({
        pageId: pageQ.pageParentId,
        user: user.username,
      });
    }
  }, [pageQ.pageParentId]);

  useEffect(() => {
    init();
  }, [pageQ.pageParentId]);

  useEffect(() => {
    const { pageLocation, pageParentId } = pageQ;
    const onRefreshOverviewSider = () => {
      runPageModule({
        pageId: pageParentId,
        pageLocation,
        user: user.username,
      });
    };
    window.addEventListener('refreshOverviewSider', onRefreshOverviewSider);
    return () => window.removeEventListener('refreshOverviewSider', onRefreshOverviewSider);
  }, [pageQ]);

  const { writePermission } = moduleData;

  const {
    component: pageCreator,
    setVisible,
  } = useCreatePage(pathType, pageParentId, prefix);

  return (
    <FlexBox css_w="100%" css_h="calc(100vh - 44px)" css_flexDir="column">
      {pageCreator}
      <FlexItem css_flexGrow="0" css_m="12px 0 0 0" css_p="0 12px 16px 21px">
        <Input
          prefix={<SearchOutlined />}
          onPressEnter={({ target: { value } }) => {
            if (value) {
              runPageQuery({
                pageName: value,
                pageLocation: pageQ.pageLocation,
                pageParentId: pageQ.pageParentId,
                user: user.username,
              });
            } else {
              setPageData(siderData);
            }
          }}
          placeholder={pageQ.pageName}
        />
      </FlexItem>
      <NoBarFlexItem css_m="0 0 32px 0" css_overflow="auto" css_flexGrow="1" css_flexShrink="1">
        <BiMenu
          mode="inline"
          theme="light"
          defaultOpenKeys={[prefixDashBoard, prefixReport]}
          selectedKeys={[selectedKey]}
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
            key={prefixDashBoard}
          >
            {
              !sort ? (
                dashboard.map((item) => (
                  <Item key={`${prefixDashBoard}/${item.pageId}`}>
                    <a href={`${prefixDashBoard}/${item.pageId}`}>{item.pageName}</a>
                  </Item>
                ))
              ) : (
                dg
              )
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
            key={prefixReport}
          >
            {
              !sort ? (
                report.map((item) => (
                  <Item key={`${prefixReport}/${item.pageId}`}>
                    <a href={`${prefixReport}/${item.pageId}`}>{item.pageName}</a>
                  </Item>
                ))
              ) : rg
            }
          </SubMenu>
        </BiMenu>
      </NoBarFlexItem>
      {
        (writePermission || pageQ.pageParentId === 0) && (
          <FlexItem css_m="0 32px 16px 32px" css_flexGrow="0" css_flexShrink="0">
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
                onClick={() => setVisible(true)}
              >
                <PlusOutlined />
              </HoverFlexItem>
              <HoverFlexItem
                css_flex="1"
                css_bgColor="#eb212d"
                css_borderRadius="0 20px 20px 0"
                onClick={() => {
                  setSort((v) => !v);
                  if (sort) {
                    saveOrder();
                  }
                }}
              >
                {
                  sort ? <SaveOutlined /> : <OrderedListOutlined />
                }
              </HoverFlexItem>
            </FlexBox>
          </FlexItem>
        )
      }
    </FlexBox>
  );
};


function useCreatePage(pathType, pageParentId, prefix) {
  const [visible, setVisible] = useState(false);
  const { user } = useContext(ServerContext);
  const {
    control, setValue, getValues,
  } = useForm();

  const { run: runPageSave } = useApi(pageSave, {
    manual: true,
    onSuccess(body) {
      const { success, data, error } = body;
      if (success) {
        message.success('创建成功');
        const { pageId } = data;
        const {
          pageType,
        } = getValues();
        const moduleSubType = pageType === 1 ? 'dashboard' : 'report';
        const pathname = `${prefix}/${moduleSubType}/${pageId}`;
        window.location.pathname = pathname;
      } else {
        message.error(error.message);
      }
    },
  });

  const savePage = useCallback(() => {
    const {
      pageName,
      pageType,
      pageLocation,
    } = getValues();
    if (pageName && pageType && pageLocation !== undefined) {
      runPageSave({
        pageName,
        pageType,
        pageLocation,
        pageParentId,
        creator: user.username,
      });
    } else {
      message.error('请完善表单');
    }
  }, []);

  useEffect(() => {
    setValue('pageLocation', (pathType === 'common' ? 0 : 1));
  }, [[]]);

  return {
    setVisible,
    component: (
      <Modal
        title="新建页面"
        visible={visible}
        forceRender
        onOk={savePage}
        onCancel={() => setVisible(false)}
      >
        <FlexBox css_m="16px" css_flexDir="column">
          <FlexItem css_m="0 0 16px 0">
            <FormItem label="页面名称:">
              <Controller
                name="pageName"
                control={control}
                as={<AntdInput placeholder="页面名称" />}
              />
            </FormItem>
          </FlexItem>
          <FlexItem css_m="0 0 16px 0">
            <FormItem label="页面位置:">
              <Controller
                name="pageLocation"
                control={control}
                as={(
                  <Select
                    disabled
                    placeholder="页面位置"
                    style={{ width: '200px' }}
                  >
                    <Option value={0}>公共概览</Option>
                    <Option value={1}>个人概览</Option>
                  </Select>
                )}
              />
            </FormItem>
          </FlexItem>
          <FlexItem css_m="0 0 16px 0">
            <FormItem label="页面类型:">
              <Controller
                name="pageType"
                control={control}
                as={(
                  <Select
                    placeholder="页面类型"
                    style={{ width: '200px' }}
                    allowClear
                  >
                    <Option value={1}>数据看板</Option>
                    <Option value={2}>数据报表</Option>
                  </Select>
                )}
              />
            </FormItem>
          </FlexItem>
        </FlexBox>
      </Modal>
    ),
  };
}