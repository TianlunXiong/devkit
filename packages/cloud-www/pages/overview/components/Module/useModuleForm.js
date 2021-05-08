import React, { useState, useEffect, useCallback } from 'react';
import {
  Select, message,
} from 'antd';
import moment from 'moment';
import Box, { FlexBox, FlexBoxItem as Item, AbsoluteBox } from '@components/BiComponents/Box';
import { useForm, Controller } from 'react-hook-form';
import { searchListOption } from '@client/api/core/overview/module/local';
import _ from 'lodash';
import { BiSRangePicker as BiRangePicker } from '../DatePicker';

const ButtonStyle = {
  css_p: '4px 8px',
  css_borderRadius: '3px',
  css_border: 'none',
};

const FButtonStyle = {
  css_bgColor: '#eb212d',
  css_color: '#fff',
  css_p: '4px 8px',
  css_borderRadius: '3px',
  css_border: 'none',
  css_active_bgColor: '#c2172a',
};

const FormItem = ({ label, content }) => (
  <FlexBox css_alignItems="center" css_p="12px 0">
    <Item css_minW="100px">
      {label}
      :
    </Item>
    <Item css_flex="1" css_m="0 16px 0 8px">
      {content}
    </Item>
  </FlexBox>
);

const { Option } = Select;

const PICKER_TYPE = {
  1: 'date',
  2: 'week',
  3: 'month',
  4: 'year',
};

const MAX_DIM_OPTION = 50;

export default (searchList = [], config) => {
  const {
    extendKpiIds = [],
    derivedKpiIds = [],
    onTimeRangeChange,
    onSubmit,
  } = config;
  const {
    control, setValue, watch, getValues, triggerValidation, formState,
  } = useForm();
  const [pickerType, setPickerType] = useState(1);
  const [showTime, setShowTime] = useState(false);
  const [textDimOption, setTextDimOption] = useState({});
  const [textSearchLoading, setTextSearchLoading] = useState({});
  const [textSearchVisible, setTextSearchVisible] = useState(false);

  const timeDims = searchList.filter((item) => item.searchDefineType === '时间维度');
  const textDims = searchList.filter((item) => item.searchDefineType === '文本维度');

  useEffect(() => {
    if (timeDims.length) {
      const hasHourDim = timeDims.find((item) => item.searchDefineName === 'hour');
      const hasWeekDim = timeDims.find((item) => item.searchDefineName === 'week');
      const hasMonthDim = timeDims.find((item) => item.searchDefineName === 'month');
      const hasYearDim = timeDims.find((item) => item.searchDefineName === 'year');
      if (hasHourDim) setShowTime(true);
      if (hasWeekDim) setPickerType(2);
      if (hasMonthDim) setPickerType(3);
      if (hasYearDim) setPickerType(4);
    }
  }, [timeDims]);

  const searchingOption = useCallback(_.throttle(({
    searchId,
    searchDefineName,
    value = '',
  }) => {
    searchListOption({
      extendKpiIds,
      derivedKpiIds,
      searchId,
      searchDefineName,
      value,
      limit: MAX_DIM_OPTION,
    }).then((result) => {
      const { success, error, data } = result;
      if (success) {
        const { searchBoxContentList } = data;
        setTextDimOption({ ...textDimOption, [searchId]: searchBoxContentList });
      } else {
        message.error(error.message);
      }
      setTextSearchLoading((v) => ({
        ...v,
        [searchId]: false,
      }));
    });
  }, 300, { trailing: true, leading: false }), []);

  const watchTimeRange = watch('timeRange');

  useEffect(() => {
    if (watchTimeRange !== undefined) {
      onTimeRangeChange(watchTimeRange);
    }
  }, [watchTimeRange]);

  return {
    setValue,
    getValues,
    setTextSearchVisible,
    formState,
    timeRange: watchTimeRange,
    components: (
      <Box css_p="0 4px">
        <Box>
          {timeDims.length > 0 && (
            <Controller
              name="timeRange"
              as={
                <BiRangePicker
                  showTime={showTime}
                  size="small"
                  inputReadOnly
                  allowClear={false}
                  picker={PICKER_TYPE[pickerType]}
                  ranges={{
                    近7天: [moment().add(-7, 'day'), moment().add(-1, 'day')],
                    近30天: [moment().add(-30, 'day'), moment().add(-1, 'day')],
                  }}
                  separator="~"
                  suffixIcon={null}
                  bordered={false}
                  onOpenChange={(open) => {
                    if (open) {
                      setValue('timeRange', null);
                    }
                  }}
                  renderExtraFooter={() => {
                    return (
                      <FlexBox>
                        {[
                          {
                            text: '按日',
                            type: 1,
                            onClick() {
                              setPickerType(1);
                            },
                          },
                          {
                            text: '按周',
                            type: 2,
                            onClick() {
                              setPickerType(2);
                            },
                          },
                          {
                            text: '按月',
                            type: 3,
                            onClick() {
                              setPickerType(3);
                            },
                          },
                          {
                            text: '按年',
                            type: 4,
                            onClick() {
                              setPickerType(4);
                            },
                          },
                        ].map((item) => (
                          <Item
                            key={item.text}
                            onClick={item.onClick}
                            css_bgColor={
                              pickerType === item.type ? '#fff1f0' : ''
                            }
                            css_flexGrow="1"
                            css_hover_bgColor="#fff1f0"
                            css_textAlign="center"
                          >
                            {item.text}
                          </Item>
                        ))}
                      </FlexBox>
                    );
                  }}
                />
              }
              control={control}
              rules={{ required: { message: '请选择时间段', value: true } }}
            />
          )}
        </Box>
        <AbsoluteBox
          {...(textSearchVisible
            ? {}
            : {
                css_display: 'none',
              })}
          css_left="8px"
          css_right="24px"
          css_top="8px"
          css_bottom="8px"
          css_p="24px"
          css_bgColor="#fff"
          css_zIndex="9"
          css_borderRadius="6px"
          css_shadow="0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
        >
          <FlexBox css_flexDir="column" css_h="100%">
            <FlexBox css_alignItems="center">
              <Item css_flex="1" css_fontSize="18px">
                筛选单
              </Item>
              <Box
                css_m="0 12px 0 0"
                onClick={() => {
                  triggerValidation().then((ok) => {
                    if (ok) {
                      setTextSearchVisible(false);
                      if (onSubmit instanceof Function) onSubmit();
                    }
                  });
                }}
                as="button"
                {...FButtonStyle}
              >
                提交
              </Box>
              <Box
                onClick={() => setTextSearchVisible(false)}
                as="button"
                {...ButtonStyle}
              >
                关闭
              </Box>
            </FlexBox>
            <Box css_m="12px 0" css_borderBottom="1px solid #E2E9F1" />
            <Item css_flex="1" css_overflow="scroll">
              <FlexBox css_flexDir="column">
                {textDims.map((item) => (
                  <Item css_flex="1">
                    <FormItem
                      key={item.searchId}
                      label={item.searchShowName}
                      content={
                        <Controller
                          name={item.searchDefineName}
                          as={
                            <Select
                              showSearch
                              mode="multiple"
                              // size="small"
                              loading={textSearchLoading[item.searchId]}
                              style={{ width: '100%' }}
                              placeholder={item.searchShowName}
                              filterOption={false}
                              onDropdownVisibleChange={(open) => {
                                if (open) {
                                  setTextSearchLoading((v) => ({
                                    ...v,
                                    [item.searchId]: true,
                                  }));
                                  searchingOption({
                                    searchId: item.searchId,
                                    searchDefineName: item.searchDefineName,
                                  });
                                }
                              }}
                              onSearch={(value) => {
                                setTextSearchLoading((v) => ({
                                  ...v,
                                  [item.searchId]: true,
                                }));
                                searchingOption({
                                  searchId: item.searchId,
                                  searchDefineName: item.searchDefineName,
                                  value,
                                });
                              }}
                            >
                              {textDimOption[item.searchId]
                                ? textDimOption[item.searchId].map((item1) => (
                                    <Option
                                      key={item1.value}
                                      value={item1.value}
                                    >
                                      {item1.display}
                                    </Option>
                                  ))
                                : null}
                            </Select>
                          }
                          control={control}
                        />
                      }
                    />
                  </Item>
                ))}
              </FlexBox>
            </Item>
          </FlexBox>
        </AbsoluteBox>
      </Box>
    ),
  };
};
