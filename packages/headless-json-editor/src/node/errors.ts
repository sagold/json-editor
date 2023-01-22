import { flat } from './flat';
import { JsonError } from 'json-schema-library';
import { Node } from '../types';

const errorReducer = (previous: JsonError[], current: Node): JsonError[] => {
    previous.push(...current.errors);
    return previous;
};

export function errors(node: Node): JsonError[] {
    const nodes = flat(node);
    return nodes.reduceRight(errorReducer, []);
}
