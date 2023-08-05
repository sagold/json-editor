"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[1906,7244],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{NF:()=>withMDXComponents,Zo:()=>MDXProvider,ah:()=>useMDXComponents,pC:()=>MDXContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},children)}},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Xz:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.Xz,h_:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.h_});__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-S4VUQJ4A.mjs");var _storybook_blocks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs")},"./packages/docs/src/ArrayItems.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs"),_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__=(__webpack_require__("./packages/react-json-editor/src/index.ts"),__webpack_require__("./packages/rje-widgets/src/index.ts"),__webpack_require__("./packages/docs/src/ArrayItems.stories.tsx"));function _createMdxContent(props){const _components=Object.assign({h1:"h1",blockquote:"blockquote",p:"p",em:"em",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td",a:"a",strong:"strong",h2:"h2",code:"code",ul:"ul",li:"li"},(0,_storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_6__.ah)(),props.components);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.h_,{title:"ArrayItems"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h1,{id:"array-items",children:"Array Items"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.blockquote,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em,{children:"json-schema"})," has a set of definitions for array items. This section details how those definitions transfer to a user interface build with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em,{children:"@sagold/react-json-editor"})," and its default widgets."]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Validation of data is fully supported, the following list tracks support of the user interface:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.table,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.thead,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.th,{align:"center",children:"Status"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.th,{align:"left",children:"Feature"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.th,{align:"left",children:"Comments"})]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tbody,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#array-schema",children:"items array-schema"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"defined set of array items"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"❎"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#additional-items",children:"additionalItems"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"ui does not support adding arbitrary data"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#object-schema",children:"items object-schema"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"object schema for child-items"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#one-of",children:"items oneOf"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#length",children:"length"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.td,{align:"left",children:["support for ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong,{children:"minItems"})," and ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong,{children:"maxItems"})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#if-then-else",children:"if-then-else"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"❌"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"enum"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"only supported by validation not by user interface"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#not",children:"not"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"validation only, exlude specific item types"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#uniqueitems",children:"uniqueItems"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"validation only, exclude redundant items"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"center",children:"✅"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"#contains",children:"contains"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td,{align:"left",children:"validation only, ensure a specific item is present"})]})]})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"array-schema",children:"Array Schema"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Fixed number and schema of array items"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.ItemsArray}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"additional-items",children:"additional items"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["With items defined by an items-array, ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"additionalItems=undefined"})," or ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"additionalItems=true"})," will allow any additional child."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong,{children:"Note"}),", for a missing ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"additionalItems"})," setting, add-options are disabled"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.AdditionalItemsUndefined}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["With items defined by an items-array, ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"additionalItems=true"}),", the add option is available. Here, item is initialized with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"null"})," as no schema can be derived. Thus, no input element is renderer (null-widget) for adding items. Any input items are accepted."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong,{children:"Note"})," This feature will need support to define custom data, initially offering an json-editor"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.AdditionalItemsTrue}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Preventing additional items will disable add-options and remove any undefined item from user form and exported data. In the following example, the array is initialized with three values:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.AdditionalItemsFalse}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["With items defined by an items-array and ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"additionalItems"})," set to a valid json-schema, items may be added in the given format."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.AdditionalItemsSchema}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"object-schema",children:"Object Schema"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Array items can contain any supported json-schema:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.ItemsObject}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"one-of",children:"One Of"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["When using an items-object definition containing a ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"oneOf"})," statement, adding an item will show a selection dialog for each oneOf schema"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.OneOf}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"length",children:"Length"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["support for ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"minItems"})," and ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"maxItems"})," length restrictions:"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.Length}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"if-then-else",children:"if-then-else"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"example: if any number is above 1 the list is restricted to one item, else no item is allowed"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.IfThenElse}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"enum",children:"Enum"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li,{children:["⚠️ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong,{children:"TODO"})," enum selection"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li,{children:["⚠️ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong,{children:"TODO"})," fix initial data from getTemplate"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong,{children:"TODO"})," improve error message valid options display"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.Enum}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"not",children:"Not"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["Using a ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"not"})," schema, allows specific arrays to be invalidated, showing an error when ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"not"})," validates. The following example invalidates arrays that only consist of 123. If one of the array items differs from 123, the schema is valid again."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.Not}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"unique-items",children:"Unique items"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"uniqueItems"})," prevents duplication in array items"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.UniqueItems}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"contains",children:"Contains"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:["While the items schema must be valid for every item in the array, the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"contains"})," schema only needs to validate against one or more items in the array."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_2__.Xz,{className:"inline",of:_ArrayItems_stories__WEBPACK_IMPORTED_MODULE_5__.Contains})]})}const __WEBPACK_DEFAULT_EXPORT__=function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,_storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_6__.ah)(),props.components);return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout,Object.assign({},props,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent,props)})):_createMdxContent(props)}},"./packages/docs/src/ArrayItems.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{var _ItemsArray$parameter,_ItemsArray$parameter2,_AdditionalItemsUndef,_AdditionalItemsUndef2,_AdditionalItemsTrue$,_AdditionalItemsTrue$2,_AdditionalItemsFalse,_AdditionalItemsFalse2,_AdditionalItemsSchem,_AdditionalItemsSchem2,_ItemsObject$paramete,_ItemsObject$paramete2,_OneOf$parameters,_OneOf$parameters2,_Length$parameters,_Length$parameters2,_IfThenElse$parameter,_IfThenElse$parameter2,_Enum$parameters,_Enum$parameters2,_Not$parameters,_Not$parameters2,_UniqueItems$paramete,_UniqueItems$paramete2,_Contains$parameters,_Contains$parameters2;function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{AdditionalItemsFalse:()=>AdditionalItemsFalse,AdditionalItemsSchema:()=>AdditionalItemsSchema,AdditionalItemsTrue:()=>AdditionalItemsTrue,AdditionalItemsUndefined:()=>AdditionalItemsUndefined,Contains:()=>Contains,Enum:()=>Enum,IfThenElse:()=>IfThenElse,ItemsArray:()=>ItemsArray,ItemsObject:()=>ItemsObject,Length:()=>Length,Not:()=>Not,OneOf:()=>OneOf,UniqueItems:()=>UniqueItems,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={component:__webpack_require__("./packages/rje-widgets/src/index.ts").R_};var ItemsArray={args:{className:"rje-theme rje-theme--light",validate:!0,data:["a title","a subtitle"],schema:{title:"items: [schema, schema]",type:"array",items:[{title:"Title",type:"string"},{title:"Subtitle",type:"string"}]}}},AdditionalItemsUndefined={args:{className:"rje-theme rje-theme--light",validate:!0,data:["a title","a subtitle"],schema:{title:"additionalItems: undefined",type:"array",items:[{title:"Title",type:"string"},{title:"Subtitle",type:"string"}]}}},AdditionalItemsTrue={args:{className:"rje-theme rje-theme--light",validate:!0,data:["a title","a subtitle","an additional item"],schema:{title:"additionalItems: true",type:"array",additionalItems:!0,items:[{title:"Title",type:"string"},{title:"Subtitle",type:"string"}]}}},AdditionalItemsFalse={args:{className:"rje-theme rje-theme--light",validate:!0,data:["a title","a subtitle","an additional item"],schema:{title:"additionalItems: false",type:"array",additionalItems:!1,items:[{title:"Title",type:"string"},{title:"Subtitle",type:"string"}]}}},AdditionalItemsSchema={args:{className:"rje-theme rje-theme--light",validate:!0,data:["a title","a subtitle","an additional item"],schema:{title:'additionalItems: { type: "number" }',type:"array",additionalItems:{title:"Additional number",type:"number"},items:[{title:"Title",type:"string"},{title:"Subtitle",type:"string"}]}}},ItemsObject={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[2023],schema:{title:"items: { object }",type:"array",items:{type:"object",required:["alt","image"],title:"Content image",properties:{alt:{title:"Image alt text",type:"string"},image:{title:"Image",type:"string",format:"file"},width:{title:"Width in px",type:"number",default:400}}}}}},OneOf={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[{type:"header"}],schema:{title:"items: { oneOf: [ schema, schema ] }",type:"array",items:{oneOfProperty:"type",oneOf:[{id:"header",title:"header",type:"object",required:["type","text"],properties:{type:{type:"string",const:"header",options:{hidden:!0}},text:{title:"Header text",type:"string"}}},{id:"paragraph",title:"paragraph",type:"object",required:["type","text"],properties:{type:{type:"string",const:"paragraph",options:{hidden:!0}},text:{title:"Paragraph text",type:"string"}}}]},additionalItems:{title:"Width in px",type:"number",default:400}}}},Length={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[2023],schema:{title:"minItems: 1, maxItems: 2",type:"array",minItems:1,maxItems:2,items:{title:"item",type:"number",default:1}}}},IfThenElse={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[],schema:{title:"if: { items: { maximum: 1 } }",type:"array",items:{title:"Item",type:"number",default:2},minItems:1,if:{items:{maximum:1}},then:{maxItems:1},else:{maxItems:0}}}},Enum={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[],schema:{title:"enum: [[], []]",type:"array",enum:[[2019,10,22],[2023,1,1]],items:{type:"number"},minItems:3,maxItems:3,options:{title:!0}}}},Not={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[123],schema:{title:"not: { items: { const: 123 }}",description:"value 123 is not allowed as array item",type:"array",not:{type:"array",items:{const:123}},items:{title:"item",type:"number",default:12}}}},UniqueItems={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[1,2,2],schema:{title:"uniqueItems: true",type:"array",uniqueItems:!0,items:{title:"item",type:"number",default:1}}}},Contains={args:{className:"rje-theme rje-theme--light",validate:!0,addOptionalProps:!1,data:[2,3],schema:{title:"contains: { const: 1 }",type:"array",items:{title:"item",type:"number",default:1},contains:{type:"number",const:1}}}};ItemsArray.parameters=_objectSpread(_objectSpread({},ItemsArray.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ItemsArray$parameter=ItemsArray.parameters)||void 0===_ItemsArray$parameter?void 0:_ItemsArray$parameter.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    data: ['a title', 'a subtitle'],\n    schema: {\n      title: 'items: [schema, schema]',\n      type: 'array',\n      items: [{\n        title: 'Title',\n        type: 'string'\n      }, {\n        title: 'Subtitle',\n        type: 'string'\n      }]\n    }\n  }\n}"},null===(_ItemsArray$parameter2=ItemsArray.parameters)||void 0===_ItemsArray$parameter2||null===(_ItemsArray$parameter2=_ItemsArray$parameter2.docs)||void 0===_ItemsArray$parameter2?void 0:_ItemsArray$parameter2.source)})}),AdditionalItemsUndefined.parameters=_objectSpread(_objectSpread({},AdditionalItemsUndefined.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AdditionalItemsUndef=AdditionalItemsUndefined.parameters)||void 0===_AdditionalItemsUndef?void 0:_AdditionalItemsUndef.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    data: ['a title', 'a subtitle'],\n    schema: {\n      title: 'additionalItems: undefined',\n      type: 'array',\n      items: [{\n        title: 'Title',\n        type: 'string'\n      }, {\n        title: 'Subtitle',\n        type: 'string'\n      }]\n    }\n  }\n}"},null===(_AdditionalItemsUndef2=AdditionalItemsUndefined.parameters)||void 0===_AdditionalItemsUndef2||null===(_AdditionalItemsUndef2=_AdditionalItemsUndef2.docs)||void 0===_AdditionalItemsUndef2?void 0:_AdditionalItemsUndef2.source)})}),AdditionalItemsTrue.parameters=_objectSpread(_objectSpread({},AdditionalItemsTrue.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AdditionalItemsTrue$=AdditionalItemsTrue.parameters)||void 0===_AdditionalItemsTrue$?void 0:_AdditionalItemsTrue$.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    data: ['a title', 'a subtitle', 'an additional item'],\n    schema: {\n      title: 'additionalItems: true',\n      type: 'array',\n      additionalItems: true,\n      items: [{\n        title: 'Title',\n        type: 'string'\n      }, {\n        title: 'Subtitle',\n        type: 'string'\n      }]\n    }\n  }\n}"},null===(_AdditionalItemsTrue$2=AdditionalItemsTrue.parameters)||void 0===_AdditionalItemsTrue$2||null===(_AdditionalItemsTrue$2=_AdditionalItemsTrue$2.docs)||void 0===_AdditionalItemsTrue$2?void 0:_AdditionalItemsTrue$2.source)})}),AdditionalItemsFalse.parameters=_objectSpread(_objectSpread({},AdditionalItemsFalse.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AdditionalItemsFalse=AdditionalItemsFalse.parameters)||void 0===_AdditionalItemsFalse?void 0:_AdditionalItemsFalse.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    data: ['a title', 'a subtitle', 'an additional item'],\n    schema: {\n      title: 'additionalItems: false',\n      type: 'array',\n      additionalItems: false,\n      items: [{\n        title: 'Title',\n        type: 'string'\n      }, {\n        title: 'Subtitle',\n        type: 'string'\n      }]\n    }\n  }\n}"},null===(_AdditionalItemsFalse2=AdditionalItemsFalse.parameters)||void 0===_AdditionalItemsFalse2||null===(_AdditionalItemsFalse2=_AdditionalItemsFalse2.docs)||void 0===_AdditionalItemsFalse2?void 0:_AdditionalItemsFalse2.source)})}),AdditionalItemsSchema.parameters=_objectSpread(_objectSpread({},AdditionalItemsSchema.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AdditionalItemsSchem=AdditionalItemsSchema.parameters)||void 0===_AdditionalItemsSchem?void 0:_AdditionalItemsSchem.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    data: ['a title', 'a subtitle', 'an additional item'],\n    schema: {\n      title: 'additionalItems: { type: \"number\" }',\n      type: 'array',\n      additionalItems: {\n        title: 'Additional number',\n        type: 'number'\n      },\n      items: [{\n        title: 'Title',\n        type: 'string'\n      }, {\n        title: 'Subtitle',\n        type: 'string'\n      }]\n    }\n  }\n}"},null===(_AdditionalItemsSchem2=AdditionalItemsSchema.parameters)||void 0===_AdditionalItemsSchem2||null===(_AdditionalItemsSchem2=_AdditionalItemsSchem2.docs)||void 0===_AdditionalItemsSchem2?void 0:_AdditionalItemsSchem2.source)})}),ItemsObject.parameters=_objectSpread(_objectSpread({},ItemsObject.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ItemsObject$paramete=ItemsObject.parameters)||void 0===_ItemsObject$paramete?void 0:_ItemsObject$paramete.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [2023],\n    schema: {\n      title: 'items: { object }',\n      type: 'array',\n      items: {\n        type: 'object',\n        required: ['alt', 'image'],\n        title: 'Content image',\n        properties: {\n          alt: {\n            title: 'Image alt text',\n            type: 'string'\n          },\n          image: {\n            title: 'Image',\n            type: 'string',\n            format: 'file'\n          },\n          width: {\n            title: 'Width in px',\n            type: 'number',\n            default: 400\n          }\n        }\n      }\n    }\n  }\n}"},null===(_ItemsObject$paramete2=ItemsObject.parameters)||void 0===_ItemsObject$paramete2||null===(_ItemsObject$paramete2=_ItemsObject$paramete2.docs)||void 0===_ItemsObject$paramete2?void 0:_ItemsObject$paramete2.source)})}),OneOf.parameters=_objectSpread(_objectSpread({},OneOf.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_OneOf$parameters=OneOf.parameters)||void 0===_OneOf$parameters?void 0:_OneOf$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [{\n      type: 'header'\n    }],\n    schema: {\n      title: 'items: { oneOf: [ schema, schema ] }',\n      type: 'array',\n      items: {\n        oneOfProperty: 'type',\n        oneOf: [{\n          id: 'header',\n          title: 'header',\n          type: 'object',\n          required: ['type', 'text'],\n          properties: {\n            type: {\n              type: 'string',\n              const: 'header',\n              options: {\n                hidden: true\n              }\n            },\n            text: {\n              title: 'Header text',\n              type: 'string'\n            }\n          }\n        }, {\n          id: 'paragraph',\n          title: 'paragraph',\n          type: 'object',\n          required: ['type', 'text'],\n          properties: {\n            type: {\n              type: 'string',\n              const: 'paragraph',\n              options: {\n                hidden: true\n              }\n            },\n            text: {\n              title: 'Paragraph text',\n              type: 'string'\n            }\n          }\n        }]\n      },\n      additionalItems: {\n        title: 'Width in px',\n        type: 'number',\n        default: 400\n      }\n    }\n  }\n}"},null===(_OneOf$parameters2=OneOf.parameters)||void 0===_OneOf$parameters2||null===(_OneOf$parameters2=_OneOf$parameters2.docs)||void 0===_OneOf$parameters2?void 0:_OneOf$parameters2.source)})}),Length.parameters=_objectSpread(_objectSpread({},Length.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Length$parameters=Length.parameters)||void 0===_Length$parameters?void 0:_Length$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [2023],\n    schema: {\n      title: 'minItems: 1, maxItems: 2',\n      type: 'array',\n      minItems: 1,\n      maxItems: 2,\n      items: {\n        title: 'item',\n        type: 'number',\n        default: 1\n      }\n    }\n  }\n}"},null===(_Length$parameters2=Length.parameters)||void 0===_Length$parameters2||null===(_Length$parameters2=_Length$parameters2.docs)||void 0===_Length$parameters2?void 0:_Length$parameters2.source)})}),IfThenElse.parameters=_objectSpread(_objectSpread({},IfThenElse.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_IfThenElse$parameter=IfThenElse.parameters)||void 0===_IfThenElse$parameter?void 0:_IfThenElse$parameter.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [],\n    schema: {\n      title: 'if: { items: { maximum: 1 } }',\n      type: 'array',\n      items: {\n        title: 'Item',\n        type: 'number',\n        default: 2\n      },\n      minItems: 1,\n      if: {\n        items: {\n          maximum: 1\n        }\n      },\n      then: {\n        maxItems: 1\n      },\n      else: {\n        maxItems: 0\n      }\n    }\n  }\n}"},null===(_IfThenElse$parameter2=IfThenElse.parameters)||void 0===_IfThenElse$parameter2||null===(_IfThenElse$parameter2=_IfThenElse$parameter2.docs)||void 0===_IfThenElse$parameter2?void 0:_IfThenElse$parameter2.source)})}),Enum.parameters=_objectSpread(_objectSpread({},Enum.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Enum$parameters=Enum.parameters)||void 0===_Enum$parameters?void 0:_Enum$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [],\n    schema: {\n      title: 'enum: [[], []]',\n      type: 'array',\n      enum: [[2019, 10, 22], [2023, 1, 1]],\n      items: {\n        type: 'number'\n      },\n      minItems: 3,\n      maxItems: 3,\n      options: {\n        title: true\n      }\n    }\n  }\n}"},null===(_Enum$parameters2=Enum.parameters)||void 0===_Enum$parameters2||null===(_Enum$parameters2=_Enum$parameters2.docs)||void 0===_Enum$parameters2?void 0:_Enum$parameters2.source)})}),Not.parameters=_objectSpread(_objectSpread({},Not.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Not$parameters=Not.parameters)||void 0===_Not$parameters?void 0:_Not$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [123],\n    schema: {\n      title: 'not: { items: { const: 123 }}',\n      description: 'value 123 is not allowed as array item',\n      type: 'array',\n      not: {\n        type: 'array',\n        items: {\n          const: 123\n        }\n      },\n      items: {\n        title: 'item',\n        type: 'number',\n        default: 12\n      }\n    }\n  }\n}"},null===(_Not$parameters2=Not.parameters)||void 0===_Not$parameters2||null===(_Not$parameters2=_Not$parameters2.docs)||void 0===_Not$parameters2?void 0:_Not$parameters2.source)})}),UniqueItems.parameters=_objectSpread(_objectSpread({},UniqueItems.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_UniqueItems$paramete=UniqueItems.parameters)||void 0===_UniqueItems$paramete?void 0:_UniqueItems$paramete.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [1, 2, 2],\n    schema: {\n      title: 'uniqueItems: true',\n      type: 'array',\n      uniqueItems: true,\n      items: {\n        title: 'item',\n        type: 'number',\n        default: 1\n      }\n    }\n  }\n}"},null===(_UniqueItems$paramete2=UniqueItems.parameters)||void 0===_UniqueItems$paramete2||null===(_UniqueItems$paramete2=_UniqueItems$paramete2.docs)||void 0===_UniqueItems$paramete2?void 0:_UniqueItems$paramete2.source)})}),Contains.parameters=_objectSpread(_objectSpread({},Contains.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Contains$parameters=Contains.parameters)||void 0===_Contains$parameters?void 0:_Contains$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    addOptionalProps: false,\n    data: [2, 3],\n    schema: {\n      title: 'contains: { const: 1 }',\n      type: 'array',\n      items: {\n        title: 'item',\n        type: 'number',\n        default: 1\n      },\n      contains: {\n        type: 'number',\n        const: 1\n      }\n    }\n  }\n}"},null===(_Contains$parameters2=Contains.parameters)||void 0===_Contains$parameters2||null===(_Contains$parameters2=_Contains$parameters2.docs)||void 0===_Contains$parameters2?void 0:_Contains$parameters2.source)})});var __namedExportsOrder=["ItemsArray","AdditionalItemsUndefined","AdditionalItemsTrue","AdditionalItemsFalse","AdditionalItemsSchema","ItemsObject","OneOf","Length","IfThenElse","Enum","Not","UniqueItems","Contains"]}}]);