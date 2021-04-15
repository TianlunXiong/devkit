self["webpackHotUpdate_vikit_example_fe"]("xcloud-cli_tmp_vikit_example-fe_-Users-tainlx-Desktop-project_01-vikit-packages-example-fe-pa-102c01",{

/***/ "./pages/index/index.tsx":
/*!*******************************!*\
  !*** ./pages/index/index.tsx ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var _components_xstyle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/xstyle */ "./pages/components/xstyle/index.tsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "../../node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ../../node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "../../node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ../../node_modules/react-refresh/runtime.js */ "../../node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.id);




function Index() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, "Hello", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_xstyle__WEBPACK_IMPORTED_MODULE_1__.Box, {
    color: "pink",
    bg: "blue",
    textAlign: "center",
    fontSize: "36px",
    p: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "pink",
    borderWidth: "2px"
  }, "World"));
}

_c = Index;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Index);

var _c;

__webpack_require__.$Refresh$.register(_c, "Index");

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
//# sourceMappingURL=xcloud-cli_tmp_vikit_example-fe_-Users-tainlx-Desktop-project_01-vikit-packages-example-fe-pa-102c01.e02578cf1a93507fabc5.hot-update.js.map