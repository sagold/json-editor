"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[9398],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{NF:()=>withMDXComponents,Zo:()=>MDXProvider,ah:()=>useMDXComponents,pC:()=>MDXContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},children)}},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Xz:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_2__.Xz,h_:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_2__.h_});__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-PCJTTTQV.mjs"),__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-R4NKYYJA.mjs");var _storybook_blocks__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs")},"./packages/docs/src/ObjectProperties.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__page:()=>__page,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs"),_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/react-json-editor/src/index.ts"),_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/rje-widgets/src/index.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __page=()=>{throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};const componentMeta={title:"ObjectProperties",tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,_storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_createMdxContent,{})}):_createMdxContent();function _createMdxContent(){const _components=Object.assign({h1:"h1",blockquote:"blockquote",p:"p",em:"em",ul:"ul",li:"li",a:"a",strong:"strong",h2:"h2",code:"code",pre:"pre"},(0,_storybook_addon_essentials_docs_mdx_react_shim__WEBPACK_IMPORTED_MODULE_5__.ah)(),props.components);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.h_,{title:"ObjectProperties"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h1,{id:"object-properties",children:"object properties"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.blockquote,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"json-schema"})," has a set of definitions for object properties. This section details how those definitions transfer to a user interface build with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"@sagold/react-json-editor"})," and its default widgets."]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Validation of data is fully supported, the following list tracks support of the user interface:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["✅ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#properties",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"properties"})})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["✅ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#required-properties",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"required"})})," - per default, only required properties will be added"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["❎ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#additional-properties",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"additionalProperties"})})," - actions to add additional properties are not available"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["✅ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#oneof",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"oneOf"})})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["✅ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#allof",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"allOf"})})," - support by merging subschema to a single schema. Validation still treats schemas separate"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["✅ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#dependencies",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"dependencies"})})," - support by merging subschema to a single schema. Validation still treats schemas separate"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["✅ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"#if-then-else",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"if-then-else"})})," - support by merging subschema to a single schema. Validation still treats schemas separate"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["❌ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"patternProperties"})," - not yet supported"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.li,{children:["❌ ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"anyOf"})," - not yet supported"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"properties",children:"Properties"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Per default, missing properties will only be added when they are required. Optional properties having a schema definition can be added dynamically:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm schema={{ type: "object", properties: { optionalProperty: { title: "Optional property", type: "string" } } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{schema:{type:"object",properties:{optionalProperty:{title:"Optional property",type:"string"}}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Optional properties containing data from input will be added automatically:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm data={{ optionalProperty: "input data" }} schema={{ type: "object", properties: { optionalProperty: { title: "Optional property", type: "string" } } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{data:{optionalProperty:"input data"},schema:{type:"object",properties:{optionalProperty:{title:"Optional property",type:"string"}}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"You can change this behaviour to add optional properties initially by passing"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"addOptionalProps: true"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm addOptionalProps={true} schema={{ type: "object", properties: { optionalProperty: { title: "Optional property", type: "string" } } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{addOptionalProps:!0,schema:{type:"object",properties:{optionalProperty:{title:"Optional property",type:"string"}}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"required-properties",children:"Required Properties"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"With a property set as required, it will always be available in the form:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"required: ['requiredProperty']"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm schema={{ type: "object", required: ["requiredProperty"], properties: { requiredProperty: { title: "Required Property", type: "string" }, optionalProperty: { title: "Optional Property", type: "string" } } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{schema:{type:"object",required:["requiredProperty"],properties:{requiredProperty:{title:"Required Property",type:"string"},optionalProperty:{title:"Optional Property",type:"string"}}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"additional-properties",children:"Additional Properties"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Additional properties that are not defined within json-schema will be shown by default and may be removed:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm data={{ additionalProperty: "property without schema" }} schema={{ type: "object" }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{data:{additionalProperty:"property without schema"},schema:{type:"object"}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"If you set additionalProperties to false, any additional data will be removed from user form and exported data:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"additionalProperties: false"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm data={{ additionalProperty: "property without schema" }} schema={{ type: "object", additionalProperties: false }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{data:{additionalProperty:"property without schema"},schema:{type:"object",additionalProperties:!1}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Using additionalProperties with a json-schema, will apply this schema to any unknown property:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"additionalProperties: { maxLength }"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm validate={true} data={{ additionalProperty: "property without schema" }} schema={{ type: "object", additionalProperties: { type: "string", maxLength: 10 } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{validate:!0,data:{additionalProperty:"property without schema"},schema:{type:"object",additionalProperties:{type:"string",maxLength:10}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.blockquote,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"Note"})," Currently no user interface is offered to add additional data. You can enable the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"editJson"})," option to allow users to add additional properties as json or you can create a custom object widget that supports this."]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Example Object with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"editJson"})," option"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"options: { editJson: { enabled: true } }"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm data={{ additionalProperty: "property without schema" }} schema={{ type: "object", title: "EditJson Example", description: "Using an object with a title will switch actions for optional properties to be placed in the actions-icon besides its title. Inline delete options are moved into their panel for a cleaner ui. Using EditJson action from the actions panel will allow the user to add additional data in json format.", options: { editJson: { enabled: true } }, additionalProperties: { type: "string" } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{data:{additionalProperty:"property without schema"},schema:{type:"object",title:"EditJson Example",description:"Using an object with a title will switch actions for optional properties to be placed in the actions-icon besides its title. Inline delete options are moved into their panel for a cleaner ui. Using EditJson action from the actions panel will allow the user to add additional data in json format.",options:{editJson:{enabled:!0}},additionalProperties:{type:"string"}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"oneof",children:"oneOf"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"json-schema containing an oneOf statement will show a selection to choose the sub schema:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm schema={{ oneOf: [{ type: "object", title: "First Option", required: ["one"], properties: { one: { type: "string", title: "Property String" } } }, { type: "object", title: "Second Option", required: ["one"], properties: { one: { type: "number", title: "Property Number" } } }] }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{schema:{oneOf:[{type:"object",title:"First Option",required:["one"],properties:{one:{type:"string",title:"Property String"}}},{type:"object",title:"Second Option",required:["one"],properties:{one:{type:"number",title:"Property Number"}}}]}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Note that json-schema requires distinguishable json-schema. If there is an undistinguishable schema (same validation results) the user interface will not behave correctly:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{className:"language-ts",children:"// invalid oneOf-schema\n{\n  oneOf: [\n    { required: ['one'], one: { type: 'string '},\n    { required: ['one'], one: { type: 'string '}\n  }]\n}\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm data={{ one: "input data" }} schema={{ oneOf: [{ type: "object", title: "First Option", required: ["one"], properties: { one: { type: "string", title: "Property One" } } }, { type: "object", title: "Unselectable Second Option", required: ["one"], properties: { one: { type: "string", title: "Property Two" } } }] }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{data:{one:"input data"},schema:{oneOf:[{type:"object",title:"First Option",required:["one"],properties:{one:{type:"string",title:"Property One"}}},{type:"object",title:"Unselectable Second Option",required:["one"],properties:{one:{type:"string",title:"Property Two"}}}]}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["To ensure ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"oneOf"})," schemas can be distinguished it is recommended to add a unique property:"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{className:"language-ts",children:"// valid oneOf-schema\n{\n  oneOf: [\n    { required: ['id', 'one'], id: { type: \"string\", const: \"A\" }, one: { type: 'string '},\n    { required: ['id', 'one'], id: { type: \"string\", const: \"B\" },  one: { type: 'string '}\n  }]\n}\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm schema={{ oneOf: [{ type: "object", title: "Select A", required: ["id", "one"], properties: { id: { type: "string", const: "A" }, one: { type: "string", title: "Property ID A" } } }, { type: "object", title: "Select B", required: ["id", "one"], properties: { id: { type: "string", const: "B" }, one: { type: "string", title: "Property ID B" } } }] }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{schema:{oneOf:[{type:"object",title:"Select A",required:["id","one"],properties:{id:{type:"string",const:"A"},one:{type:"string",title:"Property ID A"}}},{type:"object",title:"Select B",required:["id","one"],properties:{id:{type:"string",const:"B"},one:{type:"string",title:"Property ID B"}}}]}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.blockquote,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"Note"})," You can set ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"{ options: { hidden: true }}"})," to each property ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"id"})," to hide the control variable from user interface. Still, ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"id"})," will be exported in data."]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["In case you want a selection to always be associated with the selected schema, identified by an ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"id"}),", it his highly recommended tp use the additional flag ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"oneOfProperty"}),". This will always select the corresponding schema, regardless of additional validation errors. So for the above example we add"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{className:"language-ts",children:"{\n  oneOfProperty: 'id', // identify subschema be the property 'id'\n  oneOf: { ... }\n}\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm data={{ id: "B", one: "B" }} validate={true} schema={{ oneOfProperty: "id", oneOf: [{ type: "object", title: "Select A", required: ["id", "one"], properties: { id: { type: "string", const: "A", options: { hidden: true } }, one: { type: "string", title: "Property ID A" } } }, { type: "object", title: "Select B", required: ["id", "one"], properties: { id: { type: "string", const: "B", options: { hidden: true } }, one: { type: "string", minLength: 2, title: "Property ID B" } } }] }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{data:{id:"B",one:"B"},validate:!0,schema:{oneOfProperty:"id",oneOf:[{type:"object",title:"Select A",required:["id","one"],properties:{id:{type:"string",const:"A",options:{hidden:!0}},one:{type:"string",title:"Property ID A"}}},{type:"object",title:"Select B",required:["id","one"],properties:{id:{type:"string",const:"B",options:{hidden:!0}},one:{type:"string",minLength:2,title:"Property ID B"}}}]}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["As you can see, the selected schema is always associated with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"B"})," although there are validation errors. This is the expected behaviour."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"allof",children:"allOf"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"allOf"})," requires all sub schemas to be valid for the given input. For a user input this all sub schemas have to be merged, thus you must ensure properties and validation rules are exclusive. At some point, the merging of subschemas might improve here, but currently any attributes woud be overriden by the last definition."]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"The following example has conflicting validation rules, where the last statement will be applied:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm validate={true} data={{ title: "five!" }} schema={{ type: "object", options: { title: false }, required: ["title"], properties: { title: { type: "string" } }, allOf: [{ properties: { title: { minLength: 1 } } }, { properties: { title: { default: "title", minLength: 6 } } }] }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{validate:!0,data:{title:"five!"},schema:{type:"object",options:{title:!1},required:["title"],properties:{title:{type:"string"}},allOf:[{properties:{title:{minLength:1}}},{properties:{title:{default:"title",minLength:6}}}]}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"allOf"})," also supports any json-schema supported by json-editor, e.g. if-then-else statements"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.blockquote,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.strong,{children:"⚠️ TODO"})," change in schema should not lose focus"]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} validate={true} liveUpdate={true} schema={{ type: "object", options: { title: false }, properties: { title: { type: "string", default: "four" } }, allOf: [{ if: { type: "object", required: ["title"], properties: { title: { minLength: 4 } } }, then: { properties: { title: { pattern: "^[0-9]+$", patternExample: "a string with a length of 4+ should contain only numbers" } } } }] }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,validate:!0,liveUpdate:!0,schema:{type:"object",options:{title:!1},properties:{title:{type:"string",default:"four"}},allOf:[{if:{type:"object",required:["title"],properties:{title:{minLength:4}}},then:{properties:{title:{pattern:"^[0-9]+$",patternExample:"a string with a length of 4+ should contain only numbers"}}}}]}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"dependencies",children:"dependencies"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.strong,{children:["dependency required: ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:'prop: ["prop"]'})]})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Dependencies are not added per default"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} data={{}} onChange={(data, root) => console.log(data, root)} schema={{ type: "object", properties: { one: { title: "Property One", type: "string" }, two: { title: "dependency", type: "string" } }, dependencies: { one: ["two"] }, options: { title: false } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,data:{},onChange:(data,root)=>console.log(data,root),schema:{type:"object",properties:{one:{title:"Property One",type:"string"},two:{title:"dependency",type:"string"}},dependencies:{one:["two"]},options:{title:!1}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Dependencies are added when they are required by another property which has been set (",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"!== undefined"}),")"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} data={{ one: "input value" }} addOptionalProps={false} schema={{ type: "object", required: ["one"], properties: { one: { title: "Property One", type: "string" }, two: { title: "dependency", type: "string" } }, dependencies: { one: ["two"] }, options: { title: false } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,data:{one:"input value"},addOptionalProps:!1,schema:{type:"object",required:["one"],properties:{one:{title:"Property One",type:"string"},two:{title:"dependency",type:"string"}},dependencies:{one:["two"]},options:{title:!1}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.strong,{children:["dependency schema: ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"prop: {}"})]})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.p,{children:"Dependent schemas are not added per default for a missing dependent property"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} addOptionalProps={false} schema={{ type: "object", properties: { one: { title: "Property One", type: "string" } }, dependencies: { one: { required: ["two"], properties: { two: { title: "dependency", type: "string" } } } }, options: { title: false } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,addOptionalProps:!1,schema:{type:"object",properties:{one:{title:"Property One",type:"string"}},dependencies:{one:{required:["two"],properties:{two:{title:"dependency",type:"string"}}}},options:{title:!1}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Dependent schemas are added if the dependent property is set (",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"!== undefined"}),")"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} addOptionalProps={false} schema={{ type: "object", required: ["one"], properties: { one: { title: "Property One", type: "string" } }, dependencies: { one: { required: ["two"], properties: { two: { title: "dependency", type: "string" } } } }, options: { title: false } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,addOptionalProps:!1,schema:{type:"object",required:["one"],properties:{one:{title:"Property One",type:"string"}},dependencies:{one:{required:["two"],properties:{two:{title:"dependency",type:"string"}}}},options:{title:!1}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"if-then-else",children:"if-then-else"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"if-then"})," statement, adding or removing a schema with its data depending on the property of trigger. The following toggle should not show the property per default as the property ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"addition"})," is not set as required"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} addOptionalProps={false} schema={{ type: "object", required: ["trigger"], properties: { trigger: { title: "Trigger", type: "boolean", default: false } }, if: { required: ["trigger"], properties: { trigger: { const: true } } }, then: { properties: { addition: { type: "string" } } }, options: { title: false } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,addOptionalProps:!1,schema:{type:"object",required:["trigger"],properties:{trigger:{title:"Trigger",type:"boolean",default:!1}},if:{required:["trigger"],properties:{trigger:{const:!0}}},then:{properties:{addition:{type:"string"}}},options:{title:!1}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["Same setup as above, but with property ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.code,{children:"addition"})," set as required:"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} addOptionalProps={false} schema={{ type: "object", required: ["trigger"], properties: { trigger: { title: "Trigger", type: "boolean", default: false } }, if: { required: ["trigger"], properties: { trigger: { const: true } } }, then: { required: ["addition"], properties: { addition: { type: "string" } } }, options: { title: false } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,addOptionalProps:!1,schema:{type:"object",required:["trigger"],properties:{trigger:{title:"Trigger",type:"boolean",default:!1}},if:{required:["trigger"],properties:{trigger:{const:!0}}},then:{required:["addition"],properties:{addition:{type:"string"}}},options:{title:!1}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.blockquote,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:["If you want to persist the value entered independent of the current visbility, follow the ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"?path=/story/examples-jsonschemasupport--all-of-with-conditions",children:"tutorial"}),"."]}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.em,{children:"if-then-else"})," statement used to switch sub-schemas"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_storybook_addon_docs__WEBPACK_IMPORTED_MODULE_1__.Xz,{className:"rje-theme--light",mdxSource:'<JsonForm widgets={widgets} validate={true} addOptionalProps={false} schema={{ type: "object", required: ["switch"], additionalProperties: false, properties: { switch: { title: "Switch", type: "boolean", default: false } }, if: { required: ["switch"], properties: { switch: { const: false } } }, then: { required: ["then", "number"], properties: { then: { title: "Then statement", type: "string" }, number: { title: "Value in Then", type: "number", minimum: 4 } } }, else: { required: ["else", "number"], properties: { else: { title: "Else statement", type: "string", enum: ["option a", "option b"] }, number: { title: "Value in Else", type: "number", maximum: 4 } } }, options: { title: false } }} />',children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_sagold_react_json_editor__WEBPACK_IMPORTED_MODULE_2__.R_,{widgets:_sagold_rje_widgets__WEBPACK_IMPORTED_MODULE_3__.DA,validate:!0,addOptionalProps:!1,schema:{type:"object",required:["switch"],additionalProperties:!1,properties:{switch:{title:"Switch",type:"boolean",default:!1}},if:{required:["switch"],properties:{switch:{const:!1}}},then:{required:["then","number"],properties:{then:{title:"Then statement",type:"string"},number:{title:"Value in Then",type:"number",minimum:4}}},else:{required:["else","number"],properties:{else:{title:"Else statement",type:"string",enum:["option a","option b"]},number:{title:"Value in Else",type:"number",maximum:4}}},options:{title:!1}}})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.h2,{id:"references",children:"references"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"https://json-schema.org/understanding-json-schema/reference/object.html",target:"_blank",rel:"nofollow noopener noreferrer",children:"json-schema.org object properties"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.li,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components.a,{href:"https://json-schema.org/understanding-json-schema/reference/conditionals.html",target:"_blank",rel:"nofollow noopener noreferrer",children:"json-schema.org dependencies"})}),"\n"]})]})}}};const __WEBPACK_DEFAULT_EXPORT__=componentMeta}}]);