/* eslint-disable no-use-before-define */
import React, {
  useState, useEffect, useContext, useMemo, useCallback,
} from 'react';
import {
  Button, Modal,
  Tooltip,
} from 'antd';
import {
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Box, { FlexBox, FlexBoxItem as Item } from '@components/BiComponents/Box';
import { useFormTemplate } from '@components/BiComponents/Hook/useFormTemplate';
import { ServerContext } from '@components/App';
import useApi from '@components/BiComponents/Hook/useApi';
import { useForm as useFormHook } from 'react-hook-form';
import { debounce } from 'lodash';
import {
  extendkpitaglist,
  extendkpitagbizlist,
} from '@client/api/core/warehouse/extendKpi';
import {
  querykpilist,
  relatedExtendKpiList,
  queryheadermessage,
  queryData,
  sendQueryDataOrder,
} from '@client/api/core/overview/module/local';
import useGrapher from '@components/Grapher/core';
import usePolling from '../Module/usePolling';
import { EditorContext } from './index';

const MAX_OPTION = 100;

const RATIO_TYPE = [
  {
    name: '环比',
    value: 0,
  },
  {
    name: '周环比',
    value: 1,
  },
  {
    name: '月环比',
    value: 2,
  },
  {
    name: '年环比',
    value: 3,
  },
];

export default function FormChooseData(props) {
  const shareData = useContext(EditorContext);
  const commonData = useContext(ServerContext);
  const { id: pageId, user } = commonData;
  const {
    editData, ratioCache, formGroup,
  } = shareData;
  const {
    dispatch,
  } = props;

  const [editFinish, setEditFinish] = useState(!editData);
  const [otherKpiOption, setOtherKpiOption] = useState([]);
  const { run: runrelatedExtendKpiList } = useApi(relatedExtendKpiList, { manual: true });
  const {
    component: tagform,
    trigger,
    formHook: tagFormHook,
  } = useCoupledTag();

  const tagKpiName = tagFormHook.watch('kpi');

  const { kpiMapping, getKpi, loading: kpiLoading } = useKpiSelector();

  const formHook = useFormHook({
    reValidateMode: 'onBlur',
  });
  const { watch, setValue } = formHook;

  const moduleName = watch('moduleName');
  const kpiName = watch('kpiName');
  const dimName = watch('dimName');
  const otherkpi = watch('otherkpi');

  useEffect(() => {
    if (!kpiName) {
      setValue('dimName');
      setValue('otherkpi');
      setOtherKpiOption([]);
    }
  }, [kpiName]);

  useEffect(() => {
    if (tagKpiName) {
      getKpi(tagKpiName).then(() => {
        setValue('kpiName', tagKpiName);
        setValue('dimName');
        setValue('otherkpi');
        setOtherKpiOption([]);
      });
    }
  }, [tagKpiName]);

  const isOk = useMemo(() =>
    kpiName && dimName && moduleName && kpiMapping?.kpiNameMapping?.[kpiName]?.[dimName] && editFinish,
  [kpiName, dimName, moduleName, kpiMapping, editFinish]);

  const formSource1 = useMemo(() => {
    return [
      {
        type: 'input',
        name: 'moduleName',
        label: '新建组件名称',
        exposed: true,
        rules: {
          required: '请填写组件名称',
        },
        props: {
          placeholder: '组件名称',
        },
        align: 'right',
      },
    ];
  }, []);

  const dSearch = useCallback(debounce((val) => {
    getKpi(val);
  }, 500, { leading: false }), []);

  useEffect(() => {
    getKpi();
  }, []);

  const formSource2 = useMemo(() => {
    const { kpiNameMapping, kpiName: kpiNameOption } = kpiMapping;
    const mainKpi = kpiNameMapping?.[kpiName]?.[dimName];
    return [
      {
        type: 'select',
        name: 'kpiName',
        label: '查询数据指标',
        exposed: true,
        rules: {
          required: '请选择指标',
        },
        props: {
          showSearch: true,
          placeholder: '请选择指标',
          filterOption: false,
          onSearch: dSearch,
          loading: kpiLoading,
          allowClear: true,
          onSelect() {
            setValue('dimName');
            setValue('otherkpi');
          },
        },
        suffix: (
          <>
            <Tooltip title={mainKpi?.defineDescription || '-'}>
              <QuestionCircleOutlined style={{ marginLeft: '16px' }} />
            </Tooltip>
            {
              trigger
            }
          </>
        ),
        render: (Select) => {
          const { Option } = Select;
          return kpiNameOption.map((item, i) => (<Option key={item} value={item}>{item}</Option>));
        },
        align: 'right',
      },
    ];
  }, [kpiMapping, kpiLoading, kpiName, dimName]);

  const formDim = useMemo(() => {
    const { kpiNameMapping } = kpiMapping;
    const dimNames = Object.keys(kpiNameMapping?.[kpiName] || {});
    return [
      {
        type: 'select',
        name: 'dimName',
        label: '查询维度',
        exposed: true,
        align: 'right',
        rules: {
          required: '请选择维度',
        },
        props: {
          placeholder: '请选择维度',
          allowClear: true,
        },
        render: (Select) => {
          const { Option } = Select;
          return dimNames.map((item, i) => (<Option key={item} value={item}>{item}</Option>));
        },
      },
    ];
  }, [kpiName, kpiMapping]);

  const formSource3 = useMemo(() => {
    return [
      {
        type: 'select',
        name: 'otherkpi',
        label: '选取其他指标',
        align: 'right',
        exposed: true,
        props: {
          placeholder: '其他指标',
          mode: 'multiple',
        },
        render: (Select) => {
          const { Option } = Select;
          return otherKpiOption.map((item, i) => {
            return (
              <Option key={item.kpiId} value={item.kpiId}>
                <Tooltip title={item?.defineDescription || '-'}>
                  {item?.showName?.split('_')[0] || '-'}
                </Tooltip>
              </Option>
            )
          });
        },
      },
    ];
  }, [otherKpiOption]);

  const otherKpiOptionMapping = useMemo(() => {
    const mapping = {};
    for (let i = 0; i < otherKpiOption.length; i += 1) {
      const { kpiId } = otherKpiOption[i];
      mapping[kpiId] = otherKpiOption[i];
    }
    return mapping;
  }, [otherKpiOption]);

  useEffect(() => {
    const { kpiNameMapping } = kpiMapping;
    const mainKpi = kpiNameMapping?.[kpiName]?.[dimName];
    if (mainKpi) {
      const { tableId, kpiType, kpiId } = mainKpi;
      let extendKpiIds = [];
      let derivedKpiIds = [];

      if (kpiType === 0) {
        extendKpiIds.push(kpiId);
      }
      if (kpiType === 1) {
        derivedKpiIds.push(kpiId);
      }

      if (extendKpiIds.length === 0) extendKpiIds = undefined;
      if (derivedKpiIds.length === 0) derivedKpiIds = undefined;
      const postBody = {
        name: '',
        limit: MAX_OPTION,
        offset: 0,
        tableId,
        extendKpiIds,
        derivedKpiIds,
      };
      runrelatedExtendKpiList(postBody).then((body) => {
        const { success, data, error } = body;
        if (success) {
          const { kpiCommonMessages } = data;
          setOtherKpiOption(kpiCommonMessages || []);
        }
      });
    }
  }, [kpiMapping, kpiName, dimName]);

  const [ratioForm, kpiIdsMapping, kpiDetail] = useMemo(() => {
    const { kpiNameMapping } = kpiMapping;
    const mainKpi = kpiNameMapping?.[kpiName]?.[dimName];
    const extendKpiIds = [];
    const derivedKpiIds = [];
    if (mainKpi) {
      const otherkpiDetails = [];
      if (otherkpi) {
        for (let i = 0; i < otherkpi.length; i += 1) {
          if (otherKpiOptionMapping[otherkpi[i]]) {
            otherkpiDetails.push(otherKpiOptionMapping[otherkpi[i]]);
          }
        }
      }
      const ratioKpi = [mainKpi, ...otherkpiDetails];
      dispatch({ type: 'setAllKpiCache', payload: ratioKpi });
      const forms = [];
      for (let i = 0; i < ratioKpi.length; i += 1) {
        const { showName, kpiType, kpiId } = ratioKpi[i];
        if (showName) {
          const label = showName.split('_')[0];
          forms.push({
            type: 'select',
            name: `ratioType-${label}`,
            label: `${label}同环比`,
            align: 'right',
            props: {
              placeholder: `${label}同环比`,
              mode: 'multiple',
            },
            render: (Select) => {
              const { Option } = Select;
              return RATIO_TYPE.map((item) => <Option key={item.value} value={item.value}>{item.name}</Option>);
            },
          });
          if (kpiType === 0) {
            extendKpiIds.push(kpiId);
          }
          if (kpiType === 1) {
            derivedKpiIds.push(kpiId);
          }
        }
      }
      return [forms, { extendKpiIds, derivedKpiIds }, ratioKpi];
    }
    return [[], {}, []];
  }, [kpiMapping, kpiName, dimName, otherkpi, otherKpiOptionMapping]);

  useEffect(() => {
    dispatch({
      type: 'setFormGroup',
      payload: {
        ...formGroup,
        chooseDataForm: formHook,
      },
    });
  }, []);

  const {
    exposedComponent,
  } = useFormTemplate([...formSource1, ...formDim, ...formSource2, ...formSource3], {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
    labelCol: 6,
    wrapCol: 12,
  });
  const {
    component: rform,
  } = useFormTemplate(ratioForm, {
    formHook,
    reValidateMode: 'onBlur',
    span: 24,
    labelCol: 12,
    wrapCol: 12,
  });

  useEffect(() => {
    if (editData) {
      const { moduleName, moduleKpiRelationRespList } = editData;
      const mainKpi = moduleKpiRelationRespList[0] || {};
      const { showName = '', ratioType } = mainKpi;
      const [kpiName, dimName] = showName.split('_');
      setValue('moduleName', moduleName);
      setValue('kpiName', kpiName);
      setValue('dimName', dimName);
      const reqs = [];
      if (ratioType) {
        setTimeout(() => {
          reqs.push(setValue(`ratioType-${kpiName}`, ratioType));
        }, 2000);
      }

      const otherkpiDetail = moduleKpiRelationRespList.slice(1).sort((a, b) => a.showOrder - b.showOrder);
      const otherkpi = [];
      for (let i = 0; i < otherkpiDetail.length; i += 1) {
        const { kpiId, showName, ratioType } = otherkpiDetail[i];
        otherkpi.push(kpiId);
        const [kpiName] = showName.split('_');
        if (ratioType) {
          setTimeout(() => {
            reqs.push(setValue(`ratioType-${kpiName}`, ratioType));
          }, 2000);
        }
      }
      setValue('otherkpi', otherkpi);
      setTimeout(() => getKpi(kpiName), 1000);
      Promise.all(reqs).then(() => setEditFinish(true));
    }
  }, []);

  const {
    getData,
    setVisible,
    component: grapher,
  } = useDataPreview(kpiDetail);


  return (
    <Box>
      <FlexBox css_m="32px">
        <Item css_flex="1">
          {
            exposedComponent?.moduleName
          }
          {
            exposedComponent?.kpiName
          }
          {
            exposedComponent?.dimName
          }
          {
            exposedComponent?.otherkpi
          }
        </Item>
        <Item css_flex="1">
          {tagform}
          {rform}
        </Item>
      </FlexBox>
      <FlexBox css_justifyContent="center">
        <Item css_flexBasis="200px">
          <Button
            block
            onClick={() => {
              const { extendKpiIds, derivedKpiIds } = kpiIdsMapping;
              getData({
                user: user.username,
                extendKpiIds,
                derivedKpiIds,
                pageReq: {
                  curPage: 1,
                  pageSize: 10,
                },
              });
              setVisible(true);
            }}
            type="primary"
          >
            数据预览
          </Button>
          {grapher}
        </Item>
        <Item css_flexBasis="200px" css_m="0 0 0 32px">
          <Button
            type="primary"
            block
            disabled={!isOk}
            onClick={() => dispatch({ type: 'setActiveStep', payload: 1 })}
          >
            下一步
          </Button>
        </Item>
      </FlexBox>
    </Box>
  );
}

function useKpiSelector(tagFormHook) {
  const [kpiData, setKpiData] = useState({});
  const { run: runquerykpilist, loading } = useApi(querykpilist, { manual: true });

  const kpiMapping = useMemo(() => {
    const kpiNameMapping = {};
    for (let i = 0; i < kpiData.length; i += 1) {
      const { showName } = kpiData[i];
      const [kname, dname] = showName.split('_');
      if (dname) {
        if (!kpiNameMapping[kname]) {
          kpiNameMapping[kname] = {};
          kpiNameMapping[kname][dname] = kpiData[i];
        } else {
          kpiNameMapping[kname][dname] = kpiData[i];
        }
      }
    }
    const kpiName = Object.keys(kpiNameMapping);
    return {
      kpiName,
      kpiNameMapping,
    };
  }, [kpiData]);

  function getKpi(name = '') {
    return runquerykpilist({
      name,
      limit: MAX_OPTION,
      offset: 0,
    }).then((body) => {
      const { success, data, error } = body;
      if (success) {
        const { kpiCommonMessages } = data;
        setKpiData(kpiCommonMessages || []);
      }
    });
  }

  return {
    getKpi,
    loading,
    kpiMapping,
  };
};

function useCoupledTag(onSelect) {
  const [kpiData, setKpiData] = useState({});
  const [bizData, setBizData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [themeData, setThemeData] = useState([]);
  const { run: runquerykpilist, loading: kpiLoading } = useApi(querykpilist, { manual: true });
  const { run: runextendkpitaglist, loading: bizTagLoading } = useApi(extendkpitaglist, { manual: true });
  const { run: runextendkpitagbizlist, loading: themeTagLoading } = useApi(extendkpitagbizlist, { manual: true });

  const formHook = useFormHook();

  const { watch } = formHook;

  const biztag = watch('biztag');
  const themetag = watch('themetag');

  useEffect(() => {
    runextendkpitaglist({
      tagType: 'biz',
      tagName: '',
      pageReq: {
        curPage: 1,
        pageSize: MAX_OPTION,
      },
    }).then((body) => {
      const { success, data, error } = body;
      if (success) {
        const { kpiTagRespList } = data;
        setBizData(kpiTagRespList);
      }
    });
  }, []);

  const formBiz = useMemo(() => {
    return [
      {
        type: 'select',
        name: 'biztag',
        label: '业务标签',
        align: 'right',
        props: {
          placeholder: '请选择业务标签',
          allowClear: true,
          loading: bizTagLoading,
        },
        render: (Select) => {
          const { Option } = Select;
          return bizData.map((item, i) => (<Option key={item.tagId} value={item.tagId}>{item.tagName}</Option>));
        },
      },
    ];
  }, [bizData, bizTagLoading]);

  const formTheme = useMemo(() => {
    return [
      {
        type: 'select',
        name: 'themetag',
        label: '主题标签',
        align: 'right',
        props: {
          placeholder: '请选择主题标签',
          allowClear: true,
          loading: themeTagLoading,
        },
        render: (Select) => {
          const { Option } = Select;
          return themeData.map((item, i) => (<Option key={item.tagId} value={item.tagId}>{item.tagName}</Option>));
        },
      },
    ];
  }, [themeData, themeTagLoading]);

  useEffect(() => {
    if (biztag) {
      runextendkpitagbizlist({
        bizTagId: biztag,
      }).then((body) => {
        const { success, data, error } = body;
        if (success) {
          const { kpiTagRespList } = data;
          setThemeData(kpiTagRespList || []);
        }
      });
    }
  }, [biztag]);

  const kpiMapping = useMemo(() => {
    const kpiNameMapping = {};
    for (let i = 0; i < kpiData.length; i += 1) {
      const { showName } = kpiData[i];
      const [kname, dname] = showName.split('_');
      if (dname) {
        if (!kpiNameMapping[kname]) {
          kpiNameMapping[kname] = {};
          kpiNameMapping[kname][dname] = kpiData[i];
        } else {
          kpiNameMapping[kname][dname] = kpiData[i];
        }
      }
    }
    const kpiName = Object.keys(kpiNameMapping);
    return {
      kpiName,
      kpiNameMapping,
    };
  }, [kpiData]);

  const dgetKpi = useCallback(debounce(getKpi, 500, { leading: false }), []);
  const formKpi = useMemo(() => {
    const { kpiName, kpiNameMapping } = kpiMapping;
    return [
      {
        type: 'select',
        name: 'kpi',
        label: '指标',
        align: 'right',
        props: {
          loading: kpiLoading,
          allowClear: true,
          showSearch: true,
          onSearch: dgetKpi,
        },
        render: (Select) => {
          const { Option } = Select;
          return kpiName.map((item, i) => (<Option key={item} value={item}>{item}</Option>));
        },
      },
    ];
  }, [kpiMapping, kpiLoading]);

  useEffect(() => {
    getKpi('', biztag, themetag);
  }, [biztag, themetag]);

  const {
    component,
  } = useFormTemplate([...formBiz, ...formTheme, ...formKpi], {
    reValidateMode: 'onBlur',
    span: 24,
    labelCol: 12,
    wrapCol: 12,
    formHook,
  });

  const tagForm = visible ? component : null;

  return {
    formHook,
    trigger: <SearchOutlined onClick={() => setVisible((v) => !v)} style={{ marginLeft: '16px' }} />,
    component: tagForm,
  };

  function getKpi(name = '', bizTagId, themeTagId) {
    runquerykpilist({
      name,
      themeTagId,
      bizTagId,
      limit: MAX_OPTION,
      offset: 0,
    }).then((body) => {
      const { success, data, error } = body;
      if (success) {
        const { kpiCommonMessages } = data;
        setKpiData(kpiCommonMessages || []);
      }
    });
  }
}

export function useDataPreview(kpiDetails, moduleType = 'table') {
  const { id: pageId, user } = useContext(ServerContext);
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [headerMessages, setHeaderMessages] = useState([]);
  const { run: runsendQueryDataOrder } = useApi(sendQueryDataOrder, { manual: true });
  const { run: runQueryheadermessage } = useApi(queryheadermessage, { manual: true });
  const { run: runQueryData, data: result } = useApi(queryData, { manual: true });
  const {
    fire: fireQueryData,
    stop,
    tick: queryTick,
    lastCounter: counter,
    loading,
  } = usePolling(runQueryData);

  useEffect(() => {
    if (result) {
      const { success, data, error } = result;
      if (success && data) {
        const { data: rawData, totalRows } = data;
        if (totalRows !== null) {
          setDataSource(rawData || []);
          // if (setTotal) setTotal(totalRows);
          // setLoading(false);
        } else {
          queryTick();
        }
      } else {
        // setLoading(false);
        // setStatus(4);
      }
    }
  }, [result]);

  const getData = useCallback(async (queryBody) => {
    const { extendKpiIds, derivedKpiIds } = queryBody;
    const body1 = await runsendQueryDataOrder(queryBody);
    const { success } = body1;
    if (success) {
      const { queryKey } = body1.data;
      fireQueryData({
        queryKey,
        extendKpiIds,
        derivedKpiIds,
        pageId,
        user: user.username,
      });
      const body2 = await runQueryheadermessage({
        queryKey,
        extendKpiIds,
        derivedKpiIds,
        pageId,
        user: user.username,
      });
      const { success, data, error } = body2;
      if (success) {
        const { headerMessages } = data;
        for (let i = 0; i < headerMessages.length; i += 1) {
          headerMessages[i].defineName = headerMessages[i].defineName.replace(/\s+/, '');
          headerMessages[i].showName = headerMessages[i].showName.replace(/\s+/, '');
        }
        setHeaderMessages(headerMessages);
      }
    }
  }, []);

  const {
    component: grapher,
  } = useGrapher(
    moduleType,
    {
      dataSource,
      defaultPageSize: 10,
      headerMessages,
      moduleExtendKpiRelationRespList: kpiDetails,
    },
  );


  return {
    setVisible,
    getData,
    grapher,
    component: (
      <Modal
        visible={visible}
        title="数据预览"
        onCancel={() => setVisible(false)}
        width="60vw"
        footer={null}
      >
        {grapher}
      </Modal>
    )
  };
};
