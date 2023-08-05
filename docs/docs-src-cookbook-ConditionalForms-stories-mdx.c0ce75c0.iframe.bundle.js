"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[5505],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{NF:()=>withMDXComponents,Zo:()=>MDXProvider,ah:()=>useMDXComponents,pC:()=>MDXContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},children)}},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Xz:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.Xz,h_:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.h_});__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-S4VUQJ4A.mjs");var _storybook_blocks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs")},"./packages/docs/src/cookbook/ConditionalForms.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__page:()=>__page,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs"),_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/rje-widgets/src/index.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _createMdxContent(props){const _components=Object.assign({h1:"h1",blockquote:"blockquote",p:"p",h2:"h2",code:"code",pre:"pre",em:"em"},(0,_storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.h_,{title:"Cookbook/ConditionalForms"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"conditional-forms",children:"Conditional forms"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.blockquote,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Conditional forms are parts of the user interface that are shown and required only if a certain condition is met. Use this to only show input fields to the user if the data is really required. In addition, conditional forms can be used for data variations depending on certain selections."}),"\n"]}),"\n","\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"persisting-input-for-deactivated-field",children:"persisting input for deactivated field"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"The following example will persist user input, even if the additional user form is deactivated. The data of the user form is still stored on data and thus being exported. In case you do not want to have the data set on export, you need to remove the data on your own."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{mdxSource:'<Theme><JsonForm widgets={widgets} options={{ title: false }} addOptionalProps={false} schema={{ type: "object", title: "allOf with single if-then-else statements", required: ["trigger"], properties: { trigger: { title: "with additional field", type: "boolean", default: false }, optional: { options: { hidden: true, title: false }, type: "object", required: ["title"], properties: { title: { title: "Optional form", type: "string" } } } }, allOf: [{ if: { required: ["trigger"], properties: { trigger: { const: true } } }, then: { required: ["optional"], properties: { optional: { options: { hidden: false }, minLength: 1 } } } }] }} /></Theme>',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.Q2,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,options:{title:!1},addOptionalProps:!1,schema:{type:"object",title:"allOf with single if-then-else statements",required:["trigger"],properties:{trigger:{title:"with additional field",type:"boolean",default:!1},optional:{options:{hidden:!0,title:!1},type:"object",required:["title"],properties:{title:{title:"Optional form",type:"string"}}}},allOf:[{if:{required:["trigger"],properties:{trigger:{const:!0}}},then:{required:["optional"],properties:{optional:{options:{hidden:!1},minLength:1}}}}]}})})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Our optional property ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"optional"})," is defined on the objet properties, so that it will never be removed automatically"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{className:"language-js",children:"properties: {\n  optional: {\n    type: 'object',\n    properties: {\n      title: { title: 'Optional form', type: 'string' }\n    }\n  }\n}\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Just make sure that the optional object has no validation methods."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["In order to hide this property when the condition does not match, we use the json-editor option ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"hidden"})," and set it to ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"true"})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{className:"language-js",children:"properties: {\n  optional: {\n    options: {\n      hidden: true;\n    }\n    // ...\n  }\n}\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Now, to add the dynamic property we introduce an ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"if-then"})," condition to show our optional property for a condition. We could add the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"if-then"})," statement directly on our object, but we will wrap it in an ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"allOf"}),"-statement to support multiple conditions on this object."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{className:"language-js",children:"allOf: [\n  {\n    if: {\n      required: ['trigger'],\n      properties: {\n        trigger: {\n          const: true\n        }\n      }\n    },\n    then: {\n      required: ['optional'],\n      properties: {\n        optional: {\n          options: { hidden: false },\n          minLength: 1\n        }\n      }\n    }\n  }\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["The if condition validates if a property ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"trigger"})," (required + properties) matches ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"true"}),". If the property trigger fulfills our criteria, we update our optional value to be required ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"required: ['optional']"}),", validated (",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"minLength: 1"}),") and show it in the user form by overwriting the json-editor options with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"options: { hidden: true }"}),"."]})]})}const __page=()=>{throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};const componentMeta={title:"Cookbook/ConditionalForms",tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,_storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}};const __WEBPACK_DEFAULT_EXPORT__=componentMeta}}]);