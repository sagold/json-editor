"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[4275],{"./packages/rje-widgets/src/lib/components/switch/Swtich.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Disabled:()=>Disabled,WithError:()=>WithError,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _Default$parameters,_Default$parameters2,_Disabled$parameters,_Disabled$parameters2,_WithError$parameters,_WithError$parameters2,_Switch__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/rje-widgets/src/lib/components/switch/Switch.tsx"),_ThemeDecorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}var _excluded=["children"];function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}const __WEBPACK_DEFAULT_EXPORT__={decorators:[_ThemeDecorator__WEBPACK_IMPORTED_MODULE_1__.F],component:_Switch__WEBPACK_IMPORTED_MODULE_0__.r,title:"packages/rje-widgets/components/Switch"};var Template=function Template(_ref){_ref.children;var options=_objectWithoutProperties(_ref,_excluded);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{defaultSelected:!1})),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{defaultSelected:!0})),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Switch__WEBPACK_IMPORTED_MODULE_0__.r,_objectSpread(_objectSpread({},options),{},{children:"todo"}))]})},Default=Template.bind({});Default.args={"aria-label":"todo"};var Disabled=Template.bind({});Disabled.args={"aria-label":"todo",disabled:!0,error:!1};var WithError=Template.bind({});WithError.args={"aria-label":"todo",error:!0},Default.parameters=_objectSpread(_objectSpread({},Default.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Default$parameters=Default.parameters)||void 0===_Default$parameters?void 0:_Default$parameters.docs),{},{source:_objectSpread({originalSource:"({\n  children,\n  ...options\n}) => {\n  return <>\n            <Switch {...options} defaultSelected={false} />\n            <Switch {...options} defaultSelected={true} />\n            <Switch {...options}>todo</Switch>\n        </>;\n}"},null===(_Default$parameters2=Default.parameters)||void 0===_Default$parameters2||null===(_Default$parameters2=_Default$parameters2.docs)||void 0===_Default$parameters2?void 0:_Default$parameters2.source)})}),Disabled.parameters=_objectSpread(_objectSpread({},Disabled.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Disabled$parameters=Disabled.parameters)||void 0===_Disabled$parameters?void 0:_Disabled$parameters.docs),{},{source:_objectSpread({originalSource:"({\n  children,\n  ...options\n}) => {\n  return <>\n            <Switch {...options} defaultSelected={false} />\n            <Switch {...options} defaultSelected={true} />\n            <Switch {...options}>todo</Switch>\n        </>;\n}"},null===(_Disabled$parameters2=Disabled.parameters)||void 0===_Disabled$parameters2||null===(_Disabled$parameters2=_Disabled$parameters2.docs)||void 0===_Disabled$parameters2?void 0:_Disabled$parameters2.source)})}),WithError.parameters=_objectSpread(_objectSpread({},WithError.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_WithError$parameters=WithError.parameters)||void 0===_WithError$parameters?void 0:_WithError$parameters.docs),{},{source:_objectSpread({originalSource:"({\n  children,\n  ...options\n}) => {\n  return <>\n            <Switch {...options} defaultSelected={false} />\n            <Switch {...options} defaultSelected={true} />\n            <Switch {...options}>todo</Switch>\n        </>;\n}"},null===(_WithError$parameters2=WithError.parameters)||void 0===_WithError$parameters2||null===(_WithError$parameters2=_WithError$parameters2.docs)||void 0===_WithError$parameters2?void 0:_WithError$parameters2.source)})});var __namedExportsOrder=["Default","Disabled","WithError"]},"./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>ThemeDecorator});var _theme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/rje-widgets/src/lib/theme.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js"),ThemeDecorator=function ThemeDecorator(Story){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div",{className:"rje-form rje-theme",style:_theme__WEBPACK_IMPORTED_MODULE_0__.Z,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{className:"rje-theme--light",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Story,{})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{className:"rje-theme--dark",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Story,{})})})]})};ThemeDecorator.displayName="ThemeDecorator"}}]);