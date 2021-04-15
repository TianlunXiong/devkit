import { useEffect, useState, useCallback } from 'react';

export default (config = {}) => {
  const {
    initDelay = 800,
    initGroup = 2,
    onBunch,
    manual = false,
  } = config;
  const [index, setIndex] = useState(0);
  const [task, setTask] = useState([]);
  const [onTask, setOnTask] = useState([]);
  const [result, setResult] = useState([]);
  const [delay] = useState(initDelay);
  const [group] = useState(initGroup);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task.length) {
      const todo = task.slice(index, index + group);
      if (todo.length) {
        setOnTask(todo);
        if (!manual) {
          setTimeout(() => setIndex((v) => v + group), index === 0 ? 0 : delay);
        }
      } else {
        setTask([]);
        setLoading(false);
      }
    }
  }, [task, group, index, delay]);

  useEffect(() => {
    if (task.length === 0) {
      setIndex(0);
    }
  }, [task]);

  useEffect(() => {
    if (onTask.length) {
      setLoading(true);
      const r = [];
      for (let i = 0; i < onTask.length; i += 1) {
        if (onTask[i] instanceof Function) {
          r.push(onTask[i]());
        }
      }
      if (onBunch instanceof Function) onBunch(r);
      setResult([...result, ...r]);
      setOnTask([]);
    }
  }, [onTask]);

  const tick = useCallback(() => setTimeout(() => setIndex((v) => v + group), index === 0 ? 0 : delay), [group, delay]);

  return {
    setTask,
    result,
    loading,
    tick,
  };
};
