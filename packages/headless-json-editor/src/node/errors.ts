import { flat } from './flat';
import { JSONError } from 'json-schema-library';
import { Node } from './types';

const errorReducer = (previous: JSONError[], current: Node): JSONError[] => {
    previous.push(...current.errors);
    return previous;
};

export function errors(node: Node): JSONError[] {
    const nodes = flat(node);
    return nodes.reduceRight(errorReducer, []);
}
