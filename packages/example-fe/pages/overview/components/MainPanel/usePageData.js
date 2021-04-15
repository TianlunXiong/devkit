import React, { useState, useEffect } from 'react';
import {
  pageExactQuery,
  pageEdit,
} from '@client/api/core/overview/page';
import {
  Input, message, Button,
} from 'antd';
import Box, { FlexBox, FlexBoxItem as Item } from '@components/BiComponents/Box';
import { useForm, Controller } from 'react-hook-form';
import useApi from '@client/components/BiComponents/Hook/useApi';
import { useCallback } from 'react';

const { TextArea } = Input;

export default (user = {}, id) => {
  const [pageData, setPageData] = useState(null);
  const [editTitleStatus, setEditTitleStatus] = useState(false);
  const {
    control, getValues,
  } = useForm();
  const init = useCallback(() => {
    if (user.username && id) {
      runExactquery({
        pageId: id,
        user: user.username,
      });
    } else {
      message.error('未知用户');
    }
  }, []);
  const { run: runExactquery } = useApi(pageExactQuery, {
    manual: true,
    onSuccess(body) {
      const { success, error, data } = body;
      if (success) {
        // data.writePermission = false;
        setPageData(data);
      } else {
        message.error(error.message);
      }
    },
  });

  const { run: runPageEdit } = useApi(pageEdit, {
    manual: true,
    onSuccess(body) {
      const { success, error, data } = body;
      if (success) {
        message.success(data);
        init();
        setEditTitleStatus(false);
        window.dispatchEvent(new Event('refreshOverviewSider'));
      } else {
        message.error(error.message);
      }
    },
  });

  const edit = useCallback(() => {
    if (pageData && user.username) {
      const { pageName } = getValues();
      const {
        pageId,
        pageLocation,
        pageType,
        pageParentId,
      } = pageData;
      runPageEdit({
        pageId,
        pageName,
        pageLocation,
        pageType,
        pageParentId,
        editor: user.username,
      });
    }
  }, [pageData]);

  useEffect(() => {
    init();
  }, []);

  const { pageName } = pageData || {};

  return {
    pageData: pageData || {},
    editTitleStatus,
    setEditTitleStatus,
    components: (
      <>
        {
          editTitleStatus ? (
            <FlexBox>
              <Item css_flexGrow="1">
                <Controller
                  name="pageName"
                  defaultValue={pageName}
                  control={control}
                  as={(
                    <TextArea
                      autoSize
                      style={{ padding: 4 }}
                      placeholder="填写页面描述标题"
                    />
                  )}
                />
              </Item>
              <Item css_m="0 0 0 16px">
                <Button onClick={edit} type="primary">
                  保存
                </Button>
              </Item>
              <Item css_m="0 0 0 8px">
                <Button onClick={() => setEditTitleStatus(false)}>
                  取消
                </Button>
              </Item>
            </FlexBox>
          ) : (
            <Box css_fontWeight="600" css_fontSize="20px">
              {pageName || '-'}
            </Box>
          )
        }
      </>
    ),
  };
};
