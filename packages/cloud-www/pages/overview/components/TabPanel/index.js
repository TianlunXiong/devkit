/* eslint-disable no-case-declarations */
/* eslint-disable no-use-before-define */
import React, { useReducer } from 'react';
import { Tabs as AntdTabs, Tag } from 'antd';
import styled from 'styled-components';
import AnalysisEditor from '../AnalysisEditor';
import Editor from '../Editor';
import ErrorBoundary from '../ErrorBoundary/container'

const Tabs = styled(AntdTabs)`
  .ant-tabs-nav {
    margin: 8px 8px 0 8px;
  }
`;

const { TabPane } = Tabs;

export const TabPanelContext = React.createContext();

export default (props) => {
  const { main = null } = props;
  const [tabPanelShare, dispatch] = useReducer(
    reducer,
    {
      activeKey: '主页面',
      componentPanels: [],
    },
  );
  tabPanelShare.dispatch = dispatch;
  const { activeKey, componentPanels } = tabPanelShare;

  return (
    <TabPanelContext.Provider value={tabPanelShare}>
      <Tabs
        activeKey={activeKey}
        type="editable-card"
        renderTabBar={(p, C) =>
          componentPanels.length > 0 ? <C {...p} /> : <div />
        }
        onTabClick={(val) => {
          dispatch({ type: 'switchTo', payload: val });
        }}
        onEdit={(targetKey, action) => {
          if (action === 'remove') {
            dispatch({ type: 'removePanel', payload: targetKey });
          }
          if (action === 'add') {
            const currentPanel = componentPanels.find(
              (item) => item.id === activeKey,
            );
            if (currentPanel) {
              const payloadType =
                currentPanel.type === 'local'
                  ? 'createLocal'
                  : 'createAnalysis';
              dispatch({ type: 'addPanel', payload: { type: payloadType } });
            } else {
              dispatch({ type: 'addPanel', payload: { type: 'createLocal' } });
            }
          }
        }}
      >
        <TabPane closable={false} tab="主页面" key="主页面">
          <ErrorBoundary msg="主页面崩溃了">{main}</ErrorBoundary>
        </TabPane>
        {componentPanels.map((item) => {
          if (item.type === 'local') {
            if (item.editData) {
              return (
                <TabPane
                  key={item.id}
                  tab={
                    <Tag color="processing">{`正在编辑组件${item.editData.moduleName}`}</Tag>
                  }
                >
                  <Editor tabKey={item.id} editData={item.editData} />
                </TabPane>
              );
            }
            return (
              <TabPane key={item.id} tab="添加数据源组件">
                <Editor tabKey={item.id} />
              </TabPane>
            );
          }
          if (item.type === 'analysis') {
            if (item.editData) {
              return (
                <TabPane
                  key={item.id}
                  tab={
                    <Tag color="processing">{`正在编辑分析组件${item.editData.moduleName}`}</Tag>
                  }
                >
                  <AnalysisEditor tabKey={item.id} editData={item.editData} />
                </TabPane>
              );
            }
            return (
              <TabPane key={item.id} tab="添加分析组件">
                <AnalysisEditor tabKey={item.id} />
              </TabPane>
            );
          }

          return null;
        })}
      </Tabs>
    </TabPanelContext.Provider>
  );
};


function reducer(state, action) {
  const { componentPanels } = state;
  switch (action.type) {
    case 'switchTo':
      return { ...state, activeKey: action.payload || '主页面' };
    case 'addPanel':
    {
      const { type, editData } = action.payload;
      const nextActiveKey = componentPanels.length.toString();
      if (type === 'createLocal') {
        componentPanels.push({
          id: nextActiveKey,
          type: 'local',
        });
      }
      if (type === 'createAnalysis') {
        componentPanels.push({
          id: nextActiveKey,
          type: 'analysis',
        });
      }

      if (type === 'editLocal') {
        componentPanels.push({
          id: nextActiveKey,
          type: 'local',
          editData,
        });
      }

      if (type === 'editAnalysis') {
        componentPanels.push({
          id: nextActiveKey,
          editData,
          type: 'analysis',
        });
      }

      return { ...state, activeKey: nextActiveKey, componentPanels };
    }
    case 'removePanel':
    {
      const nextPanels = componentPanels.filter((item) => item.id !== action.payload);
      const nextActiveKey = nextPanels[nextPanels.length - 1] ? nextPanels[nextPanels.length - 1].id : '主页面';
      return { ...state, activeKey: nextActiveKey, componentPanels: nextPanels };
    }
    default:
      throw new Error('invalid type');
  }
}