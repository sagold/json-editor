"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[4275],{"./packages/rje-widgets/src/lib/theme.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={"--rje-font-family":"Inter, sans-serif","--rje-color-light-primary":"31, 101, 141","--rje-color-light-secondary":"9, 66, 98","--rje-color-light-text":"7, 23, 32","--rje-color-dark-primary":"50, 133, 180","--rje-color-dark-secondary":"145, 192, 218","--rje-color-dark-text":"235, 240, 241"}},"./packages/rje-widgets/src/lib/components/switch/Swtich.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Disabled:()=>Disabled,WithError:()=>WithError,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _Switch__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/rje-widgets/src/lib/components/switch/Switch.tsx"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/theme.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}var _excluded=["children"];function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}const __WEBPACK_DEFAULT_EXPORT__={component:_Switch__WEBPACK_IMPORTED_MODULE_0__.r,title:"packages/rje-widgets/components/Switch"};var Template=function Template(_ref){_ref.children;var options=_objectWithoutProperties(_ref,_excluded);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{className:"theme",style:_theme__WEBPACK_IMPORTED_MODULE_1__.Z,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"rje-theme--light",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{className:"story-columns",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{defaultSelected:!1})),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{defaultSelected:!0})),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{children:"todo"}))]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"rje-theme--dark",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{className:"story-columns",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{defaultSelected:!1})),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{defaultSelected:!0})),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{children:"todo"}))]})})]})};Template.displayName="Template";var Default=Template.bind({});Default.args={"aria-label":"todo"};var Disabled=Template.bind({});Disabled.args={"aria-label":"todo",disabled:!0,error:!1};var WithError=Template.bind({});WithError.args={"aria-label":"todo",error:!0};var __namedExportsOrder=["Default","Disabled","WithError"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var children = _ref.children,\n    options = _objectWithoutProperties(_ref, _excluded);\n  return /*#__PURE__*/_jsxs("div", {\n    className: "theme",\n    style: theme,\n    children: [/*#__PURE__*/_jsx("div", {\n      className: "rje-theme--light",\n      children: /*#__PURE__*/_jsxs("div", {\n        className: "story-columns",\n        children: [/*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: false\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: true\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          children: "todo"\n        }))]\n      })\n    }), /*#__PURE__*/_jsx("div", {\n      className: "rje-theme--dark",\n      children: /*#__PURE__*/_jsxs("div", {\n        className: "story-columns",\n        children: [/*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: false\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: true\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          children: "todo"\n        }))]\n      })\n    })]\n  });\n}',...Default.parameters?.docs?.source}}},Disabled.parameters={...Disabled.parameters,docs:{...Disabled.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var children = _ref.children,\n    options = _objectWithoutProperties(_ref, _excluded);\n  return /*#__PURE__*/_jsxs("div", {\n    className: "theme",\n    style: theme,\n    children: [/*#__PURE__*/_jsx("div", {\n      className: "rje-theme--light",\n      children: /*#__PURE__*/_jsxs("div", {\n        className: "story-columns",\n        children: [/*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: false\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: true\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          children: "todo"\n        }))]\n      })\n    }), /*#__PURE__*/_jsx("div", {\n      className: "rje-theme--dark",\n      children: /*#__PURE__*/_jsxs("div", {\n        className: "story-columns",\n        children: [/*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: false\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: true\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          children: "todo"\n        }))]\n      })\n    })]\n  });\n}',...Disabled.parameters?.docs?.source}}},WithError.parameters={...WithError.parameters,docs:{...WithError.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var children = _ref.children,\n    options = _objectWithoutProperties(_ref, _excluded);\n  return /*#__PURE__*/_jsxs("div", {\n    className: "theme",\n    style: theme,\n    children: [/*#__PURE__*/_jsx("div", {\n      className: "rje-theme--light",\n      children: /*#__PURE__*/_jsxs("div", {\n        className: "story-columns",\n        children: [/*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: false\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: true\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          children: "todo"\n        }))]\n      })\n    }), /*#__PURE__*/_jsx("div", {\n      className: "rje-theme--dark",\n      children: /*#__PURE__*/_jsxs("div", {\n        className: "story-columns",\n        children: [/*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: false\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          defaultSelected: true\n        })), /*#__PURE__*/_jsx(Switch, _objectSpread(_objectSpread({}, options), {}, {\n          children: "todo"\n        }))]\n      })\n    })]\n  });\n}',...WithError.parameters?.docs?.source}}}}}]);