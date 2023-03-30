"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[3841],{"./packages/rje-widgets/src/lib/theme.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={"--rje-font-family":"Inter, sans-serif","--rje-color-light-primary":"31, 101, 141","--rje-color-light-secondary":"9, 66, 98","--rje-color-light-text":"7, 23, 32","--rje-color-dark-primary":"50, 133, 180","--rje-color-dark-secondary":"145, 192, 218","--rje-color-dark-text":"235, 240, 241"}},"./packages/rje-widgets/src/lib/components/selectoptions/SingleSelectOptions.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _SelectOptions__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/rje-widgets/src/lib/components/selectoptions/SelectOptions.tsx"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/theme.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const __WEBPACK_DEFAULT_EXPORT__={component:_SelectOptions__WEBPACK_IMPORTED_MODULE_0__.YZ,title:"packages/rje-widgets/components/options/SingleSelectOptions",args:{label:{control:"text"}}};var Template=function Template(_ref){var options=_extends({},(function _objectDestructuringEmpty(obj){if(null==obj)throw new TypeError("Cannot destructure "+obj)}(_ref),_ref));return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{className:"rje-form theme",style:_theme__WEBPACK_IMPORTED_MODULE_1__.Z,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"rje-theme--light",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_SelectOptions__WEBPACK_IMPORTED_MODULE_0__.YZ,_objectSpread(_objectSpread({},options),{},{children:options.children.map((function(value){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_SelectOptions__WEBPACK_IMPORTED_MODULE_0__.ck,{children:value},value)}))}))})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"rje-theme--dark",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_SelectOptions__WEBPACK_IMPORTED_MODULE_0__.YZ,_objectSpread(_objectSpread({},options),{},{children:options.children.map((function(value){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_SelectOptions__WEBPACK_IMPORTED_MODULE_0__.ck,{children:value},value)}))}))})})]})};Template.displayName="Template";var Default=Template.bind({});Default.args={label:"",children:["apple","orange","kiwi","mango","raspberry"],onPress:function onPress(value){return console.log("value",value)}};var __namedExportsOrder=["Default"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var options = _extends({}, (_objectDestructuringEmpty(_ref), _ref));\n  return /*#__PURE__*/_jsxs("div", {\n    className: "rje-form theme",\n    style: theme,\n    children: [/*#__PURE__*/_jsx("div", {\n      className: "rje-theme--light",\n      children: /*#__PURE__*/_jsx("div", {\n        className: "story-columns",\n        children: /*#__PURE__*/_jsx(SingleSelectOptions, _objectSpread(_objectSpread({}, options), {}, {\n          children: options.children.map(function (value) {\n            return /*#__PURE__*/_jsx(Item, {\n              children: value\n            }, value);\n          })\n        }))\n      })\n    }), /*#__PURE__*/_jsx("div", {\n      className: "rje-theme--dark",\n      children: /*#__PURE__*/_jsx("div", {\n        className: "story-columns",\n        children: /*#__PURE__*/_jsx(SingleSelectOptions, _objectSpread(_objectSpread({}, options), {}, {\n          children: options.children.map(function (value) {\n            return /*#__PURE__*/_jsx(Item, {\n              children: value\n            }, value);\n          })\n        }))\n      })\n    })]\n  });\n}',...Default.parameters?.docs?.source}}}}}]);