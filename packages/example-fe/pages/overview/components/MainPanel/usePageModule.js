import React from 'react';
import { message } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import {
  moduleMessageByPageId,
} from '@client/api/core/overview/module/local';
import useApi from '@components/BiComponents/Hook/useApi';


export default (pageId) => {
  const [modules, setModules] = useState(null);
  const { run: runModuleMessageByPageId } = useApi(moduleMessageByPageId, {
    manual: true,
  });

  const init = useCallback(() => {
    if (pageId) {
      runModuleMessageByPageId({
        pageId,
      }).then((body) => {
        const { success, error, data } = body;
        if (success) {
          const { moduleMessages = [] } = data;
          const sModuleMessages = moduleMessages.sort((a, b) => {
            const { moduleLocation: strA } = a;
            const { moduleLocation: strB } = b;
            if (!strA || !strB) return 1;
            const { y: ya } = JSON.parse(strA);
            const { y: yb } = JSON.parse(strB);
            return Number(ya) - Number(yb);
          });
          setModules(sModuleMessages);
        } else {
          message.error(error.message);
        }
      });
    }
  }, []);

  useEffect(() => {
    init();
  }, []);

  return {
    modules,
    reset: init,
  };
};
