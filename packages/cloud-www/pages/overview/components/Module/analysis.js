/* eslint-disable no-use-before-define */
import React, {
  useMemo, useContext, useState, useRef, useEffect,
} from 'react';
import {
  Typography, Dropdown, Button, Menu, DatePicker, message,
  Form,
} from 'antd';
import {
  EllipsisOutlined, SettingOutlined, DeleteOutlined, DownloadOutlined,
} from '@ant-design/icons';
import {
  analysisModuleDelete,
} from '@client/api/core/overview/module/analysis';
import useApi from '@components/BiComponents/Hook/useApi';
import moment from 'moment';
import superagent from 'superagent';
import { ServerContext } from '@components/App';
import { InlineLoading as Loading } from '@components/BiComponents/Loading';
import Analysis from '@pages/analysis/pages';
import { FlexBox, FlexBoxItem as Item } from '@components/BiComponents/Box';
import { TabPanelContext } from '../TabPanel';
import useTitle from './useModuleTitle';
import useModuleForm from './useModuleForm';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { useForm } = Form;
const PICKER_TYPE = {
  1: 'date',
  2: 'week',
  3: 'month',
  4: 'year',
};

export default (props) => {
  const commonData = useContext(ServerContext);
  const panelData = useContext(TabPanelContext);
  const {
    user,
  } = commonData;
  const { dispatch } = panelData || {};
  const {
    pageId, componentId, detail, isPreview = false,
  } = props;
  const [dateRange, setDateRange] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const pointer = useRef(null);
  const [form] = useForm();
  const refHandler = useRef();
  const [datePickerType, setDatePickerType] = useState(1);
  const isMobile = window.innerWidth <= 768;

  const searchList = useMemo(() => {
    return [{
      searchDefineType: '时间维度',
      searchDefineName: 'dt',
    }]
  }, []);

  const { run: runAnalysisDelete } = useApi(analysisModuleDelete, {
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

  useEffect(() => {
    form.setFieldsValue({
      refDateRange: dateRange,
    });
  }, [dateRange]);

  const { analysisPageId } = detail;
  const Module = Analysis[analysisPageId] || (() => null);

  let title = '-';
  if (detail) {
    title = detail.remarkUrl && !isMobile ? <a style={{ color: '#24445c', textDecoration: 'underline' }} href={detail.remarkUrl || '#'}>{detail.moduleName}</a> : detail.moduleName;
  }
  const { component: moduleTitle } = useTitle(title, [
    {
      text: (
        <>
          <SettingOutlined />
          编辑
        </>
      ),
      onClick: () => dispatch({ type: 'addPanel', payload: { type: 'editAnalysis', editData: detail } }),
    },
    {
      text: (
        <>
          <DownloadOutlined />
          导出
        </>
      ),
      onClick: () => {
        const { download } = refHandler.current;
        if (typeof download === 'function') download();
      },
    },
    {
      text: (
        <>
          <DeleteOutlined />
          删除
        </>
      ),
      onClick() {
        runAnalysisDelete({
          moduleId: componentId,
          editor: user.username,
          pageId,
          moduleSourcesType: 1,
        });
      },
    },
  ]);

  const {
    components: moduleForm,
    setValue,
    getValues,
    timeRange,
  } = useModuleForm(searchList, {
    onTimeRangeChange(value) {
      if (value && refHandler.current) {
        const { setValue: analysisSetValue, submit } = refHandler.current;
        if (analysisSetValue) {
          analysisSetValue('dateRange', value);
          submit();
        }
      }
    },
  });

  useEffect(() => {
    window.addEventListener('Update_AnalysisTimeRange', (e) => {
      const source = e.data;
      if (source) {
        setValue('timeRange', source);
      }
    });
  }, []);

  return (
    <FlexBox css_h="100%" css_flexDir="column">
      <Item>
        {moduleTitle}
      </Item>
      <Item>
        {moduleForm}
      </Item>
      <Item
        ref={pointer}
        className="module-content"
        css_flex="1 auto"
        css_overflow="scroll"
      >
        <Module
          refInfo={{
            ...detail,
            container: pointer,
            refHandler,
            form,
            timeRange,
            setValue,
            getValues,
            refDateRange: dateRange,
            setRefDateRange: setDateRange,
            isPreview,
          }}
        />
      </Item>
    </FlexBox>
  );
};
