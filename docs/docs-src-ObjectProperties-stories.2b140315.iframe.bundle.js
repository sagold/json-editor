"use strict";(self.webpackChunkjson_editor=self.webpackChunkjson_editor||[]).push([[5899],{"./packages/docs/src/ObjectProperties.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{var _OptionalProperties$p,_OptionalProperties$p2,_InitialOptionalPrope,_InitialOptionalPrope2,_AddOptionalProps$par,_AddOptionalProps$par2,_RequiredProperties$p,_RequiredProperties$p2,_AdditionalProperties,_AdditionalProperties2,_AdditionalProperties3,_AdditionalProperties4,_AdditionalProperties5,_AdditionalProperties6,_EditJson$parameters,_EditJson$parameters2,_OneOfObject$paramete,_OneOfObject$paramete2,_InvalidOneOfObject$p,_InvalidOneOfObject$p2,_TypedOneOfObject$par,_TypedOneOfObject$par2,_OneOfProperty$parame,_OneOfProperty$parame2,_AllOf$parameters,_AllOf$parameters2,_AllOfIfThen$paramete,_AllOfIfThen$paramete2,_DependenciesList$par,_DependenciesList$par2,_DependenciesListActi,_DependenciesListActi2,_Dependencies$paramet,_Dependencies$paramet2,_DependenciesActive$p,_DependenciesActive$p2,_IfThenElse$parameter,_IfThenElse$parameter2,_IfThenElseActive$par,_IfThenElseActive$par2,_IfThenElseSwitch$par,_IfThenElseSwitch$par2;function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{AddOptionalProps:()=>AddOptionalProps,AdditionalProperties:()=>AdditionalProperties,AdditionalPropertiesFalse:()=>AdditionalPropertiesFalse,AdditionalPropertiesSchema:()=>AdditionalPropertiesSchema,AllOf:()=>AllOf,AllOfIfThen:()=>AllOfIfThen,Dependencies:()=>Dependencies,DependenciesActive:()=>DependenciesActive,DependenciesList:()=>DependenciesList,DependenciesListActive:()=>DependenciesListActive,EditJson:()=>EditJson,IfThenElse:()=>IfThenElse,IfThenElseActive:()=>IfThenElseActive,IfThenElseSwitch:()=>IfThenElseSwitch,InitialOptionalProperty:()=>InitialOptionalProperty,InvalidOneOfObject:()=>InvalidOneOfObject,OneOfObject:()=>OneOfObject,OneOfProperty:()=>OneOfProperty,OptionalProperties:()=>OptionalProperties,RequiredProperties:()=>RequiredProperties,TypedOneOfObject:()=>TypedOneOfObject,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={component:__webpack_require__("./packages/rje-widgets/src/index.ts").R_};var OptionalProperties={args:{className:"rje-theme rje-theme--light",schema:{type:"object",properties:{optionalProperty:{title:"Optional property",type:"string"}}}}},InitialOptionalProperty={args:{className:"rje-theme rje-theme--light",data:{optionalProperty:"input data"},schema:{type:"object",properties:{optionalProperty:{title:"Optional property",type:"string"}}}}},AddOptionalProps={args:{className:"rje-theme rje-theme--light",addOptionalProps:!0,schema:{title:"addOptionalProps: true",type:"object",properties:{optionalProperty:{title:"Optional property",type:"string"}}}}},RequiredProperties={args:{className:"rje-theme rje-theme--light",schema:{title:"required: [ property ]",type:"object",required:["requiredProperty"],properties:{requiredProperty:{title:"Required Property",type:"string"},optionalProperty:{title:"Optional Property",type:"string"}}}}},AdditionalProperties={args:{className:"rje-theme rje-theme--light",data:{additionalProperty:"property without schema"},schema:{type:"object"}}},AdditionalPropertiesFalse={args:{className:"rje-theme rje-theme--light",data:{additionalProperty:"property without schema"},schema:{title:"additionalProperties: false",type:"object",additionalProperties:!1}}},AdditionalPropertiesSchema={args:{className:"rje-theme rje-theme--light",data:{additionalProperty:"property without schema"},validate:!0,schema:{title:"additionalProperties: { maxLength }",type:"object",additionalProperties:{type:"string",maxLength:10}}}},EditJson={args:{className:"rje-theme rje-theme--light",data:{additionalProperty:"property without schema"},schema:{type:"object",title:"options: { editJson: { enabled: true } }",description:"Using an object with a title will switch actions for optional properties to be placed in the actions-icon besides its title. Inline delete options are moved into their panel for a cleaner ui. Using EditJson action from the actions panel will allow the user to add additional data in json format.",options:{editJson:{enabled:!0}},additionalProperties:{type:"string"}}}},OneOfObject={args:{className:"rje-theme rje-theme--light",schema:{oneOf:[{type:"object",title:"First Option",required:["one"],properties:{one:{type:"string",title:"Property String"}}},{type:"object",title:"Second Option",required:["one"],properties:{one:{type:"number",title:"Property Number"}}}]}}},InvalidOneOfObject={args:{className:"rje-theme rje-theme--light",data:{one:"input data"},schema:{oneOf:[{type:"object",title:"First Option",required:["one"],properties:{one:{type:"string",title:"Property One"}}},{type:"object",title:"Unselectable Second Option",required:["one"],properties:{one:{type:"string",title:"Property Two"}}}]}}},TypedOneOfObject={args:{className:"rje-theme rje-theme--light",schema:{oneOf:[{type:"object",title:"Select A",required:["id","one"],properties:{id:{type:"string",const:"A"},one:{type:"string",title:"Property ID A"}}},{type:"object",title:"Select B",required:["id","one"],properties:{id:{type:"string",const:"B"},one:{type:"string",title:"Property ID B"}}}]}}},OneOfProperty={args:{className:"rje-theme rje-theme--light",data:{id:"B",one:"B"},schema:{oneOfProperty:"id",oneOf:[{type:"object",title:"Select A",required:["id","one"],properties:{id:{type:"string",const:"A",options:{hidden:!0}},one:{type:"string",title:"Property ID A"}}},{type:"object",title:"Select B",required:["id","one"],properties:{id:{type:"string",const:"B",options:{hidden:!0}},one:{type:"string",minLength:2,title:"Property ID B"}}}]}}},AllOf={args:{className:"rje-theme rje-theme--light",validate:!0,data:{title:"five!"},schema:{type:"object",options:{title:!1},required:["title"],properties:{title:{type:"string"}},allOf:[{properties:{title:{minLength:1}}},{properties:{title:{default:"title",minLength:6}}}]}}},AllOfIfThen={args:{className:"rje-theme rje-theme--light",validate:!0,liveUpdate:!0,schema:{type:"object",options:{title:!1},properties:{title:{type:"string",default:"four"}},allOf:[{if:{type:"object",required:["title"],properties:{title:{minLength:4}}},then:{properties:{title:{pattern:"^[0-9]+$",patternExample:"a string with a length of 4+ should contain only numbers"}}}}]}}},DependenciesList={args:{className:"rje-theme rje-theme--light",schema:{title:'dependencies: { prop: ["prop"] }',type:"object",properties:{one:{title:"Property One",type:"string"},two:{title:"dependency",type:"string"}},dependencies:{one:["two"]},options:{title:!1}}}},DependenciesListActive={args:{className:"rje-theme rje-theme--light",data:{one:"input value"},addOptionalProps:!1,schema:{title:'dependencies: { prop: ["prop"] }',type:"object",required:["one"],properties:{one:{title:"Property One",type:"string"},two:{title:"dependency",type:"string"}},dependencies:{one:["two"]},options:{title:!1}}}},Dependencies={args:{className:"rje-theme rje-theme--light",addOptionalProps:!1,schema:{title:"dependencies: { prop: { schema } }",type:"object",properties:{one:{title:"Property One",type:"string"}},dependencies:{one:{required:["two"],properties:{two:{title:"dependency",type:"string"}}}},options:{title:!1}}}},DependenciesActive={args:{className:"rje-theme rje-theme--light",addOptionalProps:!1,schema:{title:"dependencies: { prop: { schema } }",type:"object",required:["one"],properties:{one:{title:"Property One",type:"string"}},dependencies:{one:{required:["two"],properties:{two:{title:"dependency",type:"string"}}}},options:{title:!1}}}},IfThenElse={args:{className:"rje-theme rje-theme--light",addOptionalProps:!1,schema:{type:"object",required:["trigger"],properties:{trigger:{title:"Trigger",type:"boolean",default:!1}},if:{required:["trigger"],properties:{trigger:{const:!0}}},then:{properties:{addition:{type:"string"}}},options:{title:!1}}}},IfThenElseActive={args:{className:"rje-theme rje-theme--light",addOptionalProps:!1,schema:{type:"object",required:["trigger"],properties:{trigger:{title:"Trigger",type:"boolean",default:!1}},if:{required:["trigger"],properties:{trigger:{const:!0}}},then:{required:["addition"],properties:{addition:{type:"string"}}},options:{title:!1}}}},IfThenElseSwitch={args:{className:"rje-theme rje-theme--light",addOptionalProps:!1,validate:!0,schema:{type:"object",required:["switch"],additionalProperties:!1,properties:{switch:{title:"Switch",type:"boolean",default:!1}},if:{required:["switch"],properties:{switch:{const:!1}}},then:{required:["then","number"],properties:{then:{title:"Then statement",type:"string"},number:{title:"Value in Then",type:"number",minimum:4}}},else:{required:["else","number"],properties:{else:{title:"Else statement",type:"string",enum:["option a","option b"]},number:{title:"Value in Else",type:"number",maximum:4}}},options:{title:!1}}}};OptionalProperties.parameters=_objectSpread(_objectSpread({},OptionalProperties.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_OptionalProperties$p=OptionalProperties.parameters)||void 0===_OptionalProperties$p?void 0:_OptionalProperties$p.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    schema: {\n      type: 'object',\n      properties: {\n        optionalProperty: {\n          title: 'Optional property',\n          type: 'string'\n        }\n      }\n    }\n  }\n}"},null===(_OptionalProperties$p2=OptionalProperties.parameters)||void 0===_OptionalProperties$p2||null===(_OptionalProperties$p2=_OptionalProperties$p2.docs)||void 0===_OptionalProperties$p2?void 0:_OptionalProperties$p2.source)})}),InitialOptionalProperty.parameters=_objectSpread(_objectSpread({},InitialOptionalProperty.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_InitialOptionalPrope=InitialOptionalProperty.parameters)||void 0===_InitialOptionalPrope?void 0:_InitialOptionalPrope.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      optionalProperty: 'input data'\n    },\n    schema: {\n      type: 'object',\n      properties: {\n        optionalProperty: {\n          title: 'Optional property',\n          type: 'string'\n        }\n      }\n    }\n  }\n}"},null===(_InitialOptionalPrope2=InitialOptionalProperty.parameters)||void 0===_InitialOptionalPrope2||null===(_InitialOptionalPrope2=_InitialOptionalPrope2.docs)||void 0===_InitialOptionalPrope2?void 0:_InitialOptionalPrope2.source)})}),AddOptionalProps.parameters=_objectSpread(_objectSpread({},AddOptionalProps.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AddOptionalProps$par=AddOptionalProps.parameters)||void 0===_AddOptionalProps$par?void 0:_AddOptionalProps$par.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    addOptionalProps: true,\n    schema: {\n      title: 'addOptionalProps: true',\n      type: 'object',\n      properties: {\n        optionalProperty: {\n          title: 'Optional property',\n          type: 'string'\n        }\n      }\n    }\n  }\n}"},null===(_AddOptionalProps$par2=AddOptionalProps.parameters)||void 0===_AddOptionalProps$par2||null===(_AddOptionalProps$par2=_AddOptionalProps$par2.docs)||void 0===_AddOptionalProps$par2?void 0:_AddOptionalProps$par2.source)})}),RequiredProperties.parameters=_objectSpread(_objectSpread({},RequiredProperties.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_RequiredProperties$p=RequiredProperties.parameters)||void 0===_RequiredProperties$p?void 0:_RequiredProperties$p.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    schema: {\n      title: 'required: [ property ]',\n      type: 'object',\n      required: ['requiredProperty'],\n      properties: {\n        requiredProperty: {\n          title: 'Required Property',\n          type: 'string'\n        },\n        optionalProperty: {\n          title: 'Optional Property',\n          type: 'string'\n        }\n      }\n    }\n  }\n}"},null===(_RequiredProperties$p2=RequiredProperties.parameters)||void 0===_RequiredProperties$p2||null===(_RequiredProperties$p2=_RequiredProperties$p2.docs)||void 0===_RequiredProperties$p2?void 0:_RequiredProperties$p2.source)})}),AdditionalProperties.parameters=_objectSpread(_objectSpread({},AdditionalProperties.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AdditionalProperties=AdditionalProperties.parameters)||void 0===_AdditionalProperties?void 0:_AdditionalProperties.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      additionalProperty: 'property without schema'\n    },\n    schema: {\n      type: 'object'\n    }\n  }\n}"},null===(_AdditionalProperties2=AdditionalProperties.parameters)||void 0===_AdditionalProperties2||null===(_AdditionalProperties2=_AdditionalProperties2.docs)||void 0===_AdditionalProperties2?void 0:_AdditionalProperties2.source)})}),AdditionalPropertiesFalse.parameters=_objectSpread(_objectSpread({},AdditionalPropertiesFalse.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AdditionalProperties3=AdditionalPropertiesFalse.parameters)||void 0===_AdditionalProperties3?void 0:_AdditionalProperties3.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      additionalProperty: 'property without schema'\n    },\n    schema: ({\n      title: 'additionalProperties: false',\n      type: 'object',\n      additionalProperties: false\n    } as JsonSchema)\n  }\n}"},null===(_AdditionalProperties4=AdditionalPropertiesFalse.parameters)||void 0===_AdditionalProperties4||null===(_AdditionalProperties4=_AdditionalProperties4.docs)||void 0===_AdditionalProperties4?void 0:_AdditionalProperties4.source)})}),AdditionalPropertiesSchema.parameters=_objectSpread(_objectSpread({},AdditionalPropertiesSchema.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AdditionalProperties5=AdditionalPropertiesSchema.parameters)||void 0===_AdditionalProperties5?void 0:_AdditionalProperties5.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      additionalProperty: 'property without schema'\n    },\n    validate: true,\n    schema: {\n      title: 'additionalProperties: { maxLength }',\n      type: 'object',\n      additionalProperties: {\n        type: 'string',\n        maxLength: 10\n      }\n    }\n  }\n}"},null===(_AdditionalProperties6=AdditionalPropertiesSchema.parameters)||void 0===_AdditionalProperties6||null===(_AdditionalProperties6=_AdditionalProperties6.docs)||void 0===_AdditionalProperties6?void 0:_AdditionalProperties6.source)})}),EditJson.parameters=_objectSpread(_objectSpread({},EditJson.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_EditJson$parameters=EditJson.parameters)||void 0===_EditJson$parameters?void 0:_EditJson$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      additionalProperty: 'property without schema'\n    },\n    schema: {\n      type: 'object',\n      title: 'options: { editJson: { enabled: true } }',\n      description: 'Using an object with a title will switch actions for optional properties to be placed in the actions-icon besides its title. Inline delete options are moved into their panel for a cleaner ui. Using EditJson action from the actions panel will allow the user to add additional data in json format.',\n      options: {\n        editJson: {\n          enabled: true\n        }\n      },\n      additionalProperties: {\n        type: 'string'\n      }\n    }\n  }\n}"},null===(_EditJson$parameters2=EditJson.parameters)||void 0===_EditJson$parameters2||null===(_EditJson$parameters2=_EditJson$parameters2.docs)||void 0===_EditJson$parameters2?void 0:_EditJson$parameters2.source)})}),OneOfObject.parameters=_objectSpread(_objectSpread({},OneOfObject.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_OneOfObject$paramete=OneOfObject.parameters)||void 0===_OneOfObject$paramete?void 0:_OneOfObject$paramete.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    schema: ({\n      oneOf: [{\n        type: 'object',\n        title: 'First Option',\n        required: ['one'],\n        properties: {\n          one: {\n            type: 'string',\n            title: 'Property String'\n          }\n        }\n      }, {\n        type: 'object',\n        title: 'Second Option',\n        required: ['one'],\n        properties: {\n          one: {\n            type: 'number',\n            title: 'Property Number'\n          }\n        }\n      }]\n    } as JsonSchema)\n  }\n}"},null===(_OneOfObject$paramete2=OneOfObject.parameters)||void 0===_OneOfObject$paramete2||null===(_OneOfObject$paramete2=_OneOfObject$paramete2.docs)||void 0===_OneOfObject$paramete2?void 0:_OneOfObject$paramete2.source)})}),InvalidOneOfObject.parameters=_objectSpread(_objectSpread({},InvalidOneOfObject.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_InvalidOneOfObject$p=InvalidOneOfObject.parameters)||void 0===_InvalidOneOfObject$p?void 0:_InvalidOneOfObject$p.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      one: 'input data'\n    },\n    schema: ({\n      oneOf: [{\n        type: 'object',\n        title: 'First Option',\n        required: ['one'],\n        properties: {\n          one: {\n            type: 'string',\n            title: 'Property One'\n          }\n        }\n      }, {\n        type: 'object',\n        title: 'Unselectable Second Option',\n        required: ['one'],\n        properties: {\n          one: {\n            type: 'string',\n            title: 'Property Two'\n          }\n        }\n      }]\n    } as JsonSchema)\n  }\n}"},null===(_InvalidOneOfObject$p2=InvalidOneOfObject.parameters)||void 0===_InvalidOneOfObject$p2||null===(_InvalidOneOfObject$p2=_InvalidOneOfObject$p2.docs)||void 0===_InvalidOneOfObject$p2?void 0:_InvalidOneOfObject$p2.source)})}),TypedOneOfObject.parameters=_objectSpread(_objectSpread({},TypedOneOfObject.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_TypedOneOfObject$par=TypedOneOfObject.parameters)||void 0===_TypedOneOfObject$par?void 0:_TypedOneOfObject$par.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    schema: ({\n      oneOf: [{\n        type: 'object',\n        title: 'Select A',\n        required: ['id', 'one'],\n        properties: {\n          id: {\n            type: 'string',\n            const: 'A'\n          },\n          one: {\n            type: 'string',\n            title: 'Property ID A'\n          }\n        }\n      }, {\n        type: 'object',\n        title: 'Select B',\n        required: ['id', 'one'],\n        properties: {\n          id: {\n            type: 'string',\n            const: 'B'\n          },\n          one: {\n            type: 'string',\n            title: 'Property ID B'\n          }\n        }\n      }]\n    } as JsonSchema)\n  }\n}"},null===(_TypedOneOfObject$par2=TypedOneOfObject.parameters)||void 0===_TypedOneOfObject$par2||null===(_TypedOneOfObject$par2=_TypedOneOfObject$par2.docs)||void 0===_TypedOneOfObject$par2?void 0:_TypedOneOfObject$par2.source)})}),OneOfProperty.parameters=_objectSpread(_objectSpread({},OneOfProperty.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_OneOfProperty$parame=OneOfProperty.parameters)||void 0===_OneOfProperty$parame?void 0:_OneOfProperty$parame.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      id: 'B',\n      one: 'B'\n    },\n    schema: ({\n      oneOfProperty: 'id',\n      oneOf: [{\n        type: 'object',\n        title: 'Select A',\n        required: ['id', 'one'],\n        properties: {\n          id: {\n            type: 'string',\n            const: 'A',\n            options: {\n              hidden: true\n            }\n          },\n          one: {\n            type: 'string',\n            title: 'Property ID A'\n          }\n        }\n      }, {\n        type: 'object',\n        title: 'Select B',\n        required: ['id', 'one'],\n        properties: {\n          id: {\n            type: 'string',\n            const: 'B',\n            options: {\n              hidden: true\n            }\n          },\n          one: {\n            type: 'string',\n            minLength: 2,\n            title: 'Property ID B'\n          }\n        }\n      }]\n    } as JsonSchema)\n  }\n}"},null===(_OneOfProperty$parame2=OneOfProperty.parameters)||void 0===_OneOfProperty$parame2||null===(_OneOfProperty$parame2=_OneOfProperty$parame2.docs)||void 0===_OneOfProperty$parame2?void 0:_OneOfProperty$parame2.source)})}),AllOf.parameters=_objectSpread(_objectSpread({},AllOf.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AllOf$parameters=AllOf.parameters)||void 0===_AllOf$parameters?void 0:_AllOf$parameters.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    data: {\n      title: 'five!'\n    },\n    schema: ({\n      type: 'object',\n      options: {\n        title: false\n      },\n      required: ['title'],\n      properties: {\n        title: {\n          type: 'string'\n        }\n      },\n      allOf: [{\n        properties: {\n          title: {\n            minLength: 1\n          }\n        }\n      }, {\n        properties: {\n          title: {\n            default: 'title',\n            minLength: 6\n          }\n        }\n      }]\n    } as JsonSchema)\n  }\n}"},null===(_AllOf$parameters2=AllOf.parameters)||void 0===_AllOf$parameters2||null===(_AllOf$parameters2=_AllOf$parameters2.docs)||void 0===_AllOf$parameters2?void 0:_AllOf$parameters2.source)})}),AllOfIfThen.parameters=_objectSpread(_objectSpread({},AllOfIfThen.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_AllOfIfThen$paramete=AllOfIfThen.parameters)||void 0===_AllOfIfThen$paramete?void 0:_AllOfIfThen$paramete.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    validate: true,\n    liveUpdate: true,\n    schema: ({\n      type: 'object',\n      options: {\n        title: false\n      },\n      properties: {\n        title: {\n          type: 'string',\n          default: 'four'\n        }\n      },\n      allOf: [{\n        if: {\n          type: 'object',\n          required: ['title'],\n          properties: {\n            title: {\n              minLength: 4\n            }\n          }\n        },\n        then: {\n          properties: {\n            title: {\n              pattern: '^[0-9]+$',\n              patternExample: 'a string with a length of 4+ should contain only numbers'\n            }\n          }\n        }\n      }]\n    } as JsonSchema)\n  }\n}"},null===(_AllOfIfThen$paramete2=AllOfIfThen.parameters)||void 0===_AllOfIfThen$paramete2||null===(_AllOfIfThen$paramete2=_AllOfIfThen$paramete2.docs)||void 0===_AllOfIfThen$paramete2?void 0:_AllOfIfThen$paramete2.source)})}),DependenciesList.parameters=_objectSpread(_objectSpread({},DependenciesList.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_DependenciesList$par=DependenciesList.parameters)||void 0===_DependenciesList$par?void 0:_DependenciesList$par.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    schema: ({\n      title: 'dependencies: { prop: [\"prop\"] }',\n      type: 'object',\n      properties: {\n        one: {\n          title: 'Property One',\n          type: 'string'\n        },\n        two: {\n          title: 'dependency',\n          type: 'string'\n        }\n      },\n      dependencies: {\n        one: ['two']\n      },\n      options: {\n        title: false\n      }\n    } as JsonSchema)\n  }\n}"},null===(_DependenciesList$par2=DependenciesList.parameters)||void 0===_DependenciesList$par2||null===(_DependenciesList$par2=_DependenciesList$par2.docs)||void 0===_DependenciesList$par2?void 0:_DependenciesList$par2.source)})}),DependenciesListActive.parameters=_objectSpread(_objectSpread({},DependenciesListActive.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_DependenciesListActi=DependenciesListActive.parameters)||void 0===_DependenciesListActi?void 0:_DependenciesListActi.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    data: {\n      one: 'input value'\n    },\n    addOptionalProps: false,\n    schema: ({\n      title: 'dependencies: { prop: [\"prop\"] }',\n      type: 'object',\n      required: ['one'],\n      properties: {\n        one: {\n          title: 'Property One',\n          type: 'string'\n        },\n        two: {\n          title: 'dependency',\n          type: 'string'\n        }\n      },\n      dependencies: {\n        one: ['two']\n      },\n      options: {\n        title: false\n      }\n    } as JsonSchema)\n  }\n}"},null===(_DependenciesListActi2=DependenciesListActive.parameters)||void 0===_DependenciesListActi2||null===(_DependenciesListActi2=_DependenciesListActi2.docs)||void 0===_DependenciesListActi2?void 0:_DependenciesListActi2.source)})}),Dependencies.parameters=_objectSpread(_objectSpread({},Dependencies.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Dependencies$paramet=Dependencies.parameters)||void 0===_Dependencies$paramet?void 0:_Dependencies$paramet.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    addOptionalProps: false,\n    schema: ({\n      title: 'dependencies: { prop: { schema } }',\n      type: 'object',\n      properties: {\n        one: {\n          title: 'Property One',\n          type: 'string'\n        }\n      },\n      dependencies: {\n        one: {\n          required: ['two'],\n          properties: {\n            two: {\n              title: 'dependency',\n              type: 'string'\n            }\n          }\n        }\n      },\n      options: {\n        title: false\n      }\n    } as JsonSchema)\n  }\n}"},null===(_Dependencies$paramet2=Dependencies.parameters)||void 0===_Dependencies$paramet2||null===(_Dependencies$paramet2=_Dependencies$paramet2.docs)||void 0===_Dependencies$paramet2?void 0:_Dependencies$paramet2.source)})}),DependenciesActive.parameters=_objectSpread(_objectSpread({},DependenciesActive.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_DependenciesActive$p=DependenciesActive.parameters)||void 0===_DependenciesActive$p?void 0:_DependenciesActive$p.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    addOptionalProps: false,\n    schema: ({\n      title: 'dependencies: { prop: { schema } }',\n      type: 'object',\n      required: ['one'],\n      properties: {\n        one: {\n          title: 'Property One',\n          type: 'string'\n        }\n      },\n      dependencies: {\n        one: {\n          required: ['two'],\n          properties: {\n            two: {\n              title: 'dependency',\n              type: 'string'\n            }\n          }\n        }\n      },\n      options: {\n        title: false\n      }\n    } as JsonSchema)\n  }\n}"},null===(_DependenciesActive$p2=DependenciesActive.parameters)||void 0===_DependenciesActive$p2||null===(_DependenciesActive$p2=_DependenciesActive$p2.docs)||void 0===_DependenciesActive$p2?void 0:_DependenciesActive$p2.source)})}),IfThenElse.parameters=_objectSpread(_objectSpread({},IfThenElse.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_IfThenElse$parameter=IfThenElse.parameters)||void 0===_IfThenElse$parameter?void 0:_IfThenElse$parameter.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    addOptionalProps: false,\n    schema: ({\n      type: 'object',\n      required: ['trigger'],\n      properties: {\n        trigger: {\n          title: 'Trigger',\n          type: 'boolean',\n          default: false\n        }\n      },\n      if: {\n        required: ['trigger'],\n        properties: {\n          trigger: {\n            const: true\n          }\n        }\n      },\n      then: {\n        properties: {\n          addition: {\n            type: 'string'\n          }\n        }\n      },\n      options: {\n        title: false\n      }\n    } as JsonSchema)\n  }\n}"},null===(_IfThenElse$parameter2=IfThenElse.parameters)||void 0===_IfThenElse$parameter2||null===(_IfThenElse$parameter2=_IfThenElse$parameter2.docs)||void 0===_IfThenElse$parameter2?void 0:_IfThenElse$parameter2.source)})}),IfThenElseActive.parameters=_objectSpread(_objectSpread({},IfThenElseActive.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_IfThenElseActive$par=IfThenElseActive.parameters)||void 0===_IfThenElseActive$par?void 0:_IfThenElseActive$par.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    addOptionalProps: false,\n    schema: ({\n      type: 'object',\n      required: ['trigger'],\n      properties: {\n        trigger: {\n          title: 'Trigger',\n          type: 'boolean',\n          default: false\n        }\n      },\n      if: {\n        required: ['trigger'],\n        properties: {\n          trigger: {\n            const: true\n          }\n        }\n      },\n      then: {\n        required: ['addition'],\n        properties: {\n          addition: {\n            type: 'string'\n          }\n        }\n      },\n      options: {\n        title: false\n      }\n    } as JsonSchema)\n  }\n}"},null===(_IfThenElseActive$par2=IfThenElseActive.parameters)||void 0===_IfThenElseActive$par2||null===(_IfThenElseActive$par2=_IfThenElseActive$par2.docs)||void 0===_IfThenElseActive$par2?void 0:_IfThenElseActive$par2.source)})}),IfThenElseSwitch.parameters=_objectSpread(_objectSpread({},IfThenElseSwitch.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_IfThenElseSwitch$par=IfThenElseSwitch.parameters)||void 0===_IfThenElseSwitch$par?void 0:_IfThenElseSwitch$par.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    className: 'rje-theme rje-theme--light',\n    addOptionalProps: false,\n    validate: true,\n    schema: (({\n      type: 'object',\n      required: ['switch'],\n      additionalProperties: false,\n      properties: {\n        switch: {\n          title: 'Switch',\n          type: 'boolean',\n          default: false\n        }\n      },\n      if: {\n        required: ['switch'],\n        properties: {\n          switch: {\n            const: false\n          }\n        }\n      },\n      then: {\n        required: ['then', 'number'],\n        properties: {\n          then: {\n            title: 'Then statement',\n            type: 'string'\n          },\n          number: {\n            title: 'Value in Then',\n            type: 'number',\n            minimum: 4\n          }\n        }\n      },\n      else: {\n        required: ['else', 'number'],\n        properties: {\n          else: {\n            title: 'Else statement',\n            type: 'string',\n            enum: ['option a', 'option b']\n          },\n          number: {\n            title: 'Value in Else',\n            type: 'number',\n            maximum: 4\n          }\n        }\n      },\n      options: {\n        title: false\n      }\n    } as unknown) as JsonSchema)\n  }\n}"},null===(_IfThenElseSwitch$par2=IfThenElseSwitch.parameters)||void 0===_IfThenElseSwitch$par2||null===(_IfThenElseSwitch$par2=_IfThenElseSwitch$par2.docs)||void 0===_IfThenElseSwitch$par2?void 0:_IfThenElseSwitch$par2.source)})});var __namedExportsOrder=["OptionalProperties","InitialOptionalProperty","AddOptionalProps","RequiredProperties","AdditionalProperties","AdditionalPropertiesFalse","AdditionalPropertiesSchema","EditJson","OneOfObject","InvalidOneOfObject","TypedOneOfObject","OneOfProperty","AllOf","AllOfIfThen","DependenciesList","DependenciesListActive","Dependencies","DependenciesActive","IfThenElse","IfThenElseActive","IfThenElseSwitch"]}}]);