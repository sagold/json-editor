"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[1986],{"./packages/rje-widgets/src/lib/widgets/taglistwidget/TagListWidget.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_components_ThemeDecorator__WEBPACK_IMPORTED_MODULE_2__=(__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx")),_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_TagListWidget__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/taglistwidget/TagListWidget.tsx"),_index__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/index.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"packages/rje-widgets/TagListWidget",decorators:[_components_ThemeDecorator__WEBPACK_IMPORTED_MODULE_2__.F],component:function TagListWidgetStory({data,schema,...options}){const[node,editor]=(0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_3__.jE)({schema,widgets:_index__WEBPACK_IMPORTED_MODULE_5__.D,data,validate:!0,onChange(data){console.log("editor value",data)}});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_TagListWidget__WEBPACK_IMPORTED_MODULE_4__.K,{node,editor,options})},argTypes:{}},Default={args:{data:["Gray alder"],schema:{title:"Multi-selection demo",type:"array",format:"taglist",options:{values:[{value:"Gray alder",label:"[label] Gray alder"},{value:"Tall ambrosia",label:"[label] Tall ambrosia"},{value:"Arrowwood",label:"[label] Arrowwood"},{value:"Baobab",label:"[label] Baobab"},{value:"Wild cherry",label:"[label] Wild cherry"},{value:"Columbine",label:"[label] Columbine"},{value:"Dogwood",label:"[label] Dogwood"},{value:"Foxglove",label:"[label] Foxglove"},{value:"Kittentail",label:"[label] Kittentail'"}]},items:{type:"string"}}}},__namedExportsOrder=["Default"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {\n    data: ['Gray alder'],\n    schema: {\n      title: 'Multi-selection demo',\n      type: 'array',\n      format: 'taglist',\n      options: {\n        values: [{\n          value: 'Gray alder',\n          label: '[label] Gray alder'\n        }, {\n          value: 'Tall ambrosia',\n          label: '[label] Tall ambrosia'\n        }, {\n          value: 'Arrowwood',\n          label: '[label] Arrowwood'\n        }, {\n          value: 'Baobab',\n          label: '[label] Baobab'\n        }, {\n          value: 'Wild cherry',\n          label: '[label] Wild cherry'\n        }, {\n          value: 'Columbine',\n          label: '[label] Columbine'\n        }, {\n          value: 'Dogwood',\n          label: '[label] Dogwood'\n        }, {\n          value: 'Foxglove',\n          label: '[label] Foxglove'\n        }, {\n          value: 'Kittentail',\n          label: \"[label] Kittentail'\"\n        }]\n      },\n      items: {\n        type: 'string'\n      }\n    }\n  }\n}",...Default.parameters?.docs?.source}}}},"./packages/rje-widgets/src/lib/components/ThemeDecorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{F:()=>ThemeDecorator});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_theme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/theme.ts");const ThemeDecorator=Story=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"rje-theme-decorator rje-form rje-theme",style:_theme__WEBPACK_IMPORTED_MODULE_1__.Z,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"rje-theme--light",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Story,{})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"rje-theme--dark",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"story-columns",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Story,{})})})]})}}]);