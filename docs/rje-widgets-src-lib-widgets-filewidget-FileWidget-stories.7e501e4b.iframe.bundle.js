"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[5274],{"./packages/rje-widgets/src/lib/widgets/filewidget/FileWidget.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DownloadUrl:()=>DownloadUrl,ImagePreviewUrl:()=>ImagePreviewUrl,SingleFileEmpty:()=>SingleFileEmpty,SingleFileFilename:()=>SingleFileFilename,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _SingleFileFilename$p,_SingleFileFilename$p2,_SingleFileEmpty$para,_SingleFileEmpty$para2,_ImagePreviewUrl$para,_ImagePreviewUrl$para2,_DownloadUrl$paramete,_DownloadUrl$paramete2,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_index__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/index.tsx"),_FileWidget__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/filewidget/FileWidget.tsx"),_components_theme_Theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/rje-widgets/src/lib/components/theme/Theme.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}const __WEBPACK_DEFAULT_EXPORT__={title:"packages/rje-widgets/FileWidget",component:_FileWidget__WEBPACK_IMPORTED_MODULE_2__.l,argTypes:{data:{control:{type:"object"}},schema:{control:{type:"object"}}}};var Template=function Template(_ref){var data=_ref.data,schema=_ref.schema,_useJsonEditor2=_slicedToArray((0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__.mO)({schema,widgets:_index__WEBPACK_IMPORTED_MODULE_1__.D,plugins:[_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__.AY],data,validate:!0}),2),node=_useJsonEditor2[0],editor=_useJsonEditor2[1],fileNode=(0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__.U2)(node,"/file");return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_theme_Theme__WEBPACK_IMPORTED_MODULE_3__.Q,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_FileWidget__WEBPACK_IMPORTED_MODULE_2__.l,{node:fileNode,editor})})};Template.displayName="Template";var SingleFileFilename=Template.bind({});SingleFileFilename.args={data:{file:"given filename"},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{},minLength:1}}}};var SingleFileEmpty=Template.bind({});SingleFileEmpty.args={data:{file:""},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{}}}}};var ImagePreviewUrl=Template.bind({});ImagePreviewUrl.args={data:{file:"photo-1666410025931-96796794c5e2"},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{imageUrlTemplate:"https://images.unsplash.com/{{value}}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"}}}}};var DownloadUrl=Template.bind({});DownloadUrl.args={data:{file:"photo-1666410025931-96796794c5e2"},schema:{type:"object",properties:{file:{title:"File",type:["string","object"],format:"file",options:{downloadUrlTemplate:"https://images.unsplash.com/{{value}}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"}}}}},SingleFileFilename.parameters=_objectSpread(_objectSpread({},SingleFileFilename.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_SingleFileFilename$p=SingleFileFilename.parameters)||void 0===_SingleFileFilename$p?void 0:_SingleFileFilename$p.docs),{},{source:_objectSpread({originalSource:"({\n  data,\n  schema\n}) => {\n  const [node, editor] = useJsonEditor({\n    schema,\n    widgets,\n    plugins: [RemoteEnumOptionsPlugin],\n    data,\n    validate: true\n  });\n  const fileNode = (get(node, '/file') as StringNode);\n  return <Theme>\n            <FileWidget node={fileNode} editor={editor} />\n        </Theme>;\n}"},null===(_SingleFileFilename$p2=SingleFileFilename.parameters)||void 0===_SingleFileFilename$p2||null===(_SingleFileFilename$p2=_SingleFileFilename$p2.docs)||void 0===_SingleFileFilename$p2?void 0:_SingleFileFilename$p2.source)})}),SingleFileEmpty.parameters=_objectSpread(_objectSpread({},SingleFileEmpty.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_SingleFileEmpty$para=SingleFileEmpty.parameters)||void 0===_SingleFileEmpty$para?void 0:_SingleFileEmpty$para.docs),{},{source:_objectSpread({originalSource:"({\n  data,\n  schema\n}) => {\n  const [node, editor] = useJsonEditor({\n    schema,\n    widgets,\n    plugins: [RemoteEnumOptionsPlugin],\n    data,\n    validate: true\n  });\n  const fileNode = (get(node, '/file') as StringNode);\n  return <Theme>\n            <FileWidget node={fileNode} editor={editor} />\n        </Theme>;\n}"},null===(_SingleFileEmpty$para2=SingleFileEmpty.parameters)||void 0===_SingleFileEmpty$para2||null===(_SingleFileEmpty$para2=_SingleFileEmpty$para2.docs)||void 0===_SingleFileEmpty$para2?void 0:_SingleFileEmpty$para2.source)})}),ImagePreviewUrl.parameters=_objectSpread(_objectSpread({},ImagePreviewUrl.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ImagePreviewUrl$para=ImagePreviewUrl.parameters)||void 0===_ImagePreviewUrl$para?void 0:_ImagePreviewUrl$para.docs),{},{source:_objectSpread({originalSource:"({\n  data,\n  schema\n}) => {\n  const [node, editor] = useJsonEditor({\n    schema,\n    widgets,\n    plugins: [RemoteEnumOptionsPlugin],\n    data,\n    validate: true\n  });\n  const fileNode = (get(node, '/file') as StringNode);\n  return <Theme>\n            <FileWidget node={fileNode} editor={editor} />\n        </Theme>;\n}"},null===(_ImagePreviewUrl$para2=ImagePreviewUrl.parameters)||void 0===_ImagePreviewUrl$para2||null===(_ImagePreviewUrl$para2=_ImagePreviewUrl$para2.docs)||void 0===_ImagePreviewUrl$para2?void 0:_ImagePreviewUrl$para2.source)})}),DownloadUrl.parameters=_objectSpread(_objectSpread({},DownloadUrl.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_DownloadUrl$paramete=DownloadUrl.parameters)||void 0===_DownloadUrl$paramete?void 0:_DownloadUrl$paramete.docs),{},{source:_objectSpread({originalSource:"({\n  data,\n  schema\n}) => {\n  const [node, editor] = useJsonEditor({\n    schema,\n    widgets,\n    plugins: [RemoteEnumOptionsPlugin],\n    data,\n    validate: true\n  });\n  const fileNode = (get(node, '/file') as StringNode);\n  return <Theme>\n            <FileWidget node={fileNode} editor={editor} />\n        </Theme>;\n}"},null===(_DownloadUrl$paramete2=DownloadUrl.parameters)||void 0===_DownloadUrl$paramete2||null===(_DownloadUrl$paramete2=_DownloadUrl$paramete2.docs)||void 0===_DownloadUrl$paramete2?void 0:_DownloadUrl$paramete2.source)})});var __namedExportsOrder=["SingleFileFilename","SingleFileEmpty","ImagePreviewUrl","DownloadUrl"]}}]);