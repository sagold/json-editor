const NodeTypes = ['array', 'object', 'string', 'number', 'null', 'boolean'];
export function isNode(node) {
    return NodeTypes.includes(node === null || node === void 0 ? void 0 : node.type);
}
export function isParentNode(node) {
    return node.type === 'array' || node.type === 'object';
}
export function isValueNode(node) {
    return node.type === 'string' || node.type === 'number' || node.type === 'null' || node.type === 'boolean';
}
export { isJSONError } from 'json-schema-library';
//# sourceMappingURL=types.js.map