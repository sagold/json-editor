import{getChildNode}from"./getChildNode";import{split}from"gson-pointer";export function trace(t,e){const o=split(e).reverse(),r=[t];let i=t;for(;o.length;){const t=o.pop(),e=getChildNode(i,t);if(void 0===e)return r;i=e,r.push(i)}return r}