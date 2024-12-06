"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[9806],{"./packages/rje-widgets/src/lib/components/input/StringInput.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Error:()=>Error,Placeholder:()=>Placeholder,ReadOnly:()=>ReadOnly,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_StringInput__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/components/input/StringInput.tsx");const __WEBPACK_DEFAULT_EXPORT__={decorators:[__webpack_require__("./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx").F],component:_StringInput__WEBPACK_IMPORTED_MODULE_1__.w,title:"packages/rje-widgets/components/StringInput",argTypes:{type:{control:{type:"select"},options:["text","password"]}}},Template=({...options})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_StringInput__WEBPACK_IMPORTED_MODULE_1__.w,{...options}),Default=Template.bind({});Default.args={emitOnChange:!1,disabled:!1,iconPosition:"left",defaultValue:"Firefox",icon:"search",tag:"Unit",title:"Input as String",onPress:value=>console.log("value",value)};const Placeholder=Template.bind({});Placeholder.args={emitOnChange:!1,disabled:!1,iconPosition:"left",placeholder:"Placeholder",icon:"search",tag:"Unit",title:"A required input",required:!0,onPress:value=>console.log("value",value)};const ReadOnly=Template.bind({});ReadOnly.args={emitOnChange:!1,disabled:!1,readOnly:!0,iconPosition:"left",defaultValue:"Firefox",icon:"search",tag:"Unit",title:"Input as String",onPress:value=>console.log("value",value)};const Error=Template.bind({});Error.args={emitOnChange:!1,disabled:!1,iconPosition:"left",error:!0,defaultValue:"Firefox",icon:"search",tag:"Unit",title:"Input with Error",onPress:value=>console.log("value",value)};const __namedExportsOrder=["Default","Placeholder","ReadOnly","Error"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"({\n  ...options\n}) => {\n  return <StringInput {...options} />;\n}",...Default.parameters?.docs?.source}}},Placeholder.parameters={...Placeholder.parameters,docs:{...Placeholder.parameters?.docs,source:{originalSource:"({\n  ...options\n}) => {\n  return <StringInput {...options} />;\n}",...Placeholder.parameters?.docs?.source}}},ReadOnly.parameters={...ReadOnly.parameters,docs:{...ReadOnly.parameters?.docs,source:{originalSource:"({\n  ...options\n}) => {\n  return <StringInput {...options} />;\n}",...ReadOnly.parameters?.docs?.source}}},Error.parameters={...Error.parameters,docs:{...Error.parameters?.docs,source:{originalSource:"({\n  ...options\n}) => {\n  return <StringInput {...options} />;\n}",...Error.parameters?.docs?.source}}}},"./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>ThemeDecorator});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/theme.ts");const ThemeDecorator=Story=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"rje-theme-decorator rje-form rje-theme",style:_theme__WEBPACK_IMPORTED_MODULE_1__.Z,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"rje-theme--light",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Story,{})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"rje-theme--dark",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Story,{})})})]})}}]);