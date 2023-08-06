"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[6281],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{NF:()=>withMDXComponents,Zo:()=>MDXProvider,ah:()=>useMDXComponents,pC:()=>MDXContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},children)}},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Xz:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.Xz,h_:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.h_});__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-PCJTTTQV.mjs");var _storybook_blocks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs")},"./packages/docs/src/Introduction.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>Introduction});__webpack_require__("./node_modules/react/index.js");var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),lib=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),dist=__webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs");__webpack_require__("./packages/react-json-editor/src/index.ts"),__webpack_require__("./packages/rje-widgets/src/index.ts");const he_full_trans_2000x564_namespaceObject=__webpack_require__.p+"static/media/he-full-trans-2000x564.f7391d48.png";function _createMdxContent(props){const _components=Object.assign({blockquote:"blockquote",p:"p",a:"a",code:"code",h2:"h2",ul:"ul",li:"li",em:"em"},(0,lib.ah)(),props.components);return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(dist.h_,{title:"Introduction"}),"\n",(0,jsx_runtime.jsx)("a",{href:"https://GitHub.com/sagold/json-editor/",children:(0,jsx_runtime.jsx)("img",{src:"https://badgen.net/badge/icon/github?icon=github&label"})}),"\n",(0,jsx_runtime.jsx)("img",{src:he_full_trans_2000x564_namespaceObject}),"\n",(0,jsx_runtime.jsx)("h1",{style:{textAlign:"center"},children:"json-editor documentation"}),"\n",(0,jsx_runtime.jsxs)(_components.blockquote,{children:["\n",(0,jsx_runtime.jsxs)(_components.p,{children:["Documentation around ",(0,jsx_runtime.jsx)(_components.a,{href:"https://github.com/sagold/json-editor/tree/main/packages/react-json-editor",target:"_blank",rel:"nofollow noopener noreferrer",children:"@sagold/react-json-editor"}),", an implementation of ",(0,jsx_runtime.jsx)(_components.a,{href:"https://github.com/sagold/json-editor/tree/main/packages/headless-json-editor",target:"_blank",rel:"nofollow noopener noreferrer",children:"headless-json-editor"}),"`. This project is currently in an early state, but the package is published, used in production and being tested regularly."]}),"\n"]}),"\n",(0,jsx_runtime.jsx)(_components.p,{children:"installation"}),"\n",(0,jsx_runtime.jsx)(_components.p,{children:(0,jsx_runtime.jsx)(_components.code,{children:"yarn add @sagold/react-json-editor"})}),"\n",(0,jsx_runtime.jsx)(_components.h2,{id:"current-features-in-development",children:"Current features in development"}),"\n",(0,jsx_runtime.jsxs)(_components.blockquote,{children:["\n",(0,jsx_runtime.jsx)(_components.p,{children:"replace react-semantic-ui by react-aria"}),"\n"]}),"\n",(0,jsx_runtime.jsxs)(_components.ul,{children:["\n",(0,jsx_runtime.jsx)(_components.li,{children:"rework object widget properties and stories"}),"\n"]}),"\n",(0,jsx_runtime.jsx)(_components.h2,{id:"roadmap",children:"roadmap"}),"\n",(0,jsx_runtime.jsxs)(_components.ul,{children:["\n",(0,jsx_runtime.jsx)(_components.li,{children:"✅ add password widget"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"update select widget to support any enum types"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"fix json widget input"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"onChange returnType"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"fix simplejsonwidget story"}),"\n"]}),"\n",(0,jsx_runtime.jsx)(_components.p,{children:(0,jsx_runtime.jsx)(_components.em,{children:"stability"})}),"\n",(0,jsx_runtime.jsxs)(_components.ul,{children:["\n",(0,jsx_runtime.jsx)(_components.li,{children:"test weird/incorrect states (change of schema types, errors in dynamic schemas, wrong input data)"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"improve update flow (using diff to patch less nodes and ensure current input does not lose focus)"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"add integration test setup"}),"\n"]}),"\n",(0,jsx_runtime.jsx)(_components.p,{children:(0,jsx_runtime.jsx)(_components.em,{children:"drag&rop features"})}),"\n",(0,jsx_runtime.jsxs)(_components.ul,{children:["\n",(0,jsx_runtime.jsx)(_components.li,{children:"drag html-widget into array to add items"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"drag items across arrays"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"drag validation of wrong items while dragging"}),"\n"]}),"\n",(0,jsx_runtime.jsx)(_components.p,{children:(0,jsx_runtime.jsx)(_components.em,{children:"further topics"})}),"\n",(0,jsx_runtime.jsxs)(_components.ul,{children:["\n",(0,jsx_runtime.jsx)(_components.li,{children:"rework validation function & logic (errors and node assignments)"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"async validation errors and update"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"i18n"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"✅ support undefined properties/items via ui"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"wizard option (gathering as pages)"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"delegation editor support (portal for widget details)"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"can we have sortableJS as plugin?"}),"\n",(0,jsx_runtime.jsx)(_components.li,{children:"logic to support un/collapse all option"}),"\n"]})]})}const Introduction=function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,lib.ah)(),props.components);return MDXLayout?(0,jsx_runtime.jsx)(MDXLayout,Object.assign({},props,{children:(0,jsx_runtime.jsx)(_createMdxContent,props)})):_createMdxContent(props)}}}]);