import React, { useEffect, useCallback, useRef } from 'react';
import Box from '@components/BiComponents/Box';
import OriginModule from './local';
import AnalysisModule from './analysis';
import ErrorBoundary from '../ErrorBoundary/container'

const MODULE = {
  origin: OriginModule,
  analysis: AnalysisModule,
};

export default (props) => {
  const {
    pageId,
    moduleId,
    type,
    detail,
    writePermission,
  } = props;
  const Module = MODULE[type];

  return (
    <Box css_h="100%">
      <ErrorBoundary
        msg={
          <div>
            {`抱歉，😣组件崩溃了。`}
            {`类型: ${type === 'origin' ? '数据源组件' : '分析组件'}`}
            <br />
            {`组件名:${detail?.moduleName}`}
            <br />
            {`组件id: ${detail?.moduleId}`}
            {type === 'analysis' && (
              <>
                <br />
                {`分析页面路径: ${detail?.remarkUrl}`}
              </>
            )}
          </div>
        }
      >
        {detail ? (
          <Module
            pageId={Number(pageId)}
            componentId={moduleId}
            detail={detail}
            writePermission={writePermission}
          />
        ) : null}
      </ErrorBoundary>
    </Box>
  );
};
