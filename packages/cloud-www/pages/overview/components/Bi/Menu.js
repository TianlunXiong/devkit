import styled from 'styled-components';
import { Menu } from 'antd';

export default styled(Menu)`
  .ant-menu-submenu-title {
    padding: 10px 12px 10px 21px!important;
    height: auto!important;
    line-height: 1.5!important;
    font-size: 12px;
    margin: 0;
  }

  .ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, .ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, .ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, .ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow::after {
    background-image: linear-gradient(to right, #8492a6, #8492a6);
  }

  .ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, .ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, .ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow::after, .ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow::before {
    background-image: linear-gradient(to right, #8492a6, #8492a6);
  }

  .ant-menu-sub.ant-menu-inline > .ant-menu-item, .ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
    padding: 0 21px 0px 0px;
    padding-left: 33px!important;
    line-height: 36px;
    height: 36px;
    margin: 0;
  }

  .ant-menu-vertical .ant-menu-item:not(:last-child), .ant-menu-vertical-left .ant-menu-item:not(:last-child), .ant-menu-vertical-right .ant-menu-item:not(:last-child), .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin: 0;
  }
`;
