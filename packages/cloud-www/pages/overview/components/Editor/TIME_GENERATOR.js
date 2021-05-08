import moment from 'moment';

const DtGenerator = {
  今日: () => [moment().startOf('day'), moment().endOf('day')],
  明日: () => [moment().add(1, 'day').startOf('day'), moment().add(1, 'day').endOf('day')],
  昨日: () => [moment().add(-1, 'day').startOf('day'), moment().add(-1, 'day').endOf('day')],
  本周: () => [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
  上周: () => [moment().add(-1, 'week').startOf('isoWeek'), moment().add(-1, 'week').endOf('isoWeek')],
  上上周: () => [moment().add(-2, 'week').startOf('isoWeek'), moment().add(-2, 'week').endOf('isoWeek')],
  本月: () => [moment().startOf('month'), moment().endOf('month')],
  上月: () => [moment().add(-1, 'month').startOf('month'), moment().add(-1, 'month').endOf('month')],
  今年: () => [moment().startOf('year'), moment().endOf('year')],
  去年: () => [moment().add(-1, 'year').startOf('year'), moment().add(-1, 'year').endOf('year')],
  过去7天: () => [moment().add(-7, 'day').startOf('day'), moment().add(-1, 'day').endOf('day')],
  过去30天: () => [moment().add(-30, 'day').startOf('day'), moment().add(-1, 'day').endOf('day')],
};
DtGenerator.default = DtGenerator.过去7天;

const DT_OPTION = Object.keys(DtGenerator);

const HourGenerator = {
  当前时刻: (m = []) => {
    const [m1, m2] = m;
    const tillNowMS = (+moment()) - (+moment().startOf('day'));
    return [moment(+moment(m1).startOf('day') + tillNowMS), moment(+moment(m2).startOf('day') + tillNowMS)];
  },
  到当前时刻: (m = []) => {
    const [m1, m2] = m;
    const tillNowMS = (+moment()) - (+moment().startOf('day'));
    return [moment(+moment(m1).startOf('day')), moment(+moment(m2).startOf('day') + tillNowMS)];
  },
  近一小时: (m = []) => {
    const [m1, m2] = m;
    const tillNowMS = (+moment()) - (+moment().startOf('day'));
    return [moment(+moment(m1).startOf('day') + tillNowMS).add(-1, 'hours'), moment(+moment(m2).startOf('day') + tillNowMS)];
  },
  全天: (m = []) => {
    const [m1, m2] = m;
    return [moment(m1).startOf('day'), moment(m2).endOf('day')];
  },
};
HourGenerator.default = HourGenerator.全天;

const TimeGenerator = {
  dt: DtGenerator,
  week: DtGenerator,
  month: DtGenerator,
  year: DtGenerator,
  hour: HourGenerator,
};

const TIME_PRIORITY = {
  hour: 1,
  dt: 2,
  week: 3,
  month: 4,
  year: 5,
};

const MomentRangeToValuesOfWhereExtraMap = {
  hour: ([st, et]) => [moment(st).format('HH'), moment(et).format('HH')],
  dt: ([st, et]) => [moment(st).startOf('day').format('YYYYMMDD'), moment(et).endOf('day').format('YYYYMMDD')],
  week: ([st, et]) => [`${moment(st).isoWeekYear()}WK${st.isoWeek()}`, `${moment(et).isoWeekYear()}WK${moment(et).isoWeek()}`],
  month: ([st, et]) => [`${moment(st).year()}${moment(st).format('MM')}`, `${moment(et).year()}${moment(et).format('MM')}`],
  year: ([st, et]) => [moment(st).year().toString(), moment(et).year().toString()],
};

const MomentRangeToPageSizeOfWhereExtraMap = {
  hour: ([st, et]) => moment(et).diff(moment(st), 'hours') + 1,
  dt: ([st, et]) => moment(et).diff(moment(st), 'days') + 1,
  week: ([st, et]) => moment(et).diff(moment(st), 'weeks') + 1,
  month: ([st, et]) => moment(et).diff(moment(st), 'months') + 1,
  year: ([st, et]) => moment(et).diff(moment(st), 'years') + 1,
};

export {
  DtGenerator,
  HourGenerator,
  TimeGenerator,
  MomentRangeToValuesOfWhereExtraMap,
  MomentRangeToPageSizeOfWhereExtraMap,
  TIME_PRIORITY,
  DT_OPTION,
};
