import { flat } from './flat';
const errorReducer = (previous, current) => {
    previous.push(...current.errors);
    return previous;
};
export function errors(node) {
    const nodes = flat(node);
    return nodes.reduceRight(errorReducer, []);
}
//# sourceMappingURL=errors.js.map