/* eslint-disable import/prefer-default-export */
import {
  DatePicker,
} from 'antd';
import styled from 'styled-components';


const { RangePicker } = DatePicker;

export const BiSRangePicker = styled(RangePicker)`
    .ant-picker-input > input {
      font-size: 12px;
      font-weight: 100;
      padding-right: 4px;
    }
    .ant-picker-active-bar {
      margin-left: 0px!important;
    }
    .ant-picker-range-separator {
      font-weight: 100;
      padding: 0;
    }
    & {
      padding: 0;
      border: none;
    }
    font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
    .ant-picker-clear {
      right: -14px;
    }
`;

export const BiRangePicker = styled(RangePicker)`
    .ant-picker-input > input {
      font-weight: 300;
    }
    .ant-picker-active-bar {
      margin-left: 0px!important;
    }
    .ant-picker-range-separator {
      font-weight: 300;
    }
    & {
      border: none;
    }
    font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
`;


export default {
  small: BiSRangePicker,
  middle: BiRangePicker,
  normal: RangePicker,
};
