"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[9898],{"./packages/rje-widgets/src/lib/widgets/navigationwidget/NavigationWidget.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,ShowProperties:()=>ShowProperties,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_index__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/index.tsx"),_NavigationWidget__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/navigationwidget/NavigationWidget.tsx"),_components_theme_Theme__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/rje-widgets/src/lib/components/theme/Theme.tsx");const schema={type:"object",properties:{title:{title:"Title",type:"string"},contents:{title:"Contents",type:"array",options:{sortable:{enabled:!0}},items:{title:"content item",type:"string"}},details:{title:"Details",type:"object",properties:{editor:{type:"string"}}}}},data={title:"content title",contents:["1","four"],details:{editor:"asdasd"}},__WEBPACK_DEFAULT_EXPORT__={title:"packages/rje-widgets/NavigationWidget",component:_NavigationWidget__WEBPACK_IMPORTED_MODULE_3__.J,argTypes:{data:{control:{type:"object"},defaultValue:data},schema:{control:{type:"object"},defaultValue:schema}}},Template=({data,schema,options})=>{console.log("COMP",options);const[node,editor]=(0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_1__.jE)({schema,widgets:_index__WEBPACK_IMPORTED_MODULE_2__.D,plugins:[_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_1__.AY],data,validate:!0});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_theme_Theme__WEBPACK_IMPORTED_MODULE_4__.Q,{style:{width:"400px"},children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_NavigationWidget__WEBPACK_IMPORTED_MODULE_3__.J,{node,editor,options})})},Default=Template.bind({data,schema}),ShowProperties=Template.bind({});ShowProperties.args={options:{showProperties:!0}};const __namedExportsOrder=["Default","ShowProperties"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"Template.bind({\n  data,\n  schema\n})",...Default.parameters?.docs?.source}}},ShowProperties.parameters={...ShowProperties.parameters,docs:{...ShowProperties.parameters?.docs,source:{originalSource:"({\n  data,\n  schema,\n  options\n}) => {\n  console.log('COMP', options);\n  const [node, editor] = useEditor<ParentNode>({\n    schema,\n    widgets,\n    plugins: [RemoteEnumOptionsPlugin],\n    data,\n    validate: true\n  });\n  return <Theme style={{\n    width: '400px'\n  }}>\n      <NavigationWidget node={node} editor={editor} options={options} />\n    </Theme>;\n}",...ShowProperties.parameters?.docs?.source}}}}}]);