self["webpackHotUpdate_vikit_example_fe"]("xcloud-cli_tmp_vikit_example-fe_-Users-tainlx-Desktop-project_01-vikit-packages-example-fe-pa-102c01",{

/***/ "../xstyle/src/space/index.tsx":
/*!*************************************!*\
  !*** ../xstyle/src/space/index.tsx ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../../node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../node_modules/react-refresh/runtime.js */ "../../node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);

function space(props) {
  return `
        ${props.m ? `margin: ${props.m};` : ''}
        ${props.mt ? `margin-top: ${props.mt};` : ''}
        ${props.mr ? `margin-right: ${props.mr};` : ''}
        ${props.mb ? `margin-bottom: ${props.mb};` : ''}
        ${props.ml ? `margin-left: ${props.ml};` : ''}
        ${props.mx ? `margin-left: ${props.mx};margin-right: ${props.mx}` : ''}
        ${props.my ? `margin-top: ${props.my};margin-top: ${props.my}` : ''}
        ${props.p ? `padding: ${props.p};` : ''}
        ${props.pt ? `padding-top: ${props.pt};` : ''}
        ${props.pr ? `padding-right: ${props.pr};` : ''}
        ${props.pb ? `padding-bottom: ${props.pb};` : ''}
        ${props.pl ? `padding-left: ${props.pl};` : ''}
        ${props.px ? `padding-left: ${props.px};padding-right: ${props.px}` : ''}
        ${props.py ? `padding-top: ${props.py};padding-top: ${props.py}` : ''}
    `;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (space);

const currentExports = __react_refresh_utils__.getModuleExports(module.id);
__react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.id);

if (true) {
  const isHotUpdate = !!module.hot.data;
  const prevExports = isHotUpdate ? module.hot.data.prevExports : null;

  if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
    module.hot.dispose(
      /**
       * A callback to performs a full refresh if React has unrecoverable errors,
       * and also caches the to-be-disposed module.
       * @param {*} data A hot module data object from Webpack HMR.
       * @returns {void}
       */
      function hotDisposeCallback(data) {
        // We have to mutate the data object to get data registered and cached
        data.prevExports = currentExports;
      }
    );
    module.hot.accept(
      /**
       * An error handler to allow self-recovering behaviours.
       * @param {Error} error An error occurred during evaluation of a module.
       * @returns {void}
       */
      function hotErrorHandler(error) {
        if (
          typeof __react_refresh_error_overlay__ !== 'undefined' &&
          __react_refresh_error_overlay__
        ) {
          __react_refresh_error_overlay__.handleRuntimeError(error);
        }

        if (typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__) {
          if (window.onHotAcceptError) {
            window.onHotAcceptError(error.message);
          }
        }

        __webpack_require__.c[module.id].hot.accept(hotErrorHandler);
      }
    );

    if (isHotUpdate) {
      if (
        __react_refresh_utils__.isReactRefreshBoundary(prevExports) &&
        __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)
      ) {
        module.hot.invalidate();
      } else {
        __react_refresh_utils__.enqueueUpdate(
          /**
           * A function to dismiss the error overlay after performing React refresh.
           * @returns {void}
           */
          function updateCallback() {
            if (
              typeof __react_refresh_error_overlay__ !== 'undefined' &&
              __react_refresh_error_overlay__
            ) {
              __react_refresh_error_overlay__.clearRuntimeErrors();
            }
          }
        );
      }
    }
  } else {
    if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
      module.hot.invalidate();
    }
  }
}

/***/ })

});
//# sourceMappingURL=xcloud-cli_tmp_vikit_example-fe_-Users-tainlx-Desktop-project_01-vikit-packages-example-fe-pa-102c01.187de8b6f4b41f16b2a8.hot-update.js.map