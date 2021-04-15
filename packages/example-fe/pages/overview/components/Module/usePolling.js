import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useMemo } from 'react';

export default (fn, config = {}) => {
  const {
    wait = 1000,
    series = true,
  } = config;
  const [counter, setCounter] = useState(0);
  const [lastCounter, setLastCounter] = useState(0);
  const [handler, setHandler] = useState(null);
  const [isFired, setIsFired] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (isFired && fn instanceof Function) {
      const { params } = isFired || {};
      fn(params);
      // const h = setTimeout(() => {
      //   if (!series) {
      //     setCounter((v) => v + 1);
      //     setLastCounter((v) => v + 1);
      //   }
      //   setHandler(h);
      // }, counter === 0 ? 0 : wait);
    } else {
      setCounter(0);
    }
  }, [isFired, counter]);

  const fire = useCallback((params) => {
    setStartTime(moment());
    setIsFired({
      params,
      counter,
    });
    setLastCounter(0);
  }, [counter]);


  const stop = useCallback(() => {
    setIsFired(null);
    clearTimeout(handler);
    setEndTime(moment());
  }, [handler]);

  const cost = useMemo(() => {
    if (!startTime || !endTime) return null;
    return `${endTime.diff(startTime, 'milliseconds')}`;
  }, [startTime, endTime]);

  const tick = useCallback(() => {
    const h = setTimeout(() => {
      setCounter((v) => v + 1);
      setLastCounter((v) => v + 1);
    }, wait);
    setHandler(h);
  }, []);

  return {
    fire,
    tick,
    stop,
    cost,
    counter,
    lastCounter,
    startTime,
    loading: !!isFired,
  };
};
