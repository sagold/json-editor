"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[1119],{"./packages/rje-widgets/src/lib/widgets/arraywidget/ArrayWidget.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Collapsible:()=>Collapsible,DefaultWidget:()=>DefaultWidget,DragAndDrop:()=>DragAndDrop,EditJsonOptions:()=>EditJsonOptions,ItemSelection:()=>ItemSelection,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _ArrayWidget__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/arraywidget/ArrayWidget.tsx"),_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_index__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/rje-widgets/src/lib/widgets/index.tsx"),_components_theme_Theme__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/rje-widgets/src/lib/components/theme/Theme.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}const __WEBPACK_DEFAULT_EXPORT__={title:"packages/rje-widgets/ArrayWidget",component:_ArrayWidget__WEBPACK_IMPORTED_MODULE_0__.L$,argTypes:{data:{control:{type:"object"}},schema:{control:{type:"object"}},options:{control:{type:"object"}}}};var Template=function Template(_ref){var data=_ref.data,schema=_ref.schema,_ref$options=_ref.options,options=void 0===_ref$options?{}:_ref$options,_useJsonEditor2=_slicedToArray((0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_1__.mO)({schema,widgets:_index__WEBPACK_IMPORTED_MODULE_2__.D,data,validate:!0}),2),node=_useJsonEditor2[0],editor=_useJsonEditor2[1];return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_theme_Theme__WEBPACK_IMPORTED_MODULE_3__.Q,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ArrayWidget__WEBPACK_IMPORTED_MODULE_0__.L$,{node,editor,options})})};Template.displayName="Template";var DefaultWidget=Template.bind({});DefaultWidget.args={data:[{title:"first value",value:1},{title:"wrong value type",value:"four"},{title:"large number",value:0x91a9daf0213},{title:"empty"}],schema:{title:"Array Example",description:"Description displayed as subheader. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Post enim Chrysippum eum non sane est disputatum. Scientiam pollicentur, quam non erat mirum sapientiae cupido patria esse cariorem. Satis est ad hoc responsum. Hoc est vim afferre, Torquate, sensibus, extorquere ex animis cognitiones verborum, quibus inbuti sumus. Quid ergo attinet gloriose loqui, nisi constanter loquare? Aliter enim nosmet ipsos nosse non possumus. Sin tantum modo ad indicia veteris memoriae cognoscenda, curiosorum. Duo Reges: constructio interrete. Quid enim mihi potest esse optatius quam cum Catone, omnium virtutum auctore, de virtutibus disputare? Quantum Aristoxeni ingenium consumptum videmus in musicis?",type:"array",items:{title:"content item",type:"object",options:{previewValue:"title"},properties:{title:{type:"string"},value:{type:"number",minimum:1}}}},options:{sortable:{enabled:!1},header:{inverted:!1,color:void 0},editJson:{enabled:!1,liveUpdate:!1},layout:{type:"default"}}};var ItemSelection=Template.bind({});ItemSelection.args={options:{collapsed:!1},schema:{title:"Array Item Selection Example",description:"Description displayed as subheader. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Post enim Chrysippum eum non sane est disputatum. Scientiam pollicentur, quam non erat mirum sapientiae cupido patria esse cariorem. Satis est ad hoc responsum. Hoc est vim afferre, Torquate, sensibus, extorquere ex animis cognitiones verborum, quibus inbuti sumus. Quid ergo attinet gloriose loqui, nisi constanter loquare? Aliter enim nosmet ipsos nosse non possumus. Sin tantum modo ad indicia veteris memoriae cognoscenda, curiosorum. Duo Reges: constructio interrete. Quid enim mihi potest esse optatius quam cum Catone, omnium virtutum auctore, de virtutibus disputare? Quantum Aristoxeni ingenium consumptum videmus in musicis?",type:"array",items:{oneOfProperty:"type",oneOf:[{title:"header",type:"object",required:["type","title"],properties:{type:{type:"string",const:"header",options:{hidden:!0}},title:{type:"string",title:"title",format:"textarea"}}},{title:"article",type:"object",required:["type","content"],properties:{type:{type:"string",const:"article",options:{hidden:!0}},content:{type:"string",title:"content",format:"textarea"}}}]}}};var DragAndDrop=Template.bind({});DragAndDrop.args=_objectSpread(_objectSpread({},DefaultWidget.args),{},{options:{sortable:{enabled:!0},editJson:{enabled:!0}}});var Collapsible=Template.bind({});Collapsible.args=_objectSpread(_objectSpread({},DefaultWidget.args),{},{options:{collapsed:!0}});var EditJsonOptions=Template.bind({});EditJsonOptions.args=_objectSpread(_objectSpread({},DefaultWidget.args),{},{options:{editJson:{enabled:!0,liveUpdate:!0}}});var __namedExportsOrder=["DefaultWidget","ItemSelection","DragAndDrop","Collapsible","EditJsonOptions"];DefaultWidget.parameters={...DefaultWidget.parameters,docs:{...DefaultWidget.parameters?.docs,source:{originalSource:"function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema,\n    _ref$options = _ref.options,\n    options = _ref$options === void 0 ? {} : _ref$options;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  return /*#__PURE__*/_jsx(Theme, {\n    children: /*#__PURE__*/_jsx(ArrayWidget, {\n      node: node,\n      editor: editor,\n      options: options\n    })\n  });\n}",...DefaultWidget.parameters?.docs?.source}}},ItemSelection.parameters={...ItemSelection.parameters,docs:{...ItemSelection.parameters?.docs,source:{originalSource:"function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema,\n    _ref$options = _ref.options,\n    options = _ref$options === void 0 ? {} : _ref$options;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  return /*#__PURE__*/_jsx(Theme, {\n    children: /*#__PURE__*/_jsx(ArrayWidget, {\n      node: node,\n      editor: editor,\n      options: options\n    })\n  });\n}",...ItemSelection.parameters?.docs?.source}}},DragAndDrop.parameters={...DragAndDrop.parameters,docs:{...DragAndDrop.parameters?.docs,source:{originalSource:"function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema,\n    _ref$options = _ref.options,\n    options = _ref$options === void 0 ? {} : _ref$options;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  return /*#__PURE__*/_jsx(Theme, {\n    children: /*#__PURE__*/_jsx(ArrayWidget, {\n      node: node,\n      editor: editor,\n      options: options\n    })\n  });\n}",...DragAndDrop.parameters?.docs?.source}}},Collapsible.parameters={...Collapsible.parameters,docs:{...Collapsible.parameters?.docs,source:{originalSource:"function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema,\n    _ref$options = _ref.options,\n    options = _ref$options === void 0 ? {} : _ref$options;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  return /*#__PURE__*/_jsx(Theme, {\n    children: /*#__PURE__*/_jsx(ArrayWidget, {\n      node: node,\n      editor: editor,\n      options: options\n    })\n  });\n}",...Collapsible.parameters?.docs?.source}}},EditJsonOptions.parameters={...EditJsonOptions.parameters,docs:{...EditJsonOptions.parameters?.docs,source:{originalSource:"function Template(_ref) {\n  var data = _ref.data,\n    schema = _ref.schema,\n    _ref$options = _ref.options,\n    options = _ref$options === void 0 ? {} : _ref$options;\n  var _useJsonEditor = useJsonEditor({\n      schema: schema,\n      widgets: widgets,\n      data: data,\n      validate: true\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  return /*#__PURE__*/_jsx(Theme, {\n    children: /*#__PURE__*/_jsx(ArrayWidget, {\n      node: node,\n      editor: editor,\n      options: options\n    })\n  });\n}",...EditJsonOptions.parameters?.docs?.source}}}}}]);