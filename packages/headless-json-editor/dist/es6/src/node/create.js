import{v4 as uuid}from"uuid";import{getTypeOf,isJSONError}from"json-schema-library";export function getOptions(e,t){var r;const o=null!==(r=e.options)&&void 0!==r?r:{},i={title:e.title||t,description:e.description,disabled:!1===e.isActive||!1,hidden:!1,...o};return!1===o.showTitle&&delete i.title,!1===o.showDescription&&delete i.description,i}function getPropertyName(e){return e.split("/").pop()}function isObject(e){return"object"===getTypeOf(e)}export const NODES={array:(e,t,r,o)=>{const i=getPropertyName(o),n={id:uuid(),type:"array",pointer:o,property:i,schema:r,options:{...getOptions(r,i),required:null!=r.minItems&&r.minItems>0},children:[],errors:[]};return t.forEach(((i,s)=>{const p=e.step(s,r,t,o);n.children.push(create(e,i,p,`${o}/${s}`))})),n},object:(e,t,r,o)=>{const i=getPropertyName(o),n={id:uuid(),type:"object",pointer:o,property:i,schema:r,options:getOptions(r,i),children:[],errors:[]};r.allOf&&(r=e.resolveAllOf(t,r),t=e.getTemplate(t,r));let s=t,p=r.properties;if(isObject(r.dependencies)){const o=r.dependencies;Object.keys(o).forEach((r=>{var i,n;const c=o[r];if(!isObject(c))return;c.type="object";const l=t[r],u="string"==typeof l?l.length>0:null!=l,a=e.getTemplate({},c);s={...a,...t},Object.keys(c.properties).forEach((e=>{c.properties[e].isActive=u,c.properties[e].isDynamic=!0})),p={...p,...null!==(i=c.properties)&&void 0!==i?i:{}};const d=Object.keys(p),y=Object.keys(null!==(n=c.properties)&&void 0!==n?n:{}),m={};for(let e=0;e<d.length;e+=1){const t=d[e];m[t]=p[t],t===r&&y.forEach((e=>{m[e]=c.properties[e]}))}p=m}))}if(isObject(r.if)&&(r.then||r.else)){const t=e.isValid(s,r.if),o=t&&r.then||!t&&r.else;if(isObject(o)){const t=o.properties;if(isObject(t)){const r=e.getTemplate({},{type:"object",...o});s={...r,...s},p={...p,...t}}}}if(Object.keys(s).forEach((t=>{const i=e.step(t,r,s,o);isJSONError(i)||n.children.push(create(e,s[t],i,`${o}/${t}`))})),p){const e=Object.keys(p);console.log("sort props",e),n.children.sort(((t,r)=>e.indexOf(t.property)-e.indexOf(r.property)))}return n},string:(e,t,r,o)=>{const i=getPropertyName(o);return{id:uuid(),type:"string",pointer:o,property:i,options:{...getOptions(r,i),required:null!=r.minLength&&r.minLength>0},schema:r,value:t,errors:[]}},number:(e,t,r,o)=>{const i=getPropertyName(o);return{id:uuid(),type:"number",pointer:o,property:i,options:getOptions(r,i),schema:r,value:t,errors:[]}},boolean:(e,t,r,o)=>{const i=getPropertyName(o);return{id:uuid(),type:"boolean",pointer:o,property:i,options:getOptions(r,i),schema:r,value:t,errors:[]}},null:(e,t,r,o)=>{const i=getPropertyName(o);return{id:uuid(),type:"null",pointer:o,property:i,options:getOptions(r,i),schema:r,value:t,errors:[]}}};export function create(e,t,r=e.rootSchema,o="#"){const i=null==t?"null":getTypeOf(null!=t?t:r.const);if(NODES[i])return NODES[i](e,t,r,o);throw new Error(`unsupported datatype '${i}' in create node`)}