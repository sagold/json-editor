"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[2825],{"./packages/rje-widgets/src/lib/widgets/unknownwidget/UnknownWidget.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_index__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/index.tsx"),_UnknownWidget__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/unknownwidget/UnknownWidget.tsx"),_components_theme_Theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/rje-widgets/src/lib/components/theme/Theme.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_excluded=["data","schema"];function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}const __WEBPACK_DEFAULT_EXPORT__={title:"packages/rje-widgets/UnknownWidget",argTypes:{data:{control:{type:"boolean"}},type:{options:["toggle","checkbox"],control:{type:"select"}},disabled:{control:{type:"boolean"}},readOnly:{control:{type:"boolean"}},required:{control:{type:"boolean"}}}};var Template=function Template(_ref){var data=_ref.data,schema=_ref.schema,options=_objectWithoutProperties(_ref,_excluded),_useJsonEditor2=_slicedToArray((0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_0__.mO)({schema,widgets:_index__WEBPACK_IMPORTED_MODULE_1__.D,data,validate:!0}),2),node=_useJsonEditor2[0],editor=_useJsonEditor2[1];return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_theme_Theme__WEBPACK_IMPORTED_MODULE_3__.Q,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_UnknownWidget__WEBPACK_IMPORTED_MODULE_2__.s,{node,editor,options})})};Template.displayName="Template";var Default=Template.bind({});Default.args={type:"toggle",data:!1,schema:{}};var __namedExportsOrder=["Default"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema,\n    options = _objectWithoutProperties(_ref, _excluded);\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  return /*#__PURE__*/_jsx(Theme, {\n    children: /*#__PURE__*/_jsx(UnknownWidget, {\n      node: node,\n      editor: editor,\n      options: options\n    })\n  });\n}",...Default.parameters?.docs?.source}}}}}]);