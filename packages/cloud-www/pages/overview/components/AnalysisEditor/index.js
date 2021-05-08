import React, {
  useReducer,
} from 'react';
import {
  Steps, Tabs, Form,
} from 'antd';
import ChooseData from './ChooseData';

function reducer(state, action) {
  switch (action.type) {
    case 'setActiveStep':
      return { ...state, activeStep: action.payload };
    default:
      throw new Error('invalid type');
  }
}

const { Step } = Steps;
const { TabPane } = Tabs;
const { useForm } = Form;

export const EditorContext = React.createContext();

export default (props) => {
  const { tabKey, editData, refInfo = {} } = props;
  const [form] = useForm();

  const [editorShare, dispatch] = useReducer(
    reducer,
    {
      tabKey,
      editData,
      form,
      activeStep: 0,
      refInfo,
    },
  );
  editorShare.dispatch = dispatch;

  return (
    <EditorContext.Provider value={editorShare}>
      <Steps
        current={editorShare.activeStep}
        onChange={(cur) => {
          dispatch({ type: 'setActiveStep', payload: cur });
        }}
        type="navigation"
        style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E9F1' }}
      >
        <Step title="创建分析组件" />
        {/* <Step title="配置预览" /> */}
      </Steps>
      <Tabs
        activeKey={editorShare.activeStep.toString()}
        defaultActiveKey="0"
        animated={false}
        renderTabBar={() => <div />}
        style={{ backgroundColor: '#fff' }}
      >
        <TabPane key="0">
          <ChooseData />
        </TabPane>
        {/* <TabPane key="1">
          <div>3</div>
        </TabPane> */}
      </Tabs>
    </EditorContext.Provider>
  );
};
