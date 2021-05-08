/* eslint-disable no-use-before-define */
import React, {
  useState, useEffect, useRef, useContext, useMemo,
} from 'react';
import {
  Select, Row, Col, message, Button, DatePicker,Tabs,
} from 'antd';
import _ from 'lodash';
import superagent from 'superagent';
import moment from 'moment';
import { ServerContext } from '@components/App';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useForm as useFormHook } from 'react-hook-form';
import { useFormTemplate } from '@components/BiComponents/Hook/useFormTemplate';
import useApi from '@components/BiComponents/Hook/useApi';
import {
  detailbydefinename,
  querydimtablecolumnlist,
  turndimdatabydimtable,
} from '@client/api/core/overview/module/dim-transform';
import { useDataPreview } from './ChooseData';
import { EditorContext } from './index';
import { TabPanelContext } from '../TabPanel';
import { TimeGenerator, MomentRangeToValuesOfWhereExtraMap, MomentRangeToPageSizeOfWhereExtraMap } from './TIME_GENERATOR';

const ResponsiveGridLayout = WidthProvider(Responsive);

const MODULE_2_TYPE = {
  0: 'table',
  1: 'line',
  2: 'bar',
  3: 'pie',
  4: 'poster',
  5: 'multi',
};

const SORT_OPTION = [
  {
    name: '升序',
    value: 'ASC',
  },
  {
    name: '降序',
    value: 'DESC',
  },
];

const VALID_SORT = {
  ASC: true,
  DESC: true,
};

const { TabPane } = Tabs;

export default function Preview() {
  const shareData = useContext(EditorContext);
  const {
    editData, activeStep, allKpiCache, formGroup, dimOptionMapping,
  } = shareData;
  const pointer = useRef(null);
  const commonData = useContext(ServerContext);
  const {
    user, id,
  } = commonData;
  const panelData = useContext(TabPanelContext);
  const { dispatch, activeKey } = panelData;
  const [tick, setTick] = useState(false);

  const id2allKpiCache = useMemo(() => {
    if (!allKpiCache) return {};
    const obj = {};
    for (let i = 0; i < allKpiCache.length; i += 1) {
      const { kpiId } = allKpiCache[i];
      obj[kpiId] = allKpiCache[i];
    }
    return obj;
  }, [allKpiCache]);

  const dobj = defaultData();
  const eobj = handleEditData();
  const allobj = { ...dobj, ...eobj };
  const configPanelFormHook = useFormHook({
    reValidateMode: 'onBlur',
    defaultValues: {
      ...allobj,
    },
  });
  const { getValues: configGetValues } = configPanelFormHook;

  const { getValues: showSettingGetValues } = formGroup?.showSettingForm || {};
  const { getValues: chooseDataGetValues } = formGroup?.chooseDataForm || {};
  const { moduleType } = showSettingGetValues('moduleType');

  const {
    component,
    exposedComponent,
    overlapKpiDetail,
  } = useFormat(configPanelFormHook, allKpiCache, id2allKpiCache);

  const overlappedAllKpiCache = useMemo(() => {
    const s1 = overlapKpiDetail(allKpiCache);
    useMultiAxis(s1);
    return s1;
  }, [tick]);

  const {
    component: tablesortform,
  } = useTableSort(configPanelFormHook, allKpiCache);

  const {
    component: dimTransform,
    exposedComponent: dimTransformexposedComponent,
    dimDetailMapping,
  } = useDimTransform(configPanelFormHook, allKpiCache);

  const {
    getData,
    grapher,
  } = useDataPreview(overlappedAllKpiCache, MODULE_2_TYPE[moduleType]);

  useEffect(() => {
    if (activeStep === 2) {
      const extendKpiIds = [];
      const derivedKpiIds = [];
      for (let i = 0; i < allKpiCache.length; i += 1) {
        const { kpiType, kpiId } = allKpiCache[i];
        if (kpiType === 0) {
          extendKpiIds.push(kpiId);
        }
        if (kpiType === 1) {
          derivedKpiIds.push(kpiId);
        }
      }
      const [whereExtra, pageSize] = getWhereExtra();
      getData({
        user: user.username,
        extendKpiIds,
        derivedKpiIds,
        whereExtra,
        pageReq: {
          curPage: 1,
          pageSize,
        },
      }).then(() => {
        setTick((v) => !v);
      });
    }
  }, [activeStep]);

  return (
    <div style={{ marginTop: 16 }} ref={pointer}>
      <ResponsiveGridLayout
        className="layout"
        rowHeight={25}
        layouts={{ lg: [{ i: 'preview', x: 0, y: 0, w: 16, h: 16, static: true }, { i: 'save', x: 16, y: 0, w: 8, h: 16, static: true, }] }}
        breakpoints={{ lg: 1024 }}
        cols={{ lg: 24, md: 24, sm: 24, xs: 2, xxs: 2 }}
        useCSSTransforms={false}
      >
        <div
          className="deep-shadow main-bg"
          key="preview"
          style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '100%' }}
        >
          {grapher}
        </div>
        <div
          className="deep-shadow main-bg"
          key="save"
          style={{ borderRadius: 4 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Row>
              <Col
                style={{
                  textAlign: 'center',
                  borderBottom: '1px solid #E2E9F1',
                  backgroundColor: '#eb212d',
                  color: '#fff',
                  padding: 4,
                  fontWeight: 200,
                  fontSize: 16,
                }}
                span={24}
              >
                配置盘
              </Col>
            </Row>
            <div style={{ flexGrow: 1, flexShrink: 1, margin: '8px 12px', overflow: 'auto' }}>
              <Tabs size="small" defaultActiveKey="1">
                <TabPane tab="数值格式" key="1">
                  <Row style={{ margin: '8px 0px', overflow: 'auto' }}>
                    <Col span={24}>
                      {exposedComponent.formatRules}
                    </Col>
                    <Col span={24}>
                      {component}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane forceRender tab="表格排序" key="2">
                  <Row style={{ margin: '8px 0px', overflow: 'auto' }}>
                    <Col span={24}>
                      {tablesortform}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane forceRender tab="展示维度" key="3">
                  <Row style={{ margin: '8px 0px', overflow: 'auto' }}>
                    <Col span={24}>
                      {dimTransformexposedComponent.shownDim}
                    </Col>
                    <Col span={24}>
                      {dimTransform}
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
            <div style={{ flexGrow: 0, flexShrink: 0 }}>
              <Row>
                <Col span={12}>
                  <Button
                    onClick={() => {
                      const chooseDataValues = chooseDataGetValues();
                      const showSettingValues = showSettingGetValues();
                      const {
                        searchDim = [], remarkUrl,
                        leftAxisKpi = [], leftAxisKpiType,
                        rightAxisKpi = [], rightAxisKpiType,
                      } = showSettingValues;
                      const configValues = configGetValues();
                      const {
                        formatRules = [],
                        tablesort,
                        tablesortvalue,
                        shownDim = [],
                      } = configValues;

                      const formatMapping = {};
                      for (let i = 0; i < formatRules.length; i += 1) {
                        const {
                          [`${formatRules[i]}-thousandth`]: thousandth,
                          [`${formatRules[i]}-suffix`]: suffix,
                          [`${formatRules[i]}-decimalPoint`]: decimalPoint,
                        } = configValues;
                        const rule = {
                          thousandth: thousandth?.[0] || false,
                          suffix,
                          decimalPoint,
                        };
                        formatMapping[formatRules[i]] = JSON.stringify(rule);
                      }

                      const axisMap = {};
                      for (let i = 0; i < leftAxisKpi.length; i += 1) {
                        axisMap[leftAxisKpi[i]] = { axisLocation: 0, axisModuleType: leftAxisKpiType };
                      }
                      for (let i = 0; i < rightAxisKpi.length; i += 1) {
                        axisMap[rightAxisKpi[i]] = { axisLocation: 1, axisModuleType: rightAxisKpiType };
                      }
                      const moduleKpiRelationReqs = [];
                      const sortedKpi = allKpiCache.find((item) => item.kpiId === tablesort);
                      for (let i = 0; i < allKpiCache.length; i += 1) {
                        const { kpiId, kpiType, showName } = allKpiCache[i];
                        const [label] = showName.split('_');
                        const {
                          [`ratioType-${label}`]: ratioType,
                        } = chooseDataValues;
                        let fieldShowRule = '';
                        if (formatMapping[kpiId]) {
                          fieldShowRule = formatMapping[kpiId];
                        }
                        let resultSort = '';
                        if (sortedKpi && sortedKpi.kpiId === kpiId && VALID_SORT[tablesortvalue]) {
                          resultSort = `${sortedKpi.defineName} ${tablesortvalue}`;
                        }
                        const axisInfo = axisMap[kpiId] || {};
                        moduleKpiRelationReqs.push({
                          kpiType,
                          kpiId,
                          ratioType,
                          showOrder: i,
                          fieldShowRule,
                          resultSort,
                          ...axisInfo,
                        });
                      }

                      const search = [];
                      const timeDim = [];
                      const textDim = [];

                      for (let i = 0; i < searchDim.length; i += 1) {
                        if (searchDim[i] && dimOptionMapping[searchDim[i]]) {
                          const { searchDefineType } = dimOptionMapping[searchDim[i]];
                          if (searchDefineType === '时间维度') timeDim.push(dimOptionMapping[searchDim[i]]);
                          if (searchDefineType === '文本维度') textDim.push(dimOptionMapping[searchDim[i]]);
                        }
                      }

                      for (let i = 0; i < timeDim.length; i += 1) {
                        const { searchId, searchDefineName } = timeDim[i];
                        const defaultParameter = showSettingValues[`default-${searchDefineName}`] || '';
                        search.push({
                          searchId,
                          defaultParameter,
                        });
                      }

                      for (let i = 0; i < textDim.length; i += 1) {
                        const { searchId, searchDefineName } = textDim[i];
                        const defaultParameter = showSettingValues[`default-${searchDefineName}`] || '';
                        search.push({
                          searchId,
                          defaultParameter: JSON.stringify(defaultParameter || []),
                        });
                      }

                      const moduleDimTableMessageReqs = [];
                      for (let i = 0; i < shownDim.length; i += 1) {
                        const {[`bind-${shownDim[i]}`]: chosenDims = [] } = configValues || {};
                        const { dimTableAlias, dimTableColumnAlias } = dimDetailMapping[shownDim[i]];
                        if (chosenDims.length) {
                          const dimTableMessageList = [];
                          for (let j = 0; j < chosenDims.length; j += 1) {
                            const columnAlias = chosenDims[j];
                            dimTableMessageList.push({
                              dimTableColumnAlias: columnAlias,
                              dimTableAlias,
                              order: i + j,
                            });
                          }
                          moduleDimTableMessageReqs.push({
                            dimDefineName: shownDim[i],
                            dimTableAlias,
                            dimTableColumnAlias,
                            dimTableMessageList,
                          });
                        }
                      }

                      const { moduleName } = chooseDataValues;
                      const postBody = {
                        pageId: Number(id),
                        moduleName,
                        moduleType,
                        moduleKpiRelationReqs,
                        moduleDimTableMessageReqs,
                        search,
                        remarkUrl,
                      };
                      const saveAndEdit = editData ? '/api/moviebi/frontconfiguration/module/edit' : '/api/moviebi/frontconfiguration/module/save';
                      if (editData) {
                        postBody.moduleId = editData.moduleId;
                        postBody.editor = user.username;
                      } else {
                        postBody.creator = user.username;
                      }
                      superagent
                        .post(saveAndEdit)
                        .send(postBody)
                        .then(({ body }) => {
                          const { success, error, data } = body;
                          if (success) {
                            message.success(data);
                            dispatch({ type: 'removePanel', payload: activeKey });
                            dispatch({ type: 'switchTo', payload: '主页面' });
                            window.dispatchEvent(new Event('MainRefresh'));
                          } else {
                            message.error(error.message);
                          }
                        });
                    }}
                    block
                    type="primary"
                  >
                    保存
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    onClick={() => {
                      setTick((v) => !v);
                    }}
                    block
                  >
                    预览
                  </Button>
                </Col>
              </Row>

            </div>
          </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );

  function defaultData() {
    const formatDefault = {};
    for (let i = 0; i < allKpiCache.length; i += 1) {
      const { kpiId } = allKpiCache[i];
      formatDefault[`${kpiId}-thousandth`] = [true];
      formatDefault[`${kpiId}-suffix`] = '';
      formatDefault[`${kpiId}-decimalPoint`] = 0;
    }
    return {
      tablesortvalue: 'DESC',
      ...formatDefault,
    };
  }

  function handleEditData() {
    if (!editData) return {};
    const { moduleKpiRelationRespList = [], moduleDimTableMessageRespList = [] } = editData;
    const formatDefault = {};
    const formatRules = [];
    const sortDefault = {};
    for (let i = 0; i < moduleKpiRelationRespList.length; i += 1) {
      const { fieldShowRule: fieldShowRuleStr, kpiId, resultSort } = moduleKpiRelationRespList[i];
      if (fieldShowRuleStr) {
        formatRules.push(kpiId);
        const fieldShowRule = JSON.parse(fieldShowRuleStr);
        const {
          thousandth,
          suffix,
          decimalPoint,
        } = fieldShowRule;
        formatDefault[`${kpiId}-thousandth`] = thousandth === false ? [thousandth] : [true];
        formatDefault[`${kpiId}-suffix`] = suffix;
        formatDefault[`${kpiId}-decimalPoint`] = decimalPoint;
      }

      if (resultSort) {
        const [dim, order] = resultSort.split(' ');
        sortDefault.tablesort = kpiId;
        sortDefault.tablesortvalue = order;
      }
    }
    const shownDim = [];
    const shownDimValues = {};
    for (let i = 0; i < moduleDimTableMessageRespList.length; i += 1) {
      const { dimDefineName, dimTableMessageList } = moduleDimTableMessageRespList[i];
      shownDim.push(dimDefineName);
      shownDimValues[`bind-${dimDefineName}`] = dimTableMessageList.map((item) => item.dimTableColumnAlias);
    }
    const dimTransform = {
      shownDim,
      ...shownDimValues,
    };
    return {
      formatRules,
      ...sortDefault,
      ...formatDefault,
      ...dimTransform,
    };
  }


  function useMultiAxis(allKpiCache) {
    if (moduleType === 5 && allKpiCache) {
      const {
        leftAxisKpi = [],
        leftAxisKpiType,
        rightAxisKpi = [],
        rightAxisKpiType,
      } = showSettingGetValues();
      const leftMapping = {};
      for (let i = 0; i < leftAxisKpi.length; i += 1) {
        leftMapping[leftAxisKpi[i]] = 'left';
      }
      for (let i = 0; i < rightAxisKpi.length; i += 1) {
        leftMapping[rightAxisKpi[i]] = 'right';
      }
      for (let i = 0; i < allKpiCache.length; i += 1) {
        const { kpiId } = allKpiCache[i];
        if (leftMapping[kpiId] === 'left') {
          allKpiCache[i].axisLocation = 0;
          allKpiCache[i].axisModuleType = leftAxisKpiType;
        }
        if (leftMapping[kpiId] === 'right') {
          allKpiCache[i].axisLocation = 1;
          allKpiCache[i].axisModuleType = rightAxisKpiType;
        }
      }
    }
  }

  function getWhereExtra() {
    const whereExtra = [];
    const allValues = showSettingGetValues();
    const { searchDim = [], moduleType } = allValues;
    const timeDim = [];
    const textDim = [];
    let pageSize = 10;
    for (let i = 0; i < searchDim.length; i += 1) {
      if (dimOptionMapping[searchDim[i]]) {
        const { searchDefineType } = dimOptionMapping[searchDim[i]];
        if (searchDefineType === '时间维度') {
          timeDim.push(dimOptionMapping[searchDim[i]]);
        }
        if (searchDefineType === '文本维度') {
          textDim.push(dimOptionMapping[searchDim[i]]);
        }
      }
    }
    for (let i = 0; i < timeDim.length; i += 1) {
      const { searchDefineName, searchDefineType } = timeDim[i];
      const { [`default-${searchDefineName}`]: defaultValue } = allValues;
      const Gener = TimeGenerator[searchDefineName] || TimeGenerator.dt;
      const momentTimeRange = (Gener[defaultValue] || Gener.default);
      const values = (MomentRangeToValuesOfWhereExtraMap?.[searchDefineName] || MomentRangeToValuesOfWhereExtraMap.dt)(momentTimeRange());
      const npageSize = (MomentRangeToPageSizeOfWhereExtraMap?.[searchDefineName] || MomentRangeToPageSizeOfWhereExtraMap.dt)(momentTimeRange());
      if (moduleType !== 0) pageSize = npageSize;
      whereExtra.push({
        searchDefineName,
        searchDefineType,
        values,
      });
    }
    for (let i = 0; i < textDim.length; i += 1) {
      const { searchDefineName, searchDefineType } = textDim[i];
      const { [`default-${searchDefineName}`]: values } = allValues;
      whereExtra.push({
        searchDefineName,
        searchDefineType,
        values,
      });
    }
    return [whereExtra, pageSize];
  }
}

function useFormat(formHook, allKpiCache, id2allKpiCache) {
  const { watch, getValues } = formHook;
  const formatRules = watch('formatRules');
  const formSource1 = useMemo(() => {
    return [
      {
        type: 'select',
        name: 'formatRules',
        exposed: true,
        props: {
          placeholder: '选择需要格式化的指标',
          mode: 'multiple',
          size: 'small',
        },
        render: (Select) => {
          const { Option } = Select;
          return allKpiCache.map((item, i) => {
            return <Option key={item.kpiId} value={item.kpiId}>{item?.showName?.split('_')[0] || '-'}</Option>
          });
        },
      },
    ];
  }, [allKpiCache]);

  const formSource2 = useMemo(() => {
    if (formatRules) {
      const rules = [];
      for (let i = 0; i < formatRules.length; i += 1) {
        const kpiId = formatRules[i];
        if (id2allKpiCache[kpiId]) {
          const { showName } = id2allKpiCache[kpiId];
          const kpiName = showName?.split('_')[0] || '-';
          rules.push(...[
            {
              type: 'input',
              name: `${kpiId}-suffix`,
              label: kpiName,
              props: {
                placeholder: '后缀',
                size: 'small',
                style: {
                  width: '100%',
                },
              },
              align: 'left',
              labelCol: 0,
              wrapCol: 'auto',
              span: 12,
            },
            {
              type: 'inputnumber',
              name: `${kpiId}-decimalPoint`,
              props: {
                placeholder: '小数点',
                size: 'small',
                min: 0,
              },
              labelCol: 0,
              wrapCol: 24,
              span: 6,
            },
            {
              type: 'checkbox',
              name: `${kpiId}-thousandth`,
              props: {
                size: 'small',
                options: [
                  { label: '千分位', value: true },
                ],
              },
              labelCol: 0,
              wrapCol: 24,
              span: 6,
            },
          ]);
        }
      }
      return rules;
    }
    return [];
  }, [formatRules, id2allKpiCache]);

  const {
    exposedComponent,
  } = useFormTemplate([...formSource1], {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
    wrapCol: 24,
  });

  const {
    component,
  } = useFormTemplate([...formSource2], {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
  });

  return {
    exposedComponent,
    component,
    overlapKpiDetail,
  };

  function overlapKpiDetail(allKpiCache) {
    const copy = JSON.parse(JSON.stringify(allKpiCache));
    const values = getValues();
    for (let i = 0; i < copy.length; i += 1) {
      const { kpiId } = copy[i];
      const {
        [`${kpiId}-suffix`]: suffix,
        [`${kpiId}-decimalPoint`]: decimalPoint,
        [`${kpiId}-thousandth`]: thousandth,
      } = values;

      const fieldShowRule = {
        suffix,
        decimalPoint,
        thousandth: thousandth === undefined ? true : thousandth?.[0],
      };
      copy[i].fieldShowRule = JSON.stringify(fieldShowRule);
    }
    return copy;
  }
}

function useTableSort(formHook, allKpiCache) {

  const formSource = useMemo(() => {
    if (allKpiCache) {
      return [
        {
          type: 'select',
          name: 'tablesort',
          label: '排序字段',
          labelCol: 0,
          wrapCol: 'auto',
          span: 18,
          props: {
            placeholder: '选择需要排序的指标',
            size: 'small',
            allowClear: true,
            style: {
              width: '100%',
            },
          },
          render: (Select) => {
            const { Option } = Select;
            return allKpiCache.map((item, i) => {
              return <Option key={item.kpiId} value={item.kpiId}>{item?.showName?.split('_')[0] || '-'}</Option>
            });
          },
        },
        {
          type: 'select',
          name: 'tablesortvalue',
          props: {
            placeholder: '排序值',
            size: 'small',
            style: {
              width: '100%',
              minWidth: 'auto',
            },
          },
          labelCol: 0,
          wrapCol: 24,
          span: 6,
          render: (Select) => {
            const { Option } = Select;
            return SORT_OPTION.map((item, i) => {
              return <Option key={item.value} value={item.value}>{item.name}</Option>;
            });
          },
        },
      ];
    }
    return [];
  }, [allKpiCache]);

  const {
    component,
  } = useFormTemplate([...formSource], {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
  });

  return {
    component,
  };
}

function useDimTransform(formHook, allKpiCache) {
  const [dimDetailMapping, setDimDetailMapping] = useState({});
  const [dimAliasMapping, setDimAliasMapping] = useState({});
  const { run: rundetailbydefinename } = useApi(detailbydefinename, { manual: true });
  const { run: runquerydimtablecolumnlist } = useApi(querydimtablecolumnlist, { manual: true });

  const { groupBy } = allKpiCache ? allKpiCache[0] : {};
  const option = groupBy ? groupBy.split(',') : [];

  useEffect(() => {
    if (groupBy) {
      const reqs = [];
      for (let i = 0; i < option.length; i += 1) {
        reqs.push(
          rundetailbydefinename({
            name: option[i],
          }),
        );
      }
      Promise.all(reqs).then((bodys) => {
        const obj = {};
        for (let i = 0; i < bodys.length; i += 1) {
          const { success, data, error } = bodys[i];
          if (success) {
            obj[option[i]] = data;
          }
        }
        setDimDetailMapping(obj);
      });
    }
  }, [groupBy]);

  const { watch } = formHook;

  const shownDim = watch('shownDim') || [];
  const formSource1 = useMemo(() => {
    return [
      {
        type: 'select',
        name: 'shownDim',
        exposed: true,
        props: {
          placeholder: '选择要展示的维度列',
          mode: 'multiple',
          size: 'small',
        },
        render: (Select) => {
          const { Option } = Select;
          const hasAliasOption = option.filter((item) => !!dimDetailMapping[item]?.dimTableAlias);
          return hasAliasOption.map((item, i) => {
            return <Option key={item} value={item}>{dimDetailMapping[item]?.showName || '-'}</Option>;
          });
        },
      },
    ];
  }, [dimDetailMapping, dimAliasMapping, dimDetailMapping]);

  useEffect(() => {
    for (let i = 0; i < shownDim.length; i += 1) {
      getBindOption(shownDim[i]);
    }
  }, [shownDim, dimDetailMapping]);

  const formSource2 = useMemo(() => {
    if (shownDim) {
      const rules = [];
      for (let i = 0; i < shownDim.length; i += 1) {
        const name = shownDim[i];
        const { showName = '-' } = dimDetailMapping?.[name] || {};
        rules.push(...[
          {
            type: 'select',
            name: `bind-${name}`,
            label: showName,
            wrapCol: 18,
            labelCol: 6,
            align: 'left',
            props: {
              placeholder: '选择要展示的维度列',
              mode: 'multiple',
              size: 'small',
            },
            render: (Select) => {
              const { Option } = Select;
              const bindOption = dimAliasMapping?.[name] || [];
              return bindOption.map((item, i) => {
                const { showName, columnAlias } = item || {};
                return <Option key={columnAlias} value={columnAlias}>{showName || '-'}</Option>;
              });
            },
          },
        ]);
      }
      return rules;
    }
    return [];
  }, [shownDim, dimDetailMapping, dimAliasMapping]);

  const {
    component,
    exposedComponent,
  } = useFormTemplate([...formSource1, ...formSource2], {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
    wrapCol: 24,
  });

  return {
    dimDetailMapping,
    dimAliasMapping,
    exposedComponent,
    component,
  };

  function getBindOption(val) {
    if (dimDetailMapping[val]) {
      const { dimTableAlias } = dimDetailMapping[val];
      runquerydimtablecolumnlist({
        tableAlias: dimTableAlias,
        filterDefault: true,
      }).then((body) => {
        const { success, data, error } = body;
        if (success) {
          const { dimTableColumnRespList = [] } = data || {};
          setDimAliasMapping((v) => ({ ...v, [val]: dimTableColumnRespList }));
        }
      });
    }
  }
}
