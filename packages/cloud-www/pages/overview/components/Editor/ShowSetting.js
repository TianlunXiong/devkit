/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import React, {
  Fragment, useState, useEffect, useContext, useMemo, useCallback,
} from 'react';
import {
  Form, Select, Row, Col, message, Button,
} from 'antd';
import {
  TableOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  PicLeftOutlined,
  FundOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import { ServerContext } from '@components/App';
import useApi from '@components/BiComponents/Hook/useApi';
import { useForm as useFormHook } from 'react-hook-form';
import { useFormTemplate } from '@components/BiComponents/Hook/useFormTemplate';
import {
  searchList,
  searchListOption,
} from '@client/api/core/overview/module/local';
import { EditorContext } from './index';

const MAX_DIM_OPTION = 20;
const { Option } = Select;
const DT_DEFAULT = {
  今日: true,
  明日: true,
  昨日: true,
  本周: true,
  上上周: true,
  上周: true,
  本月: true,
  上月: true,
  今年: true,
  去年: true,
  过去7天: true,
  过去30天: true,
};

const DT_OPTION = Object.keys(DT_DEFAULT);

const HOUR_DEFAULT = {
  当前时刻: true,
  到当前时刻: true,
  近一小时: true,
  全天: true,
};

const HOUR_OPTION = Object.keys(HOUR_DEFAULT);

const TIME_DEFAULT = {
  dt: DT_DEFAULT,
  week: DT_DEFAULT,
  month: DT_DEFAULT,
  year: DT_DEFAULT,
  hour: HOUR_DEFAULT,
};

const TIME_TYPE = {
  dt: 0,
  week: 0,
  month: 0,
  year: 0,
  hour: 1,
};

export default function FormShowSetting(props) {
  const commonData = useContext(ServerContext);
  const shareData = useContext(EditorContext);
  const {
    type,
  } = commonData;
  const {
    dispatch,
  } = props;
  const { editData, activeStep, allKpiCache, formGroup } = shareData;
  const [dimOption, setDimOption] = useState([]);
  const [dimValueOptionMapping, setDimValueOptionMapping] = useState({});

  const { run: runsearchList } = useApi(searchList, { manual: true });
  const { run: runsearchListOption } = useApi(searchListOption, { manual: true });

  const formHook = useFormHook({
    reValidateMode: 'onBlur',
  });
  const { watch, setValue } = formHook;

  const dimSelected = watch('searchDim') || [];
  const moduleType = watch('moduleType');

  const ok = useMemo(() => {
    return dimSelected.length && moduleType !== undefined;
  }, [dimSelected, moduleType]);


  const allGraph = useMemo(() => {
    const all = allGrapher();
    if (!allKpiCache) return all;
    const mainKpi = allKpiCache[0];
    const kpiNumber = allKpiCache.length;
    const dimNumber = mainKpi.groupBy.split(',').filter((item) => !!item).length;

    if (dimNumber === 1) {
      all[1].disabled = false;
      all[2].disabled = false;
      if (kpiNumber > 1) {
        all[5].disabled = false;
      }
    }

    if (kpiNumber === 1) {
      all[3].disabled = false;
    }
    if (dimNumber === 0 && kpiNumber === 1) {
      all[4].disabled = false;
    }
    return all;
  }, [allKpiCache]);

  useEffect(() => {
    if (editData) {
      const {
        searchList = [], moduleType, remarkUrl, moduleKpiRelationRespList = [],
      } = editData;
      const searchDim = searchList.map((item) => item.searchId);
      setValue('searchDim', searchDim);
      setValue('remarkUrl', remarkUrl);
      setValue('moduleType', moduleType);
      const timeDim = searchList.filter((item) => item.searchDefineType === '时间维度');
      const textDim = searchList.filter((item) => item.searchDefineType === '文本维度');
      if (timeDim.length) {
        for (let i = 0; i < timeDim.length; i += 1) {
          const { searchDefineName, defaultParameter } = timeDim[i];
          if (TIME_DEFAULT[searchDefineName]) {
            setTimeout(() => setValue(`default-${searchDefineName}`, TIME_DEFAULT[searchDefineName][defaultParameter] ? defaultParameter : undefined), 2000);
          }
        }
      }
      if (textDim.length) {
        for (let i = 0; i < textDim.length; i += 1) {
          const { searchDefineName, defaultParameter } = textDim[i];
          setTimeout(() => setValue(`default-${searchDefineName}`, defaultParameter ? JSON.parse(defaultParameter) : []), 2000);
        }
      }

      if (moduleType === 5) {
        const leftAxisKpi = [];
        const rightAxisKpi = [];
        let leftAxisKpiType;
        let rightAxisKpiType;
        for (let i = 0; i < moduleKpiRelationRespList.length; i += 1) {
          const { axisLocation, axisModuleType: axisType, kpiId } = moduleKpiRelationRespList[i];
          if (axisLocation === undefined || axisLocation === 0) {
            leftAxisKpiType = axisType;
            leftAxisKpi.push(kpiId);
          }
          if (axisLocation === 1) {
            rightAxisKpiType = axisType;
            rightAxisKpi.push(kpiId);
          }
        }
        setTimeout(() => {
          setValue('leftAxisKpi', leftAxisKpi);
          setValue('rightAxisKpi', rightAxisKpi);
          setValue('leftAxisKpiType', leftAxisKpiType);
          setValue('rightAxisKpiType', rightAxisKpiType);
        }, 2000);
      }
    }
  }, []);
  useEffect(() => {
    if (activeStep === 1) {
      getDimOptions();
    }
  }, [activeStep]);

  useEffect(() => {
    dispatch({ type: 'setDimCache', payload: dimOption });
  }, [dimOption]);

  const dimOptionMapping = useMemo(() => {
    const mapping = {};
    for (let i = 0; i < dimOption.length; i += 1) {
      const { searchId } = dimOption[i];
      mapping[searchId] = dimOption[i];
    }
    return mapping;
  }, [dimOption]);

  useEffect(() => {
    dispatch({ type: 'setDimMappingCache', payload: dimOptionMapping });
  }, [dimOptionMapping]);

  const [timeDimIds, textDimIds] = useMemo(() => {
    const timeDimIds = [];
    const textDimIds = [];
    for (let i = 0; i < dimSelected.length; i += 1) {
      const { searchDefineType, searchId } = dimOptionMapping?.[dimSelected[i]] || {};
      if (searchDefineType === '时间维度') {
        timeDimIds.push(searchId);
      }
      if (searchDefineType === '文本维度') {
        textDimIds.push(searchId);
      }
    }
    return [timeDimIds, textDimIds];
  }, [dimOptionMapping, dimSelected]);

  const formSource1 = useMemo(() => {
    return [
      {
        type: 'select',
        name: 'searchDim',
        label: '查询维度',
        exposed: true,
        align: 'right',
        props: {
          placeholder: '请选择维度',
          mode: 'multiple',
        },
        render: (Select) => {
          const { Option } = Select;
          return dimOption.map((item, i) => (<Option value={item.searchId} key={item.searchId}>{item.searchShowName}</Option>));
        },
        suffix: (
          <>
            <Button type="text" onClick={selectAll}>全选</Button>
            <Button type="text" onClick={cancelAll}>取消</Button>
          </>
        ),
      },
    ];

    function selectAll() {
      const vals = [];
      for(let i = 0; i < dimOption.length; i += 1) {
        const { searchId } = dimOption[i];
        vals.push(searchId)
      }
      setValue('searchDim', vals)
    }

    function cancelAll() {
      setValue('searchDim')
    }
  }, [dimOption]);

  const formSource3 = useMemo(() => {
    return [
      {
        type: 'input',
        name: 'remarkUrl',
        label: '看板链接',
        exposed: true,
        props: {
          placeholder: '看板链接',
        },
        align: 'right',
      },
    ];
  }, []);

  const formSource2 = useMemo(() => {
    return [
      {
        type: 'select',
        name: 'moduleType',
        label: '图表类型',
        exposed: true,
        align: 'right',
        rules: {
          required: '请选择图表类型',
        },
        props: {
          placeholder: '请选择图表类型',
        },
        render: (Select) => {
          const { Option } = Select;
          return allGraph.map((item, i) => (<Option value={item.value} disabled={item.disabled} key={item.value}>{item.content}</Option>));
        },
      },
    ];
  }, [allGraph]);

  const timeform = useMemo(() => {
    const forms = [];

    for (let i = 0; i < timeDimIds.length; i += 1) {
      const { searchDefineName } = dimOptionMapping[timeDimIds[i]];
      if (TIME_TYPE[searchDefineName] === 0) {
        forms.push({
          type: 'select',
          name: `default-${searchDefineName}`,
          label: '日期',
          align: 'right',
          props: {
            placeholder: '默认过去七天',
            allowClear: true,
          },
          render: (Select) => {
            const { Option } = Select;
            return DT_OPTION.map((item, i) => (<Option value={item} key={item}>{item}</Option>));
          },
        });
      }
      if (TIME_TYPE[searchDefineName] === 1) {
        forms.push({
          type: 'select',
          name: `default-${searchDefineName}`,
          label: '小时',
          align: 'right',
          props: {
            placeholder: '默认全天',
          },
          render: (Select) => {
            const { Option } = Select;
            return HOUR_OPTION.map((item, i) => (<Option value={item} key={item}>{item}</Option>));
          },
        });
      }
    }
    return forms;
  }, [dimOptionMapping, timeDimIds]);

  const dGetDimValueOption = useCallback(debounce((id, name, val) => {
    getDimValueOption(id, name, val);
  }, 500, { leading: false }), []);

  const textform = useMemo(() => {
    const forms = [];

    for (let i = 0; i < textDimIds.length; i += 1) {
      const { searchDefineName, searchShowName } = dimOptionMapping[textDimIds[i]];
      const opts = dimValueOptionMapping?.[textDimIds[i]] || [];
      forms.push({
        type: 'select',
        name: `default-${searchDefineName}`,
        label: searchShowName,
        align: 'right',
        props: {
          mode: 'multiple',
          onDropdownVisibleChange(open) {
            if (opts.length === 0) {
              dGetDimValueOption(textDimIds[i], searchDefineName);
            }
          },
          onSearch(val) {
            dGetDimValueOption(textDimIds[i], searchDefineName, val);
          },
        },
        render: (Select) => {
          const { Option } = Select;
          return opts.map((item, i) => (<Option value={item.value} key={item.value}>{item.display}</Option>));
        },
      });
    }
    return forms;
  }, [dimOptionMapping, textDimIds, dimValueOptionMapping, dGetDimValueOption]);

  const { leftAxisKpi = [], rightAxisKpi = [] } = watch(['leftAxisKpi', 'rightAxisKpi']);

  const axisform = useMemo(() => {
    if (allKpiCache) {
      const leftOpts = [];
      const rightOpts = [];
      const hiddenOnLeft = {};
      const hiddenOnRight = {};

      if (leftAxisKpi) {
        for (let i = 0; i < leftAxisKpi.length; i += 1) {
          hiddenOnRight[leftAxisKpi[i]] = true;
        }
      }
      if (rightAxisKpi) {
        for (let i = 0; i < rightAxisKpi.length; i += 1) {
          hiddenOnLeft[rightAxisKpi[i]] = true;
        }
      }
      for (let i = 0; i < allKpiCache.length; i += 1) {
        const { kpiId } = allKpiCache[i];
        if (!hiddenOnLeft[kpiId]) {
          leftOpts.push(allKpiCache[i]);
        }
        if (!hiddenOnRight[kpiId]) {
          rightOpts.push(allKpiCache[i]);
        }
      }
      return [
        {
          type: 'select',
          name: 'leftAxisKpi',
          label: '左坐标轴',
          exposed: true,
          align: 'right',
          props: {
            mode: 'multiple',
            placeholder: '请选择维度',
            allowClear: true,
          },
          render: (Select) => {
            const { Option } = Select;
            return leftOpts.map((item) => (<Option key={item.kpiId} value={item.kpiId}>{item.showName || item.extendKpiShowName}</Option>));
          },
        },
        {
          type: 'select',
          name: 'leftAxisKpiType',
          label: '左坐标轴类型',
          exposed: true,
          align: 'right',
          props: {
            // placeholder: '请选择维度',
            allowClear: true,
          },
          render: (Select) => {
            const { Option } = Select;
            return (
              <>
                <Option value={0}>折线图</Option>
                <Option value={1}>柱状图</Option>
              </>
            );
          },
        },
        {
          type: 'select',
          name: 'rightAxisKpi',
          label: '右坐标轴',
          exposed: true,
          align: 'right',
          props: {
            mode: 'multiple',
            placeholder: '请选择维度',
            allowClear: true,
          },
          render: (Select) => {
            const { Option } = Select;
            return rightOpts.map((item) => (<Option key={item.kpiId} value={item.kpiId}>{item.showName || item.extendKpiShowName}</Option>));
          },
        },
        {
          type: 'select',
          name: 'rightAxisKpiType',
          label: '右坐标轴类型',
          exposed: true,
          align: 'right',
          props: {
            // placeholder: '请选择维度',
            allowClear: true,
          },
          render: (Select) => {
            const { Option } = Select;
            return (
              <>
                <Option value={0}>折线图</Option>
                <Option value={1}>柱状图</Option>
              </>
            );
          },
        },
      ];
    }
    return [];
  }, [leftAxisKpi, rightAxisKpi, allKpiCache]);

  const {
    exposedComponent,
  } = useFormTemplate([...formSource1, ...formSource2, ...formSource3, ...axisform], {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
    labelCol: 6,
    wrapCol: 12,
  });

  const {
    component: dimforms,
  } = useFormTemplate([...timeform, ...textform], {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
    labelCol: 6,
    wrapCol: 12,
  });

  useEffect(() => {
    dispatch({
      type: 'setFormGroup',
      payload: {
        ...formGroup,
        showSettingForm: formHook,
      },
    });
  }, []);

  return (
    <Row>
      <Col span={24} style={{ margin: '16px 0' }}>
        <Form>
          <Row>
            <Col md={24} lg={12}>
              {
                exposedComponent?.searchDim
              }
              {
                exposedComponent?.moduleType
              }
              {
                exposedComponent?.remarkUrl
              }
            </Col>
            <Col span={12} style={{ borderLeft: '1px solid rgb(240, 240, 240)', height: '60vh', padding: '0 32px', overflow: 'auto' }}>
              {
                dimforms
              }
              {
                moduleType === 5 && (
                  <>
                    {
                      exposedComponent?.leftAxisKpi
                    }
                    {
                      exposedComponent?.leftAxisKpiType
                    }
                    {
                      exposedComponent?.rightAxisKpi
                    }
                    {
                      exposedComponent?.rightAxisKpiType
                    }
                  </>
                )
              }
            </Col>
          </Row>
        </Form>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="center">
          <Col span={4}>
            <Button
              block
              type="primary"
              onClick={() => dispatch({ type: 'setActiveStep', payload: 0 })}
            >
              上一步
            </Button>
          </Col>
          <Col span={4}>
            <Button
              block
              type="primary"
              disabled={!ok}
              onClick={() => {
                dispatch({ type: 'setActiveStep', payload: 2 });
                // if (validateTimeDim()) {
                //   form.validateFields().then(() => dispatch({ type: 'setActiveStep', payload: 2 }));
                // } else {
                //   message.error('小时维度需要选择日期维度');
                // }
              }}
            >
              下一步
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  function getDimOptions() {
    if (allKpiCache && allKpiCache.length) {
      const derivedKpiIds = [];
      const extendKpiIds = [];
      for (let i = 0; i < allKpiCache.length; i += 1) {
        const { kpiType, kpiId } = allKpiCache[i];
        if (kpiType === 0) extendKpiIds.push(kpiId);
        if (kpiType === 1) derivedKpiIds.push(kpiId);
      }
      runsearchList({
        extendKpiIds,
        derivedKpiIds,
        tableId: allKpiCache?.[0]?.tableId,
      }).then((body) => {
        const { success, error, data } = body;
        if (success) {
          const { searchRespList } = data;
          setDimOption(searchRespList);
        } else {
          message.error(error.message);
        }
      });
    } else {
      setDimOption([]);
    }
    // const currentSelectIds = form.getFieldValue('searchIds') || [];
    // setDimSelection(currentSelectIds);
  }

  function getDimValueOption(searchId, searchDefineName, value = '') {
    const derivedKpiIds = [];
    const extendKpiIds = [];
    for (let i = 0; i < allKpiCache.length; i += 1) {
      const { kpiType, kpiId } = allKpiCache[i];
      if (kpiType === 0) extendKpiIds.push(kpiId);
      if (kpiType === 1) derivedKpiIds.push(kpiId);
    }
    runsearchListOption({
      extendKpiIds,
      searchId,
      searchDefineName,
      value,
      limit: MAX_DIM_OPTION,
    }).then((body) => {
      const { success, error, data } = body;
      if (success) {
        const { searchBoxContentList } = data;
        setDimValueOptionMapping((v) => ({ ...v, [searchId]: searchBoxContentList }));
      } else {
        message.error(error.message);
      }
    });
  }
}

function allGrapher() {
  return (
    [
      {
        value: 0,
        content: (
          <Fragment>
            <TableOutlined />
            &ensp;
            表格
          </Fragment>
        ),
      },
      {
        value: 1,
        content: (
          <Fragment>
            <LineChartOutlined />
            &ensp;
            折线图
          </Fragment>
        ),
        disabled: true,
      },
      {
        value: 2,
        content: (
          <Fragment>
            <BarChartOutlined />
            &ensp;
            柱状图
          </Fragment>
        ),
        disabled: true,
      },
      {
        value: 3,
        content: (
          <Fragment>
            <PieChartOutlined />
            &ensp;
            饼状图
          </Fragment>
        ),
        disabled: true,
      },
      {
        value: 4,
        content: (
          <Fragment>
            <PicLeftOutlined />
            &ensp;
            大字报
          </Fragment>
        ),
        disabled: true,
      },
      {
        value: 5,
        content: (
          <Fragment>
            <FundOutlined />
            &ensp;
            双轴图
          </Fragment>
        ),
        disabled: true,
      },
    ]
  );
}
