import gp from"gson-pointer";const POINTER_PREFIX="#/";function ensurePointer(e){return e.replace(/^[#/]*/,"#/")}export function updatePath(e,r,t){const n={...e};return r=ensurePointer(r),n.property=t,n.pointer=gp.join(r,t),"array"===n.type?n.children=n.children.map(((e,r)=>updatePath(e,n.pointer,`${r}`))):"object"===n.type&&(n.children=n.children.map(((e,r)=>updatePath(e,n.pointer,e.property)))),n}