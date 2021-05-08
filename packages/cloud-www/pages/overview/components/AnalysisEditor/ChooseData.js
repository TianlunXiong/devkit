/* eslint-disable no-use-before-define */
import React, {
  useState, useEffect, useContext,
} from 'react';
import {
  Form, Input, Select, Row, Col, message,
  Button,
} from 'antd';
import { ServerContext } from '@components/App';
import _ from 'lodash';
import superagent from 'superagent';
import { EditorContext } from './index';
import { TabPanelContext } from '../TabPanel';
import Analysis from '../Module/analysis';

const { Option, OptGroup } = Select;

export default function ChooseData() {
  const shareData = useContext(EditorContext);
  const commonData = useContext(ServerContext);
  const panelData = useContext(TabPanelContext);
  const { dispatch, activeKey } = panelData || {};
  const {
    specialPage, id: currentPageId, user, modulePath,
  } = commonData;
  const { tabKey, form, editData, refInfo } = shareData || {};

  const moduleData = specialPage.find((item) => item.modulePath === modulePath);

  const [pageOptions, setPageOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState({});
  const [analysisModuleOptions, setAnalysisModuleOptions] = useState([]);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (refInfo.handler) {
      refInfo.handler.current = {
        form,
        setPreviewData,
      };
    }
    if (editData) {
      const {
        moduleName, pageId: pId, templateId,
        templateModuleId, analysisPageId,
      } = editData;
      form.setFieldsValue({
        moduleName,
        addedToPage: pId,
        analysisTemplate: templateId,
        moduleInPage: templateModuleId,
      });
      superagent
        .get('/api/moviebi/dataanalysis/analysismodule/queryanalysismodulerelation')
        .query({
          pageId: analysisPageId,
        })
        .then(({ body }) => {
          const { success, data, error } = body;
          if (success) {
            const { moduleList = [] } = data;
            setAnalysisModuleOptions(moduleList);
          } else {
            setAnalysisModuleOptions([]);
            message.error(error.message);
          }
        });
    } else if (currentPageId !== undefined) {
      form.setFieldsValue({
        addedToPage: Number(currentPageId),
      });
    }
  }, []);
  useEffect(() => {
    let reqBody = {};
    if (moduleData) {
      reqBody = {
        pageLocation: 0,
        pageId: moduleData.pageId,
        user: user.username,
      };
    } else {
      reqBody = {
        pageLocation: 1,
        pageId: 0,
        user: user.username,
      };
    }
    superagent
      .post('/api/moviebi/frontconfiguration/page/contenttable')
      .send(reqBody)
      .then(({ body }) => {
        const { success, error, data } = body;
        if (success) {
          const { tableContentList } = data;
          setPageOptions(tableContentList);
        } else {
          message.error(error.message);
        }
      });

    superagent
      .post('/api/moviebi/dataanalysis/template/querytemplatebycondition')
      .send({
        user: user.username,
        pageReq: {
          curPage: 1,
          pageSize: 99999,
        },
      })
      .then(({ body }) => {
        const { success, data, error } = body;
        if (success) {
          const { templateQueryDataRespList = [] } = data;
          const types = {};
          for (let i = 0; i < templateQueryDataRespList.length; i += 1) {
            if (types[templateQueryDataRespList[i].templateType]) {
              types[templateQueryDataRespList[i].templateType].push(templateQueryDataRespList[i]);
            } else {
              types[templateQueryDataRespList[i].templateType] = [];
              types[templateQueryDataRespList[i].templateType].push(templateQueryDataRespList[i]);
            }
          }
          setTemplateOptions(types);
          if (editData) {
            form
              .validateFields()
              .then((r) => {
                const { moduleName, analysisTemplate, moduleInPage } = r;
                const analysisTemplateInfo = templateQueryDataRespList.find((item) => item.templateId === analysisTemplate);
                setPreviewData({
                  moduleName,
                  remarkUrl: `/analysis/${analysisTemplateInfo.pageId}?template=${analysisTemplate}`,
                  analysisPageId: analysisTemplateInfo.pageId,
                  templateId: analysisTemplate,
                  templateModuleId: moduleInPage,
                });
              });
          }
        } else {
          setTemplateOptions([]);
          message.error(error.message);
        }
      });
  }, []);


  const dashboardOpt = pageOptions.filter((item) => item.pageType === 1);
  const reportOpt = pageOptions.filter((item) => item.pageType === 2);

  const typeNames = Object.keys(templateOptions);

  return (
    <Row>
      <Col span={24} style={{ margin: '16px 0' }}>
        <Row>
          <Col md={24} lg={12}>
            <Form
              form={form}
            >
              <Row>
                <Col span={18}>
                  <Form.Item
                    labelCol={{ span: '8' }}
                    wrapperCol={{ span: '16' }}
                    name="moduleName"
                    label="新建组件名称"
                    rules={[{
                      required: true,
                      message: '请输入组件名称',
                    }]}
                    style={{ width: '100%' }}
                  >
                    <Input placeholder="组件名称" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={18}>
                  <Form.Item
                    name="addedToPage"
                    label="添加到页面"
                    labelCol={{ span: '8' }}
                    wrapperCol={{ span: '16' }}
                    rules={[{
                      required: true,
                      message: '请选择页面',
                    }]}
                  >
                    <Select
                      placeholder="添加到页面"
                      style={{ width: '100%' }}
                    >
                      <OptGroup label="数据看板">
                        {
                          dashboardOpt.map((item) => <Option key={item.pageId} value={item.pageId}>{item.pageName}</Option>)
                        }
                      </OptGroup>
                      <OptGroup label="数据报表">
                        {
                          reportOpt.map((item) => <Option key={item.pageId} value={item.pageId}>{item.pageName}</Option>)
                        }
                      </OptGroup>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={18}>
                  <Form.Item
                    label="选择分析模版"
                    name="analysisTemplate"
                    labelCol={{ span: '8' }}
                    wrapperCol={{ span: '16' }}
                    rules={[{
                      required: true,
                      message: '请选择分析模版',
                    }]}
                  >
                    <Select
                      placeholder="分析模版"
                      style={{ width: '100%' }}
                      onChange={() => {
                        form.resetFields(['moduleInPage']);
                      }}
                    >
                      {
                        typeNames.map((item) => {
                          return (
                            <OptGroup key={item} label={item}>
                              {
                                templateOptions[item].map((itme1) => <Option value={itme1.templateId} key={itme1.templateId}>{itme1.templateName}</Option>)
                              }
                            </OptGroup>
                          );
                        })
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={18}>
                  <Form.Item
                    label="选择分析模块"
                    name="moduleInPage"
                    labelCol={{ span: '8' }}
                    wrapperCol={{ span: '16' }}
                    rules={[{
                      required: true,
                      message: '请选择分析模块',
                    }]}
                  >
                    <Select
                      placeholder="分析模块"
                      style={{ width: '100%' }}
                      onDropdownVisibleChange={(open) => {
                        if (open) {
                          getAnalysisModules();
                        }
                      }}
                    >
                      {
                        analysisModuleOptions.map((item) => <Option key={item.moduleId} value={item.moduleId}>{item.moduleName}</Option>)
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={12} style={{ borderLeft: '1px solid rgb(240, 240, 240)', height: refInfo ? '' : '70vh', padding: '0 32px', overflow: 'auto' }}>
            {
              previewData ? (
                <div style={{ height: '60vh', margin: '5vh 0', display: 'flex', flexDirection: 'column' }} className="module-container main-bg deep-shadow">
                  <Analysis
                    isPreview
                    detail={previewData}
                  />
                </div>
              ) : null
            }
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="center">
          <Col span={4}>
            <Button
              type="primary"
              block
              onClick={() => {
                form
                  .validateFields()
                  .then((r) => {
                    const { moduleName, analysisTemplate, moduleInPage } = r;
                    const analysisTemplateInfo = _.flatten(Object.values(templateOptions)).find((item) => item.templateId === analysisTemplate);
                    setPreviewData(null);
                    setTimeout(() => {
                      setPreviewData({
                        moduleName,
                        remarkUrl: `/analysis/${analysisTemplateInfo.pageId}?template=${analysisTemplate}`,
                        analysisPageId: analysisTemplateInfo.pageId,
                        templateId: analysisTemplate,
                        templateModuleId: moduleInPage,
                      });
                    }, 200);
                  });
              }}
            >
              预览
            </Button>
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              block
              onClick={() => {
                form
                  .validateFields()
                  .then((r) => {
                    const { moduleName, addedToPage, analysisTemplate, moduleInPage } = r;
                    const url = editData
                      ? '/api/moviebi/dataanalysis/analysismodule/editanalysismodule'
                      : '/api/moviebi/dataanalysis/analysismodule/saveanalysismodule';
                    const analysisTemplateInfo = _.flatten(Object.values(templateOptions)).find((item) => item.templateId === analysisTemplate);
                    let postBody = {};
                    if (editData) {
                      postBody = {
                        moduleName,
                        moduleId: editData.moduleId,
                        pageId: addedToPage,
                        templateId: analysisTemplate,
                        templateModuleId: moduleInPage,
                        remarkUrl: `/analysis/${analysisTemplateInfo.pageId}?template=${analysisTemplate}`,
                        editor: user.username,
                      };
                    } else {
                      postBody = {
                        moduleName,
                        pageId: addedToPage,
                        templateId: analysisTemplate,
                        templateModuleId: moduleInPage,
                        remarkUrl: `/analysis/${analysisTemplateInfo.pageId}?template=${analysisTemplate}`,
                        creator: user.username,
                      };
                    }
                    superagent
                      .post(url)
                      .send(postBody)
                      .then(({ body }) => {
                        const { success, data, error } = body;
                        if (refInfo.callback) {
                          refInfo.callback();
                        }
                        if (success) {
                          message.success(data);
                          if (dispatch) {
                            dispatch({ type: 'removePanel', payload: activeKey });
                            dispatch({ type: 'switchTo', payload: '主页面' });
                          }
                          window.dispatchEvent(new Event('MainRefresh'));
                        } else {
                          message.error(error.message);
                        }
                      });
                  });
              }}
            >
              保存
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  function getAnalysisModules() {
    form
      .validateFields(['analysisTemplate'])
      .then((r) => {
        const { analysisTemplate: tId } = r;
        const analysisTemplate = _.flatten(Object.values(templateOptions)).find((item) => item.templateId === tId);
        if (analysisTemplate) {
          superagent
            .get('/api/moviebi/dataanalysis/analysismodule/queryanalysismodulerelation')
            .query({
              pageId: analysisTemplate.pageId,
            })
            .then(({ body }) => {
              const { success, data, error } = body;
              if (success) {
                const { moduleList = [] } = data;
                setAnalysisModuleOptions(moduleList);
              } else {
                setAnalysisModuleOptions([]);
                message.error(error.message);
              }
            });
        }
      })
  }
}
