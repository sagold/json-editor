import gp from"gson-pointer";import{invalidPathError}from"../errors";import{getChildNode}from"./getChildNode";export function get(t,r){return step(t,gp.split(r),[])}function step(t,r,o){if(0===r.length)return t;const e=r.shift();o.push(e);const i=getChildNode(t,e);return i?step(i,r,o):invalidPathError({pointer:gp.join(o)})}