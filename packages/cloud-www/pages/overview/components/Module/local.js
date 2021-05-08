/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useEffect, useContext, useState, useRef, useCallback, useMemo } from 'react';
import {
 message, Popconfirm,
} from 'antd';
import { SettingOutlined, DeleteOutlined, DownloadOutlined, SyncOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ServerContext } from '@components/App';
import Box, { FlexBox, FlexBoxItem as Item, AbsoluteBox } from '@components/BiComponents/Box';
// import useGrapher from '@components/Grapher/useGrapher';
import useGrapher from '@components/Grapher/core';
import {
  queryheadermessage,
  queryData,
  sendQueryDataOrder,
  exportData as exportDataQuery,
  originModuleDelete,
} from '@client/api/core/overview/module/local';
import useApi from '@components/BiComponents/Hook/useApi';
import GridLoading from '@components/BiComponents/Loading/grid';
import { TabPanelContext } from '../TabPanel';
import useTitle from './useModuleTitle';
import useModuleForm from './useModuleForm';
import usePolling from './usePolling';
import useHandy from '../Hook/useHandy';
import {
  MomentRangeToValuesOfWhereExtraMap,
  MomentRangeToPageSizeOfWhereExtraMap,
  TIME_PRIORITY,
  TimeGenerator,
} from '../Editor/TIME_GENERATOR';

const ButtonStyle = {
  css_p: '4px 8px',
  css_borderRadius: '3px',
  css_border: 'none',
  css_bgColor: 'transparent',
  css_active_bgColor: '#f7f9fa',
};

const MODULE_2_TYPE = {
  0: 'table',
  1: 'line',
  2: 'bar',
  3: 'pie',
  4: 'poster',
  5: 'multi',
};

const ORDER_DIM = {
  dt: true,
  hour: true,
  week: true,
  year: true,
};

const MAX_PAGESIZE = 20;

const STATUS_TEXT = {
  0: null,
  1: '正在获取数据',
  2: '正在导出',
  3: '获取数据超时',
  4: '服务器异常，请联系管理员',
};

export default (props) => {
  const commonData = useContext(ServerContext);
  const panelData = useContext(TabPanelContext);
  const {
    user = {}, type,
  } = commonData;
  const { isSuper } = user;
  const { dispatch } = panelData;
  const { pageId, componentId, detail, writePermission } = props;
  const { moduleKpiRelationRespList = [], searchList = [], moduleType } = detail;
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [headerMessages, setHeadMessages] = useState([]);
  const [hasInit, setHasInit] = useState(false);
  const [defaultOrderBy, setDefaultOrderBy] = useState('');
  const [status, setStatus] = useState(0);
  const pointer = useRef(null);
  const DEFAULT_PAGESIZE = moduleType === 0 ? 20 : MAX_PAGESIZE;

  const { Context: HandyCtx } = useHandy();
  const handyState = useContext(HandyCtx);
  const { dispatch: handyDispatch } = handyState;

  const fetchData = useCallback(async (postBody) => {
    postBody.user = user.username;
    if (postBody.orderBy) postBody.orderBy = postBody.orderBy.replace(/^,|,$/g, '');
    const { success, data, error } = await runSendQueryDataOrder(postBody);
    if (success) {
      const { extendKpiIds, derivedKpiIds, moduleId } = postBody;
      const { queryKey } = data;
      const queryBody = {
        pageId,
        moduleId,
        queryKey,
        extendKpiIds,
        derivedKpiIds,
        user: user.username,
      };
      runQueryheadermessage(queryBody);
      fireQueryData(queryBody);
    } else {
      setStatus(4);
      // message.error(error.message);
    }
  }, []);

  const exportData = useCallback(async (postBody) => {
    postBody.type = 'SYNC';
    const { success, data, error } = await runSendQueryDataOrder(postBody);
    if (success) {
      const { extendKpiIds, moduleId, derivedKpiIds } = postBody;
      const { sql } = data;
      const queryBody = {
        pageId,
        moduleId,
        extendKpiIds,
        derivedKpiIds,
        user: user.username,
        sql,
      };
      // fireExportData(queryBody);
      // runExportData(queryBody);
      const a = document.createElement('a');
      a.download = `${detail.moduleName}_${moment().format('YYYY-MM-DD HH_mm_ss')}.xlsx`;
      a.target = '_blank';
      a.href = `${exportDataQuery.url}?exportReq=${JSON.stringify(queryBody)}`;
      a.click();
    } else {
      setStatus(4);
      // message.error(error.message);
    }
  }, []);

  const getInitialState = useCallback(async () => {
    const moduleId = componentId;
    const extendKpiIds = [];
    const derivedKpiIds = [];
    const formInitialValues = {};
    const timeRangeInitialValues = {};
    let whereExtra;
    let orderBy = '';
    let groupBy = '';
    for (let i = 0; i < moduleKpiRelationRespList.length; i += 1) {
      const { kpiId: id, resultSort, groupBy: gb, kpiType } = moduleKpiRelationRespList[i];
      groupBy = gb || '';
      if (kpiType === 0) {
        extendKpiIds.push(id);
      }
      if (kpiType === 1) {
        derivedKpiIds.push(id);
      }
      if (resultSort) {
        orderBy = resultSort;
      }
    }
    const timeDims = searchList.filter((item) => item.searchDefineType === '时间维度');
    const textDims = searchList.filter((item) => item.searchDefineType === '文本维度');

    const sGroupBy = groupBy.split(',').filter((item) => !!ORDER_DIM[item]);
    let defaultOrderByStr = '';
    if (moduleType === 0) {
      for (let i = 0; i < sGroupBy.length; i += 1) {
        const str = orderBy ? `,${sGroupBy[i]} DESC` : `${sGroupBy[i]} DESC`;
        defaultOrderByStr += str;
        orderBy += str;
      }
    }
    setDefaultOrderBy(defaultOrderByStr);
    let npageSize = DEFAULT_PAGESIZE;

    const hasHourDim = timeDims.find((item) => item.searchDefineName === 'hour');
    for (let i = 0; i < timeDims.length; i += 1) {
      const { searchDefineName, searchDefineType, defaultParameter: defaultParameterStr } = timeDims[i];
      try {
        if (MomentRangeToValuesOfWhereExtraMap[searchDefineName] && TimeGenerator[searchDefineName]) {
          if (!whereExtra) whereExtra = [];
          const momentTimeRange = (TimeGenerator[searchDefineName][defaultParameterStr] || TimeGenerator[searchDefineName][searchDefineName === 'dt' && hasHourDim ? '今日' : 'default']);
          const values = MomentRangeToValuesOfWhereExtraMap[searchDefineName](momentTimeRange());
          if (moduleType !== 0) npageSize = MomentRangeToPageSizeOfWhereExtraMap[searchDefineName](momentTimeRange());
          if (TIME_PRIORITY[searchDefineName]) {
            timeRangeInitialValues[searchDefineName] = {
              value: momentTimeRange(),
              g: momentTimeRange,
            };
          }
          whereExtra.push({
            searchDefineName,
            searchDefineType,
            values,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }

    for (let i = 0; i < textDims.length; i += 1) {
      const { searchDefineName, searchDefineType, defaultParameter } = textDims[i];
      try {
        let values = JSON.parse(defaultParameter);
        if (values instanceof Array && values.length === 0) {
          values = undefined;
        }
        if (!whereExtra) whereExtra = [];
        whereExtra.push({
          searchDefineName,
          searchDefineType,
          values,
        });
        formInitialValues[searchDefineName] = values;
      } catch (e) {
        console.log(e);
      }
    }
    if (moduleType === 3) npageSize = 1000;
    const pageReq = {
      curPage: 1,
      pageSize: npageSize,
    };
    const postBody = {
      moduleId,
      derivedKpiIds,
      extendKpiIds,
      whereExtra,
      orderBy: orderBy || undefined,
      pageReq,
      user: user.username,
    };
    return {
      formInitialValues,
      timeRangeInitialValues,
      postBody,
    };
  }, [componentId]);

  const extendKpiIds = moduleKpiRelationRespList.filter((item) => item.kpiType === 0).map((item) => item.kpiId);
  const derivedKpiIds = moduleKpiRelationRespList.filter((item) => item.kpiType === 1).map((item) => item.kpiId);
  const {
    components: moduleForm,
    setValue,
    getValues,
    setTextSearchVisible,
  } = useModuleForm(searchList, {
    extendKpiIds,
    derivedKpiIds,
    onTimeRangeChange: async (value) => {
      if (hasInit && value) {
        fireSubmit(defaultOrderBy);
      }
    },
    onSubmit: async () => {
      fireSubmit(defaultOrderBy);
    },
  });

  const {
    component: grapher,
    sortedColumn,
    setTotal,
    pageSize,
    setCurPage,
    resetState = () => {},
  } = useGrapher(
    MODULE_2_TYPE[moduleType],
    {
      dataSource,
      defaultPageSize: DEFAULT_PAGESIZE,
      headerMessages,
      loading,
      parentDOM: pointer.current,
      moduleExtendKpiRelationRespList: detail?.moduleKpiRelationRespList,
      moduleDimTableMessageRespList: detail?.moduleDimTableMessageRespList || [],
      onChange: async (p, f, s) => {
        const { current, pageSize: nPageSize } = p;
        let orderBy;
        const { field, order } = s;
        if (order) {
          if (order === 'descend') {
            orderBy = `${field} DESC`;
          }
          if (order === 'ascend') {
            orderBy = `${field} ASC`;
          }
        }
        if (moduleType === 0 && !ORDER_DIM[field]) {
          orderBy = (orderBy || '') + (orderBy ? `,${defaultOrderBy}` : defaultOrderBy);
          orderBy = orderBy.replace(/,+/g, ',');
        }
        setLoading(true);
        const postBody = await mutatePostBody({ orderBy, pageReq: { curPage: current, pageSize: nPageSize } });
        fetchData(postBody);
      },
    },
  );

  const [noPowerHeaderMessages, noPower] = useMemo(() => {
    const kpis = headerMessages.filter((item) => (item.defineType === '衍生指标' || item.defineType === '派生指标'));
    const nphm = headerMessages.filter((item) => ((item.defineType === '衍生指标' || item.defineType === '派生指标') && !item.powerBool));
    return [nphm, headerMessages.length > 0 && (kpis.length === nphm.length)];
  }, [headerMessages]);


  const fireSubmit = useCallback(async (defaultOrderByStr) => {
    let orderBy;
    const { columnKey, order } = sortedColumn || {};
    if (order) {
      if (order === 'descend') {
        orderBy = `${columnKey} DESC`;
      }
      if (order === 'ascend') {
        orderBy = `${columnKey} ASC`;
      }
    }
    if (moduleType === 0 && !ORDER_DIM[columnKey]) {
      orderBy = (orderBy || '') + (orderBy ? `,${defaultOrderByStr}` : defaultOrderByStr);
      orderBy = orderBy.replace(/,+/g, ',');
    }
    if (setCurPage) setCurPage(1);
    let npageSize = pageSize || DEFAULT_PAGESIZE;
    if (moduleType !== 0) {
      const { timeRange: range } = getValues('timeRange');
      const { timeRangeInitialValues } = await getInitialState();
      const timeRangeValueNames = Object.keys(timeRangeInitialValues);
      timeRangeValueNames.sort((a, b) => (TIME_PRIORITY[a] - TIME_PRIORITY[b]));
      if (timeRangeValueNames[0]) {
        npageSize = MomentRangeToPageSizeOfWhereExtraMap?.[timeRangeValueNames[0]](range);
      }
    }
    if (moduleType === 3) npageSize = 1000;
    const postBody = await mutatePostBody(
      { orderBy, pageReq: { curPage: 1, pageSize: npageSize } },
    );
    setLoading(true);
    await fetchData(postBody);
  }, [sortedColumn, pageSize]);

  const { run: runSendQueryDataOrder } = useApi(sendQueryDataOrder, {
    manual: true,
    onSuccess(result) {
      const { success, error } = result;
      if (!success) {
        setLoading(false);
        // message.error(error.message);
        setStatus(4);
      }
    },
  });
  const { run: runQueryheadermessage } = useApi(queryheadermessage, {
    manual: true,
    onSuccess(result) {
      const { success, data, error } = result;
      if (success) {
        const { headerMessages: hmsg = [] } = data;
        for (let i = 0; i < hmsg.length; i += 1) {
          hmsg[i].defineName = hmsg[i].defineName.replace(/\s+/, '');
          hmsg[i].showName = hmsg[i].showName.replace(/\s+/, '');
        }
        setHeadMessages(hmsg);
      } else {
        setLoading(false);
        // message.error(error.message);
        setStatus(4);
      }
    },
  });

  const { run: runQueryData, data: result } = useApi(queryData, {
    manual: true,
  });
  const {
    fire: fireQueryData,
    stop,
    tick: queryTick,
    lastCounter: counter,
    cost,
  } = usePolling(runQueryData);

  useEffect(() => {
    if (cost) {
      const e = new Event('lx_postModuleResponse');
      e.moduleName = detail.moduleName;
      e.moduleId = componentId;
      e.response_time = `${cost}`;
      window.dispatchEvent(e);
    }
  }, [cost]);

  useEffect(() => {
    if (counter >= 60) {
      stop();
      setStatus(3);
    }
  }, [counter]);
  useEffect(() => {
    if (result) {
      const { success, data, error } = result;
      if (success && data) {
        const { data: rawData, totalRows } = data;
        if (totalRows !== null) {
          setDataSource(rawData || []);
          if (setTotal) setTotal(totalRows);
          setLoading(false);
        } else {
          queryTick();
        }
      } else {
        setLoading(false);
        setStatus(4);
      }
    }
  }, [result]);

  const { run: runOriginDelete } = useApi(originModuleDelete, {
    manual: true,
    onSuccess(body) {
      const { success, error, data } = body;
      if (success) {
        message.success(data);
        window.dispatchEvent(new Event('MainRefresh'));
      } else {
        message.error(error.message);
      }
    },
  });

  const sendDownloadLog = useCallback(() => {
    const e = new Event('lx_downloadModule');
    e.moduleName = detail.moduleName;
    e.moduleId = componentId;
    window.dispatchEvent(e);
  }, []);
  const { run: runExportData, data: blobResult } = useApi(exportDataQuery, {
    manual: true,
  });
  const { fire: fireExportData, stop: stopExportData, loading: isExporting, tick: exportTick } = usePolling(runExportData);
  useEffect(() => {
    if (blobResult) {
      const { type: bType } = blobResult;
      if (bType === 'application/json') {
        const reader = new FileReader();
        reader.readAsText(blobResult);
        reader.onload = function () {
          const text = reader.result;
          try {
            const r = JSON.parse(text);
            const { success, error } = r || {};
            if (!success && error) {
              stopExportData();
              setLoading(false);
              message.error('导出失败');
            } else {
              exportTick();
            }
          } catch (e) {
            console.error(e);
          }
        };
      } else {
        stopExportData();
        download(blobResult);
        setLoading(false);
        sendDownloadLog();
      }
    } else {
      exportTick();
    }
  }, [blobResult]);

  const refresh = useCallback(async () => {
    if (componentId && detail) {
      setHasInit(false);
      setLoading(true);
      const { postBody, formInitialValues, timeRangeInitialValues } = await getInitialState();
      const formNames = Object.keys(formInitialValues);
      for (let i = 0; i < formNames.length; i += 1) {
        const values = formInitialValues[formNames[i]];
        setValue(formNames[i], values);
      }
      const timeRangeValueNames = Object.keys(timeRangeInitialValues);
      timeRangeValueNames.sort((a, b) => (TIME_PRIORITY[a] - TIME_PRIORITY[b]));
      if (timeRangeValueNames[0]) {
        const date = timeRangeInitialValues[timeRangeValueNames[0]];
        if (timeRangeInitialValues.hour) {
          date.value = timeRangeInitialValues.hour.g(date.value);
        }
        setValue('timeRange', date.value);
      }

      await fetchData(postBody);
      setHasInit(true);
    }
  }, [componentId, detail]);

  useEffect(() => {
    refresh();
    if (componentId) {
      handyDispatch({
        type: 'register',
        payload: {
          name: componentId,
          fn: {
            setValue,
            getValues,
            reset: async () => {
              await refresh();
              resetState();
            },
          },
        },
      });
    }
  }, [componentId, detail]);

  const statusCode = useMemo(() => {
    if (loading) return 1;
    if (isExporting) return 2;
    return status;
  }, [status, loading, isExporting]);

  const statusMapping = useMemo(() => {
    if (statusCode === 0) return null;
    if (statusCode === 1) {
      return (
        <>
          <Item css_fontSize="12px">
            正在获取数据
            {/* {`(${counter}次)`} */}
          </Item>
          <Item css_fontSize="12px">
            <Box
              as="button"
              onClick={async () => {
                stop();
                setLoading(false);
              }}
              {...ButtonStyle}
            >
              取消
            </Box>
          </Item>
        </>
      );
    }
    if (statusCode === 2) {
      return (
        <>
          <Item css_fontSize="12px">
            正在导出
            {/* {`(${counter}次)`} */}
          </Item>
          <Item css_fontSize="12px">
            <Box
              as="button"
              onClick={async () => {
                stop();
                setLoading(false);
              }}
              {...ButtonStyle}
            >
              取消
            </Box>
          </Item>
        </>
      );
    }
    if (statusCode === 3) {
      return (
        <Item css_fontSize="12px">
          请求超时
        </Item>
      );
    }
    if (statusCode === 4) {
      return (
        <Item css_fontSize="12px">
          服务器错误
        </Item>
      );
    }
    return null;
  }, [statusCode]);

  const statusText = (
    statusMapping
  );
  const isReport = type === 'report';

  const [t, col, filter] = useMemo(() => {
    let title = '-';
    if (detail) {
      if (isReport) {
        title = detail.moduleName;
      } else {
        title = detail.remarkUrl ? <a style={{ color: '#24445c', textDecoration: 'underline' }} href={detail.remarkUrl || '#'}>{detail.moduleName}</a> : detail.moduleName;
      }
    }
    const t = (
      <FlexBox css_alignItems="center">
        <Item css_flex="1">
          {title}
        </Item>
      </FlexBox>
    );

    const col = [
      {
        text: (
          <>
            <SyncOutlined />
            初始化
          </>
        ),
        onClick: async () => {
          await refresh();
          resetState();
        },
      },
      {
        text: (
          <>
            <DownloadOutlined />
            导出
          </>
        ),
        onClick: async () => {
          if (dataSource.length === 0) {
            message.info('无数据导出');
            return;
          }
          let orderBy;
          const { columnKey, order } = sortedColumn || {};
          if (order) {
            if (order === 'descend') {
              orderBy = `${columnKey} DESC`;
            }
            if (order === 'ascend') {
              orderBy = `${columnKey} ASC`;
            }
          }
          if (setCurPage) setCurPage(1);
          const postBody = await mutatePostBody({ orderBy, pageReq: { curPage: 1, pageSize: 99999 } });
          // setLoading(true);
          await exportData(postBody);
        },
      },
      // {
      //   text: (
      //     <>
      //       <FilterOutlined />
      //       筛选单
      //     </>
      //   ),
      //   visible: isReport,
      //   onClick: () => setTextSearchVisible((v) => !v),
      // },
      ...(writePermission ? (
        [
          {
            text: (
              <>
                <SettingOutlined />
                编辑
              </>
            ),
            onClick: () => dispatch({ type: 'addPanel', payload: { type: 'editLocal', editData: detail } }),
          },
          {
            // text: (
            //   <Popconfirm
            //     title="确认删除此组件吗?"
            //     onConfirm={() => {
            //       runOriginDelete({
            //         moduleId: componentId,
            //         editor: user.username,
            //         pageId,
            //         moduleSourcesType: 0,
            //       });
            //     }}
            //     okText="确认"
            //     cancelText="取消"
            //   >
            //     <DeleteOutlined />
            //     删除
            //   </Popconfirm>
            // ),
            text: (
              <>
                <DeleteOutlined />
                删除
              </>
            ),
            onClick() {
              runOriginDelete({
                moduleId: componentId,
                editor: user.username,
                pageId,
                moduleSourcesType: 0,
              });
            },
          },
        ]
      ) : []),
    ];

    const f = (
      isReport ? (
        <Item css_fontSize="12px">
          <Box
            as="button"
            css_color="#8492A6"
            css_bgColor="rgba(0,0,0,0)"
            css_border="none"
            css_cursor="pointer"
            onClick={() => setTextSearchVisible((v) => !v)}
            {...ButtonStyle}
          >
            <FilterOutlined />
          </Box>
        </Item>
      ) : null
    );
    return [t, col, f];
  }, [dataSource, sortedColumn]);

  const { component: moduleTitle } = useTitle(
    t,
    col,
    <>
      {statusText}
      {filter}
    </>,
    writePermission,
  );

  const isPoster = detail && detail.moduleType === 4;

  return (
    <FlexBox css_h="100%" css_flexDir="column">
      <Item>
        {moduleTitle}
      </Item>
      <Item css_p="0 6px">
        {moduleForm}
      </Item>
      <Item
        ref={pointer}
        css_flex="1"
        css_overflow="auto"
        css_relative
        css_p="0 6px"
      >
        {
          loading && (
            <AbsoluteBox
              css_top="0"
              css_left="0"
              css_right="0"
              css_bottom="0"
              css_textAlign="center"
              css_zIndex="9"
            >
              <FlexBox
                css_color="#8492A6"
                css_fontWeight="100"
                css_fontSize="24px"
                css_flexDir="column"
                css_justifyContent="center"
                css_alignItems="center"
                css_h="100%"
                // css_p="24px 0 0 0"
              >
                {isPoster && detail?.moduleExtendKpiRelationRespList?.[0]?.showName.split('_')[0]}
                <GridLoading />
              </FlexBox>
            </AbsoluteBox>
          )
        }
        {
          loading && moduleType !== 0 ? null : grapher
        }
        {
          noPower && moduleType === 0 && (
            <AbsoluteBox
              css_top="0"
              css_left="0"
              css_right="0"
              css_bottom="0"
              css_textAlign="center"
              css_zIndex="9"
              css_bgColor="rgba(255,255,255,0.8)"
            >
              <FlexBox
                css_color="#8492A6"
                css_fontWeight="100"
                css_fontSize="24px"
                css_flexDir="column"
                css_justifyContent="center"
                css_alignItems="center"
                css_h="100%"
              >
                暂无权限，请联系BI申请
              </FlexBox>
            </AbsoluteBox>
          )
        }
      </Item>
    </FlexBox>
  );

  async function mutatePostBody(overlap = {}) {
    const { postBody } = await getInitialState();
    const { whereExtra = [] } = postBody;
    const nWhereExtra = [];
    const { timeRange, ...textValues } = getValues();

    for (let i = 0; i < whereExtra.length; i += 1) {
      const {
        searchDefineName,
        searchDefineType,
      } = whereExtra[i];
      if (searchDefineType === '文本维度' && textValues[searchDefineName] && textValues[searchDefineName].length) {
        const values = textValues[searchDefineName];
        // if (values instanceof Array && values.length !== 0) {
        nWhereExtra.push({
          searchDefineName,
          searchDefineType,
          values,
        });
        // }
      }
      if (searchDefineType === '时间维度') {
        nWhereExtra.push({
          searchDefineName,
          searchDefineType,
          values: MomentRangeToValuesOfWhereExtraMap[searchDefineName](timeRange),
        });
      }
    }
    postBody.whereExtra = nWhereExtra;
    const nPostBody = { ...postBody, ...overlap };
    return nPostBody;
  }

  function download(blob) {
    const a = document.createElement('a');
    a.download = `${detail.moduleName}_${moment().format('YYYY-MM-DD HH_mm_ss')}.xlx`;
    a.href = URL.createObjectURL(blob);
    a.click();
  }
};
