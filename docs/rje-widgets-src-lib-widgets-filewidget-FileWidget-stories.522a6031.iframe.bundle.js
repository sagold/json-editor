"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[5274],{"./packages/rje-widgets/src/lib/widgets/filewidget/FileWidget.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DownloadUrl:()=>DownloadUrl,ImagePreviewUrl:()=>ImagePreviewUrl,SingleFileEmpty:()=>SingleFileEmpty,SingleFileFilename:()=>SingleFileFilename,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_index__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/index.tsx"),_FileWidget__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/filewidget/FileWidget.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}const __WEBPACK_DEFAULT_EXPORT__={title:"packages/rje-widgets/FileWidget",component:_FileWidget__WEBPACK_IMPORTED_MODULE_2__.l,argTypes:{data:{control:{type:"object"}},schema:{control:{type:"object"}}}};var Template=function Template(_ref){var data=_ref.data,schema=_ref.schema,_useJsonEditor2=_slicedToArray((0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__.mO)({schema,widgets:_index__WEBPACK_IMPORTED_MODULE_1__.D,plugins:[_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__.AY],data,validate:!0}),2),node=_useJsonEditor2[0],editor=_useJsonEditor2[1],fileNode=(0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__.U2)(node,"/file");return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div",{className:"rje-form",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_FileWidget__WEBPACK_IMPORTED_MODULE_2__.l,{node:fileNode,editor})})};Template.displayName="Template";var SingleFileFilename=Template.bind({});SingleFileFilename.args={data:{file:"given filename"},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{},minLength:1}}}};var SingleFileEmpty=Template.bind({});SingleFileEmpty.args={data:{file:""},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{}}}}};var ImagePreviewUrl=Template.bind({});ImagePreviewUrl.args={data:{file:"photo-1666410025931-96796794c5e2"},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{imageUrlTemplate:"https://images.unsplash.com/{{value}}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"}}}}};var DownloadUrl=Template.bind({});DownloadUrl.args={data:{file:"photo-1666410025931-96796794c5e2"},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{downloadUrlTemplate:"https://images.unsplash.com/{{value}}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"}}}}};var __namedExportsOrder=["SingleFileFilename","SingleFileEmpty","ImagePreviewUrl","DownloadUrl"];SingleFileFilename.parameters={...SingleFileFilename.parameters,docs:{...SingleFileFilename.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      plugins: [RemoteEnumOptionsPlugin],\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  var fileNode = get(node, \'/file\');\n  return /*#__PURE__*/_jsx("div", {\n    className: "rje-form",\n    children: /*#__PURE__*/_jsx(FileWidget, {\n      node: fileNode,\n      editor: editor\n    })\n  });\n}',...SingleFileFilename.parameters?.docs?.source}}},SingleFileEmpty.parameters={...SingleFileEmpty.parameters,docs:{...SingleFileEmpty.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      plugins: [RemoteEnumOptionsPlugin],\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  var fileNode = get(node, \'/file\');\n  return /*#__PURE__*/_jsx("div", {\n    className: "rje-form",\n    children: /*#__PURE__*/_jsx(FileWidget, {\n      node: fileNode,\n      editor: editor\n    })\n  });\n}',...SingleFileEmpty.parameters?.docs?.source}}},ImagePreviewUrl.parameters={...ImagePreviewUrl.parameters,docs:{...ImagePreviewUrl.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      plugins: [RemoteEnumOptionsPlugin],\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  var fileNode = get(node, \'/file\');\n  return /*#__PURE__*/_jsx("div", {\n    className: "rje-form",\n    children: /*#__PURE__*/_jsx(FileWidget, {\n      node: fileNode,\n      editor: editor\n    })\n  });\n}',...ImagePreviewUrl.parameters?.docs?.source}}},DownloadUrl.parameters={...DownloadUrl.parameters,docs:{...DownloadUrl.parameters?.docs,source:{originalSource:'function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      plugins: [RemoteEnumOptionsPlugin],\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  var fileNode = get(node, \'/file\');\n  return /*#__PURE__*/_jsx("div", {\n    className: "rje-form",\n    children: /*#__PURE__*/_jsx(FileWidget, {\n      node: fileNode,\n      editor: editor\n    })\n  });\n}',...DownloadUrl.parameters?.docs?.source}}}}}]);