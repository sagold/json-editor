"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[1562],{"./packages/rje-widgets/src/lib/components/timeinput/TimeInput.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{FormatDate:()=>FormatDate,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _TimeInput__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/rje-widgets/src/lib/components/timeinput/TimeInput.tsx"),_ThemeDecorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"packages/rje-widgets/components/TimeInput",component:_TimeInput__WEBPACK_IMPORTED_MODULE_0__.M,decorators:[_ThemeDecorator__WEBPACK_IMPORTED_MODULE_1__.F],argTypes:{},args:{title:"Time input"}},FormatDate={args:{title:"Time",defaultValue:"11:12:54.123",onChange:date=>{console.log("on change",`${date.toDate()}`)}}},__namedExportsOrder=["FormatDate"];FormatDate.parameters={...FormatDate.parameters,docs:{...FormatDate.parameters?.docs,source:{originalSource:"{\n  args: {\n    title: 'Time',\n    defaultValue: '11:12:54.123',\n    // granularity: 'hour',\n    onChange: date => {\n      console.log('on change', `${date.toDate()}`);\n    }\n  }\n}",...FormatDate.parameters?.docs?.source}}}},"./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>ThemeDecorator});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/theme.ts");const ThemeDecorator=Story=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"rje-theme-decorator rje-form rje-theme",style:_theme__WEBPACK_IMPORTED_MODULE_1__.Z,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"rje-theme--light",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Story,{})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"rje-theme--dark",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Story,{})})})]})}}]);