import{create}from"../../node/create";import{split,join}from"gson-pointer";import{isValueNode,isParentNode,isJSONError}from"../../types";import{invalidPathError}from"../../errors";import{getChildNodeIndex}from"../../node/getChildNode";import{getUpdatedData}from"./getUpdatedData";import{resolveIfThenElse}from"./resolveIfThenElse";import{resolveDependencies}from"./resolveDependencies";import{replaceChildNode}from"./replaceChildNode";import{resolveOneOf}from"./resolveOneOf";import{createChildNode}from"./createChildNode";import{updateValueNode}from"./updateValueNode";export function set(e,r,o,t){var n,i;const d=[],s=split(o);if(0===s.length){const o=create(e,t);return d.push({type:"delete",node:r}),d.push({type:"create",node:o}),o.id=r.id,[o,d]}const a={...r};let l=a,p=a,c="";for(;s.length>0;){if(!p||!isParentNode(p))return[invalidPathError({pointer:o,reason:"expected parent data to be object or array",where:"resolving json pointer to node in transform.change"})];if(p.schema.oneOf||p.schema.oneOfSchema){const r=getUpdatedData(l,join(c,s),t),o=resolveOneOf(e,l,c,r);if(o)return d.push(...o),[a,d]}if("array"===(null==p?void 0:p.type)&&(null===(i=null===(n=p.schema)||void 0===n?void 0:n.items)||void 0===i?void 0:i.oneOf)){const r=getUpdatedData(p,join(s),t),o=resolveOneOf(e,p,s[0],r);if(o)return d.push(...o),[a,d]}if("object"===(null==p?void 0:p.type)&&p.schema.if){const[r,o]=resolveIfThenElse(e,p,join(s),t);p=r,d.push(...o)}if("object"===(null==p?void 0:p.type)&&p.schema.dependencies){const[r,o]=resolveDependencies(e,p,s,t);p=r,d.push(...o)}p.children=[...p.children],c=s.shift();const r=getChildNodeIndex(p,c);r>=0?(p.children[r]={...p.children[r]},l=p,p=p.children[r]):(l=p,p=null)}if(!isParentNode(l))throw new Error(`Expected node '${l.pointer}' (${l.type}) to be object or array to set value on '${o}'`);if(null==p){const r=createChildNode(e,l,c,t);return isJSONError(r)?[r]:(d.push(...r),[a,d])}if(isValueNode(p)){const r=updateValueNode(e,l,p,t);return isJSONError(r)?[r]:(d.push(...r),[a,d])}if(isParentNode(p)){const r=replaceChildNode(e,l,p,t);return isJSONError(r)?[r]:(d.push(...r),[a,d])}throw new Error("Invalid state in transform.set")}