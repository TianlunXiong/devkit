import React, { createContext, useReducer, useMemo } from 'react';

const HandyContext = createContext();

export default () => {
  const [state, dispatch] = useReducer(reducer, {});

  const Provider = useMemo(() => {
    return (props) => {
      const { children } = props;
      return (
        <HandyContext.Provider value={{ state, dispatch }}>
          {children}
        </HandyContext.Provider>
      );
    };
  }, [state]);

  return {
    state,
    Provider,
    Context: HandyContext,
  };
};

function reducer(state, action) {
  // const nState = { ...state };
  const oState = state;
  const { name, fn } = action.payload;
  switch (action.type) {
    case 'register':
      oState[name] = fn;
      return oState;
    case 'unregister':
      delete oState[name];
      return oState;
    default:
      throw new Error();
  }
}
