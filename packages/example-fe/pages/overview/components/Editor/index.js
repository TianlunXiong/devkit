import React, {
  useReducer,
} from 'react';
import Box from '@components/BiComponents/Box';
import {
  Steps, Tabs, Form,
} from 'antd';
import ChooseData from './ChooseData';
import ShowSetting from './ShowSetting';
import Preview from './Preview';

export const EditorContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'setActiveStep':
      return { ...state, activeStep: action.payload };
    case 'setMainKpiCache':
      return { ...state, mainKpiCache: action.payload };
    case 'setAllKpiCache':
      return { ...state, allKpiCache: action.payload };
    case 'setDimCache':
      return { ...state, dimCache: action.payload };
    case 'setDimMappingCache':
      return { ...state, dimOptionMapping: action.payload };
    case 'setRatioCache':
      return { ...state, ratioCache: action.payload };
    case 'setOtherKpiCache':
      return { ...state, otherKpiCache: action.payload };
    case 'setFormGroup':
      return { ...state, formGroup: action.payload };
    default:
      throw new Error('invalid type');
  }
}

const { Step } = Steps;
const { TabPane } = Tabs;
const { useForm } = Form;

export default (props) => {
  const { editData, tabKey } = props;
  const [form] = useForm();

  const [editorShare, dispatch] = useReducer(
    reducer,
    {
      editData,
      tabKey,
      form,
      // formcomponents: exposedComponent,
      activeStep: 0,
      mainKpiCache: null,
      kpiCache: null,
      allKpiCache: null,
      otherKpiCache: null,
      ratioCache: null,
      dimCache: null,
      formGroup: {},
    },
  );

  return (
    <EditorContext.Provider value={editorShare}>
      <Box css_m="0 8px">
        <Steps
          current={editorShare.activeStep}
          onChange={(cur) => {
            if (editorShare.activeStep === 2) dispatch({ type: 'setActiveStep', payload: cur });
          }}
          type="navigation"
          style={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #E2E9F1',
          }}
        >
          <Step title="选择数据" />
          <Step title="展现形式" />
          <Step title="配置预览" />
        </Steps>
        <Tabs
          activeKey={editorShare.activeStep.toString()}
          defaultActiveKey="0"
          animated={false}
          renderTabBar={() => <div />}
          style={{ backgroundColor: '#fff' }}
        >
          <TabPane tab="Tab 1" key="0">
            <ChooseData dispatch={dispatch} />
          </TabPane>
          <TabPane tab="Tab 2" key="1">
            <ShowSetting dispatch={dispatch} />
          </TabPane>
          <TabPane tab="Tab 3" key="2">
            <Preview dispatch={dispatch} />
          </TabPane>
        </Tabs>
      </Box>
    </EditorContext.Provider>
  );
};
