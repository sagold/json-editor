import{json}from"../node/json";export const OnChangePlugin=(n,o)=>{const e=o.onChange;if("function"!=typeof e)return;return{id:"onChange",onEvent(n,o){"done"===o.type&&e(json(n),n)}}};