"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[963],{"./packages/docs/src/examples/UndoRedo.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UndoRedo:()=>UndoRedo,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/react-json-editor/src/index.ts"),headless_json_editor__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/headless-json-editor/src/index.ts"),_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/rje-widgets/src/index.ts"),_rje_widgets_src_lib_components_button_Button__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/rje-widgets/src/lib/components/button/Button.tsx"),_rje_widgets_src_lib_components_theme_Theme__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/rje-widgets/src/lib/components/theme/Theme.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var schema={type:"object",required:["title"],properties:{title:{title:"text",type:"string"},boolean:{title:"checkbox",type:"boolean"},list:{type:"array",options:{sortable:{enabled:!0}},items:{type:"string"}}}};const __WEBPACK_DEFAULT_EXPORT__={title:"Examples/UndoRedo"};var Template=function Template(){var _useJsonEditor2=_slicedToArray((0,_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_1__.mO)({data:{},schema,widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,plugins:[headless_json_editor__WEBPACK_IMPORTED_MODULE_2__.et]}),2),node=_useJsonEditor2[0],editor=_useJsonEditor2[1],historyPlugin=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(editor.plugin("history")),Widget=editor.getWidget(node),history=historyPlugin.current,isUndoEnabled=!!history&&history.getUndoCount()>0,isRedoEnabled=!!history&&history.getRedoCount()>0;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_rje_widgets_src_lib_components_theme_Theme__WEBPACK_IMPORTED_MODULE_5__.Q,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div",{style:{display:"flex",gap:8,paddingBottom:"1em"},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_rje_widgets_src_lib_components_button_Button__WEBPACK_IMPORTED_MODULE_4__.z,{icon:"undo",onPress:function onPress(){var _historyPlugin$curren;return null===(_historyPlugin$curren=historyPlugin.current)||void 0===_historyPlugin$curren?void 0:_historyPlugin$curren.undo()},disabled:!isUndoEnabled}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_rje_widgets_src_lib_components_button_Button__WEBPACK_IMPORTED_MODULE_4__.z,{icon:"redo",onPress:function onPress(){var _historyPlugin$curren2;return null===(_historyPlugin$curren2=historyPlugin.current)||void 0===_historyPlugin$curren2?void 0:_historyPlugin$curren2.redo()},disabled:!isRedoEnabled})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div",{className:"rje-form",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Widget,{node,editor})})]})};Template.displayName="Template";var UndoRedo=Template.bind({}),__namedExportsOrder=["UndoRedo"];UndoRedo.parameters={...UndoRedo.parameters,docs:{...UndoRedo.parameters?.docs,source:{originalSource:'function Template() {\n  var _useJsonEditor = useJsonEditor({\n      data: {},\n      schema: schema,\n      widgets: widgets,\n      plugins: [HistoryPlugin]\n    }),\n    _useJsonEditor2 = _slicedToArray(_useJsonEditor, 2),\n    node = _useJsonEditor2[0],\n    editor = _useJsonEditor2[1];\n  var historyPlugin = useRef(editor.plugin(\'history\'));\n  var Widget = editor.getWidget(node);\n  var history = historyPlugin.current;\n  var isUndoEnabled = history ? history.getUndoCount() > 0 : false;\n  var isRedoEnabled = history ? history.getRedoCount() > 0 : false;\n  return /*#__PURE__*/_jsxs(Theme, {\n    children: [/*#__PURE__*/_jsxs("div", {\n      style: {\n        display: \'flex\',\n        gap: 8,\n        paddingBottom: \'1em\'\n      },\n      children: [/*#__PURE__*/_jsx(Button, {\n        icon: "undo",\n        onPress: function onPress() {\n          var _historyPlugin$curren;\n          return (_historyPlugin$curren = historyPlugin.current) === null || _historyPlugin$curren === void 0 ? void 0 : _historyPlugin$curren.undo();\n        },\n        disabled: !isUndoEnabled\n      }), /*#__PURE__*/_jsx(Button, {\n        icon: "redo",\n        onPress: function onPress() {\n          var _historyPlugin$curren2;\n          return (_historyPlugin$curren2 = historyPlugin.current) === null || _historyPlugin$curren2 === void 0 ? void 0 : _historyPlugin$curren2.redo();\n        },\n        disabled: !isRedoEnabled\n      })]\n    }), /*#__PURE__*/_jsx("div", {\n      className: "rje-form",\n      children: /*#__PURE__*/_jsx(Widget, {\n        node: node,\n        editor: editor\n      })\n    })]\n  });\n}',...UndoRedo.parameters?.docs?.source}}}}}]);