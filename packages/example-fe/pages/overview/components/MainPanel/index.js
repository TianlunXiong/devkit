import React, {
  useEffect, useState, useRef, useContext, useMemo, useCallback,
} from 'react';
import {
  Menu, Dropdown, Button, Popconfirm,
  message, Modal, Result,
} from 'antd';
import _ from 'lodash';
import {
  SettingOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ZoomInOutlined, ReloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
  pageDelete,
  pageExactQuery,
} from '@client/api/core/overview/page';
import {
  updateModuleLocation,
  originModuleDetail,
} from '@client/api/core/overview/module/local';
import {
  queryanalysismoduledetail,
} from '@client/api/core/overview/module/analysis';
import Box, { FlexBox, FlexBoxItem as Item, AbsoluteBox } from '@components/BiComponents/Box';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { ServerContext } from '@components/App';
import Loading from '@components/BiComponents/Loading';
import GridLoading from '@components/BiComponents/Loading/grid';
import { useForm as userHookForm, Controller } from 'react-hook-form';
import usePageDescription from '@client/pages/analysis/components/usePageDescription';
import useApi from '@client/components/BiComponents/Hook/useApi';
import useHandy from '../Hook/useHandy';
import useTask from '../Hook/useTask';
import useDatePicker from '../DatePicker/useDatePicker';
import usePageData from './usePageData';
import usePageModule from './usePageModule';
import { TabPanelContext } from '../TabPanel';
import Module from '../Module';

const ResponsiveGridLayout = WidthProvider(Responsive);

const CENTER_STYLE = {
  css_transform: 'translateX(-50%) translateY(-50%)',
  css_top: '50%',
  css_left: '50%',
};

const MODULE_TYPE = {
  0: 'origin',
  1: 'analysis',
};

const isMobile = window.innerWidth < 768;
const CELL_HEIGHT = 25;
const HALF_HEIGHT = Math.floor(window.innerHeight / (CELL_HEIGHT * 4));
const FULL_HEIGHT = Math.floor(window.innerHeight / (CELL_HEIGHT * 3));

export default (props) => {
  const commonData = useContext(ServerContext);
  const {
    user = {}, id, modulePath, specialPage, type,
  } = commonData;
  const moduleData = specialPage.find((item) => item.modulePath === modulePath);
  const panelData = useContext(TabPanelContext);
  const { dispatch } = panelData;

  const { id: pid } = props;
  const pointer = useRef(null);
  const [resizing, setResizing] = useState(false);
  const [layoutCache, setLayoutCache] = useState(null);
  const [componentDetails, setComponentDetails] = useState({});
  const [moduleTypeMap, setModuleTypeMap] = useState({});
  const [fillVoid, setFillVoid] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const { Provider, state: handyState } = useHandy();

  const { run: runQueryAnalysisModules } = useApi(queryanalysismoduledetail, {
    manual: true,
  });
  const { run: runOriginModuleDetail } = useApi(originModuleDetail, {
    manual: true,
  });
  const { run: runUpdateModuleLocation } = useApi(updateModuleLocation, {
    manual: true,
    onSuccess(body) {
      const { success, error, data } = body;
      if (success) {
        message.success(`布局${data}`);
      } else {
        message.error(error.message);
      }
    }
  });


  const {
    components: pageTitle,
    editTitleStatus,
    setEditTitleStatus,
    pageData,
  } = usePageData(user, id);

  const { writePermission } = pageData;

  const {
    component: pd,
    setEditStatus,
    editStatus: editDescriptStatus,
  } = usePageDescription(id);

  const {
    modules,
    reset,
  } = usePageModule(id);

  const layouts = useMemo(() => {
    if (modules === null || modules.length === 0) return {};
    const l = [];
    const moduleType = {};
    for (let i = 0; i < modules.length; i += 1) {
      const { moduleId, moduleLocation, moduleSourcesType } = modules[i];
      const {
        x,
        y,
        h,
        w,
      } = moduleLocation ? JSON.parse(moduleLocation) : { x: 0, h: 10, w: 12 };
      l.push({
        i: `${moduleId}`,
        x,
        y,
        h,
        w,
      });
      moduleType[moduleId] = {
        moduleSourcesType,
        noLocation: !moduleLocation,
      };
    }
    l.sort((a, b) => {
      const {x: xa, y: ya } = a;
      if (xa === undefined || ya === undefined) return 1;
      const {x: xb, y: yb } = b;
      if (xb === undefined || yb === undefined) return 1;

      if (ya === yb) {
        return Number(xa) - Number(xb);
      }
      return Number(ya) - Number(yb);
    });
    const maxY = l[l.length - 1].y + 1 || 0;
    const voidL = l.filter((item) => item.y === undefined);
    for (let i = 0; i < voidL.length; i += 1) {
      voidL[i].y = maxY;
    }

    const normalLayout = { lg: l, md: l, sm: l };
    const ml = [];

    let ins = 2;
    for (let i = 0; i < l.length; i += 1) {
      const { i: ii, y, w: ww } = l[i];
      const offset = (ins % 2) ? 1 : 0;
      const x = offset;
      let w = 2;
      let h = FULL_HEIGHT;
      if (ww <= 12) {
        ins += 1;
        w = 1;
        h = HALF_HEIGHT;
      }
      ml.push({
        i: ii,
        x,
        y,
        w,
        h,
      });
    }
    setModuleTypeMap(moduleType);
    return {
      ...normalLayout, xs: ml, xxs: ml,
    };
  }, [modules]);

  const {
    component: datePicker,
  } = useDatePicker('middle', {
    onChange(v) {
      const e = new Event('Update_AnalysisTimeRange');
      e.data = v;
      window.dispatchEvent(e);
      if (v) {
        const tasks = [];
        const keys = Object.keys(handyState);
        for (let i = 0; i < keys.length; i += 1) {
          const { setValue: componentSetValue, getValues } = handyState[keys[i]];
          const { timeRange: currentValue } = getValues('timeRange');
          const [v1, v2] = v;
          const [cv1, cv2] = currentValue;
          const delta1 = moment(cv1) - moment(cv1).startOf('day');
          const delta2 = moment(cv2) - moment(cv2).startOf('day');
          tasks.push(() => componentSetValue('timeRange', [moment(+v1.startOf('day') + delta1), moment(+v2.startOf('day') + delta2)]));
        }
        setTask(tasks);
      }
    },
  });

  const { run: runPageDelete } = useApi(pageDelete, {
    manual: true,
  });
  const pageDeleteAction = useCallback(() => {
    runPageDelete({
      pageIds: [Number(id)],
      user: user.username,
    })
      .then((body) => {
        const { success, error, data } = body;
        if (success) {
          message.success(data);
          window.location.pathname = moduleData ? `/overview/common/${moduleData.modulePath}` : '/overview/person';
        } else {
          message.error(error.message);
        }
      });
  }, []);


  useEffect(() => {
    const refresh = () => {
      setComponentDetails({});
      reset();
    };
    setTimeout(() => {
      window.addEventListener('MainRefresh', refresh);
    }, 1000);
    return () => {
      window.removeEventListener('MainRefresh', refresh);
    };
  }, []);


  const { setTask, loading: taskLoading } = useTask({
    initDelay: 2000,
    initGroup: 12,
  });
  const { setTask: runModuleTask, result, tick } = useTask({
    manual: true,
    initDelay: 2000,
    initGroup: 12,
  });


  const init = useCallback(() => {
    if (modules && modules.length) {
      const reqs = [];
      for (let i = 0; i < modules.length; i += 1) {
        const { moduleId, moduleSourcesType } = modules[i];
        if (MODULE_TYPE[moduleSourcesType] === 'origin') {
          reqs.push(
            async () => runOriginModuleDetail({
              pageId: id,
              moduleId,
            })
          );
        }
        if (MODULE_TYPE[moduleSourcesType] === 'analysis') {
          reqs.push(
            async () => runQueryAnalysisModules({
              pageId: id,
              moduleId,
            }),
          );
        }
      }
      runModuleTask(reqs);
    }
  }, [modules]);

  useEffect(() => {
    if (result.length) {
      Promise.all(result).then((rs) => {
        const details = {};
        for (let i = 0; i < rs.length; i += 1) {
          if (rs[i].success) {
            const { moduleId } = rs[i].data;
            details[moduleId] = rs[i].data;
          }
        }
        setComponentDetails(details);
        tick();
      });
    }
  }, [result]);

  useEffect(() => {
    if (modules && modules.length) {
      init();
    }
  }, [modules]);

  const saveLocation = useCallback((l) => {
    runUpdateModuleLocation({
      pageId: Number(id),
      editor: user.username,
      moduleLocationList: l || layoutCache,
    });
  }, [layoutCache]);

  const drop = useMemo(() => {
    if (isMobile) return null;
    return (
      <Dropdown
        trigger={['click', 'hover']}
        overlay={
          (
            <Menu>
              {
                [
                  {
                    text: '添加数据源组件',
                    icon: <PlusOutlined />,
                    action: () => dispatch({ type: 'addPanel', payload: { type: 'createLocal' } }),
                  },
                  {
                    text: '添加我的分析组件',
                    icon: <PlusOutlined />,
                    action: () => dispatch({ type: 'addPanel', payload: { type: 'createAnalysis' } }),
                  },
                  {
                    text: '页面标题',
                    icon: <EditOutlined />,
                    children: [
                      {
                        text: '编辑',
                        action: () => {
                          setEditTitleStatus(true);
                        },
                      },
                      {
                        text: '取消',
                        display: editTitleStatus,
                        action: () => {
                          setEditTitleStatus(false);
                        },
                      },
                    ],
                  },
                  {
                    text: '页面描述',
                    icon: <EditOutlined />,
                    children: [
                      {
                        text: '编辑',
                        action: () => {
                          setEditStatus(true);
                        },
                      },
                      {
                        text: '取消',
                        display: editDescriptStatus,
                        action: () => {
                          setEditStatus(false);
                        },
                      },
                    ],
                  },
                  {
                    text: resizing ? '保存布局' : '调整布局',
                    icon: <EditOutlined />,
                    disabled: modules === null || modules.length === 0,
                    action: () => {
                      if (resizing) {
                        saveLocation();
                        setResizing(false);
                      } else {
                        setResizing(true);
                      }
                    },
                  },
                  {
                    text: '删除页面',
                    action: () => {
                      setDeleteVisible(true);
                    },
                    display: !pid,
                    icon: <DeleteOutlined />,
                  },
                ].filter(((item0) => item0.display !== false)).map((item, i) => {
                  if (item.children) {
                    return (
                      <Menu.SubMenu
                        key={i}
                        title={
                          (
                            <>
                              {item.icon || null}
                              {item.text}
                            </>
                          )
                        }
                      >
                        {
                          item.children.filter((item0) => item0.display !== false).map((item1) => (
                            <Menu.Item key={item1.text} disabled={!!item1.disabled} onClick={item1.action}>
                              {item1.icon || null}
                              {item1.text}
                            </Menu.Item>
                          ))
                        }
                      </Menu.SubMenu>
                    );
                  }
                  return (
                    <Menu.Item disabled={!!item.disabled} key={i} onClick={item.action}>
                      {item.icon || null}
                      {item.text}
                    </Menu.Item>
                  );
                })
              }
            </Menu>
          )
        }
      >
        <Button
          icon={<SettingOutlined />}
          block
          style={{ border: 'none', boxShadow: '0 2px 11px 0 rgba(190,202,218,.17)' }}
        >
          页面配置
        </Button>
      </Dropdown>
    );
  }, [resizing, editTitleStatus, editDescriptStatus, modules, layoutCache]);


  return (
    <FlexBox
      css_flexDir="column"
      css_h="calc(100vh - 78px)"
    >
      <Modal
        visible={deleteVisible}
        onOk={() => {
          pageDeleteAction();
          setDeleteVisible(false);
        }}
        onCancel={() => setDeleteVisible(false)}
      >
        确认删除此页面吗?
      </Modal>
      <Item css_p={isMobile ? '8px 0 0 0' : '16px 8px 8px 20px'}>
        <FlexBox css_flexWrap="wrap" css_alignItems="center" css_justifyContent="space-between">
          <Item css_flexGrow="1" css_flexShrink="0" css_m={ isMobile ? '0 8px' : '8px 0px'}>
            {
              pageTitle
            }
          </Item>
          <FlexBox css_alignItems="center">
            {
              taskLoading && (
                <Item>
                  <FlexBox css_m="0px 4px" css_alignItems="center">
                    <Loading />
                    正在加载
                  </FlexBox>
                </Item>
              )
            }
            <Item css_flex="0" css_m="0 8px">
              <Box
                as="button"
                css_color="#8492A6"
                css_bgColor="#fff"
                css_border="none"
                css_shadow="0 2px 11px 0 rgba(190,202,218,.17)"
                css_borderRadius="3px"
                css_cursor="pointer"
                css_fontSize="16px"
                onClick={() => {
                  const tasks = [];
                  const keys = Object.keys(handyState);
                  for (let i = 0; i < keys.length; i += 1) {
                    const { reset } = handyState[keys[i]];
                    tasks.push(() => reset());
                  }
                  setTask(tasks);
                }}
              >
                <ReloadOutlined />
              </Box>
            </Item>
            <Item css_m="8px 4px">
              <Box
                css_bgColor="#fff"
                css_shadow="0 2px 11px 0 rgba(190,202,218,.17)"
                css_borderRadius="3px"
                css_fontWeight="300!important"
              >
                {datePicker}
              </Box>
            </Item>
            {
              writePermission && (
                <Item css_m={isMobile ? '0 8px' : '8px 12px 8px 4px'}>
                  {drop}
                </Item>
              )
            }
          </FlexBox>
        </FlexBox>
      </Item>
      <Item css_p={isMobile ? '0px 8px' : '0px 20px'}>
        {pd}
      </Item>
      <Provider>
        <Item css_flex="1" css_overflow="auto" css_p="8px" css_relative ref={pointer}>
          {
            modules && modules.length > 0 && (
              <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                rowHeight={CELL_HEIGHT}
                margin={{
                  lg: [20, 20],
                  md: [16, 16],
                  sm: [12, 12],
                  xs: [8, 8],
                  xxs: [4, 4],
                }}
                breakpoints={{ lg: 1024, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 24, sm: 24, xs: 2, xxs: 2 }}
                isResizable={resizing}
                isDraggable={resizing}
                onLayoutChange={(l) => {
                  if (l.length) {
                    const moduleLocationList = [];
                    let hasVoid = false;
                    for (let i = 0; i < l.length; i += 1) {
                      const {
                        x, y, h, w, i: ii,
                      } = l[i];
                      const moduleId = Number(ii);
                      const { moduleSourcesType, noLocation } = moduleTypeMap[ii];
                      if (noLocation) hasVoid = true;
                      moduleLocationList.push({
                        moduleId,
                        moduleLocation: JSON.stringify({
                          x, y, h, w,
                        }),
                        moduleSourcesType,
                      });
                    }
                    setLayoutCache(moduleLocationList);
                    if (hasVoid && !fillVoid) {
                      setFillVoid(true);
                      saveLocation(moduleLocationList);
                    }
                  }
                  window.dispatchEvent(new Event('resize'));
                }}
              >
                {
                  modules && modules.map((item) => {
                    const { moduleId, moduleSourcesType } = item;
                    return (
                      <Box
                        key={moduleId}
                        css_shadow="0 2px 11px 0 rgba(190,202,218,.17)"
                        css_bgColor="#fff"
                        css_borderRadius="6px"
                        css_flexDir="column"
                        css_border="2px solid rgba(0,0,0,0)"
                        css_hover_style={`
                          border: 2px solid #eb212d;
                        `}
                      >
                        <Module
                          type={MODULE_TYPE[moduleSourcesType]}
                          writePermission={writePermission}
                          pageId={id}
                          moduleId={moduleId}
                          detail={componentDetails[moduleId]}
                        />
                      </Box>
                    );
                  })
                }
              </ResponsiveGridLayout>
            )
          }
          {
            modules && modules.length === 0
              ? (
                <Result
                  title={ writePermission ? '您还没有创建组件哦😯' : '您没有此页面的编辑权限，请联系BI申请'}
                  status="info"
                  extra={
                    (
                      writePermission && (
                        <Button
                          disabled={isMobile}
                          onClick={() => {
                            dispatch({ type: 'addPanel', payload: { type: 'createLocal' } });
                          }}
                          type="primary"
                        >
                          {`${isMobile ? '去PC上创建组件吧' : '点击创建组件'}`}
                        </Button>
                      )
                    )
                  }
                />
              )
              : null
          }
          {
            modules === null && (
              <AbsoluteBox {...CENTER_STYLE}>
                <GridLoading />
              </AbsoluteBox>
            )
          }
        </Item>
      </Provider>
    </FlexBox>
  );
};
