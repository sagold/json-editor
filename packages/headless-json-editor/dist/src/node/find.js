import { flat } from './flat';
/**
 * array.find for syntax tree
 */
export function find(node, search) {
    return flat(node).find(search);
}
//# sourceMappingURL=find.js.map