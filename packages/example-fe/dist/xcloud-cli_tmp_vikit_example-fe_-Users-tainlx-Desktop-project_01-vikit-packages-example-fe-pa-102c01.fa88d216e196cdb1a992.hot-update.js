self["webpackHotUpdate_vikit_example_fe"]("xcloud-cli_tmp_vikit_example-fe_-Users-tainlx-Desktop-project_01-vikit-packages-example-fe-pa-102c01",{

/***/ "../xstyle/src/box/index.tsx":
/*!***********************************!*\
  !*** ../xstyle/src/box/index.tsx ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! styled-components */ "../../node_modules/styled-components/dist/styled-components.browser.esm.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../color'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../space */ "../xstyle/src/space/index.tsx");
/* harmony import */ var _typography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../typography */ "../xstyle/src/typography/index.tsx");
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layout */ "../xstyle/src/layout/index.tsx");
/* harmony import */ var _flexbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../flexbox */ "../xstyle/src/flexbox/index.tsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../../node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../node_modules/react-refresh/runtime.js */ "../../node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);







const Box = (0,styled_components__WEBPACK_IMPORTED_MODULE_5__.default)('div')`
   ${Object(function webpackMissingModule() { var e = new Error("Cannot find module '../color'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())}
   ${_space__WEBPACK_IMPORTED_MODULE_1__.default}
   ${_typography__WEBPACK_IMPORTED_MODULE_2__.default}
   ${_layout__WEBPACK_IMPORTED_MODULE_3__.default}
   ${_flexbox__WEBPACK_IMPORTED_MODULE_4__.default}
`;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Box);

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
//# sourceMappingURL=xcloud-cli_tmp_vikit_example-fe_-Users-tainlx-Desktop-project_01-vikit-packages-example-fe-pa-102c01.fa88d216e196cdb1a992.hot-update.js.map