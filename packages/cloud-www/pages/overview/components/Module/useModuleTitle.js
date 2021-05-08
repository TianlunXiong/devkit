import React from 'react';
import {
  Dropdown, Menu,
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Box, { FlexBox, FlexBoxItem as Item } from '@components/BiComponents/Box';

const TITLE_STYLE = {
  css_p: '0 0 0 4px',
  css_color: '#5F6E82',
  css_lineHeight: '20px',
  css_fontSize: '14px',
  css_fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
};

export default (title = '-', actions = [], append) => {

  return {
    component: (
      <FlexBox css_alignItems="center" css_h="32px" css_p="0 6px">
        <Item
          css_flexGrow="1"
          {...TITLE_STYLE}
        >
          {title}
        </Item>
        {
          append
        }
        <Item>
          <Dropdown
            placement="bottomRight"
            trigger={['click', 'hover']}
            overlay={
              (
                <Menu>
                  {
                    actions.map((item, id) => {
                      const {
                        text, onClick, disabled = false, visible = true,
                      } = item;
                      if (!visible) return null;
                      return (
                        <Menu.Item
                          key={id}
                          disabled={disabled}
                          onClick={onClick}
                        >
                          {text}
                        </Menu.Item>
                      );
                    })
                  }
                </Menu>
              )
            }
          >
            <Box
              as="button"
              css_color="#8492A6"
              css_bgColor="rgba(0,0,0,0)"
              css_border="none"
              css_cursor="pointer"
            >
              <EllipsisOutlined />
            </Box>
          </Dropdown>
        </Item>
      </FlexBox>
    ),
  };
};
