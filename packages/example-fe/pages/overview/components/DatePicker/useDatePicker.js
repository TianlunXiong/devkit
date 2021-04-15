import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { FlexBox, FlexBoxItem as Item } from '@components/BiComponents/Box';
import PICKER from './index';

const PICKER_TYPE = {
  1: 'date',
  2: 'week',
  3: 'month',
  4: 'year',
};

export default (type = 'middle', listener = {}, hidden = {}) => {
  const { onChange, bordered = false } = listener;
  const RangePicker = useMemo(() => PICKER[type], [type]);
  const [datePickerType, setDatePickerType] = useState(1);

  return {
    datePickerType,
    setDatePickerType,
    component: (
      <RangePicker
        onChange={onChange}
        bordered={bordered}
        inputReadOnly
        ranges={{
          近7天: [moment().add(-7, 'day'), moment().add(-1, 'day')],
          近30天: [moment().add(-30, 'day'), moment().add(-1, 'day')],
        }}
        getPopupContainer={(n) => {
          return n;
        }}
        picker={PICKER_TYPE[datePickerType]}
        renderExtraFooter={() => {
          return (
            <FlexBox>
              {
                [
                  {
                    text: '按日',
                    type: 1,
                    onClick() {
                      setDatePickerType(1);
                    },
                  },
                  {
                    text: '按周',
                    type: 2,
                    onClick() {
                      setDatePickerType(2);
                    },
                  },
                  {
                    text: '按月',
                    type: 3,
                    onClick() {
                      setDatePickerType(3);
                    },
                  },
                  {
                    text: '按年',
                    type: 4,
                    onClick() {
                      setDatePickerType(4);
                    },
                  },
                ].filter(item => !hidden[item.type]).map((item) => (
                  <Item
                    key={item.text}
                    onClick={item.onClick}
                    css_bgColor={datePickerType === item.type ? '#fff1f0' : ''}
                    css_flexGrow="1"
                    css_hover_bgColor="#fff1f0"
                    css_textAlign="center"
                  >
                    {item.text}
                  </Item>
                ))
              }
            </FlexBox>
          );
        }}
      />
    )
  }
}