import { getNodeList } from './getNodeList';
import { JsonError } from 'json-schema-library';
import { Node } from '../types';

const errorReducer = (previous: JsonError[], current: Node): JsonError[] => {
    previous.push(...current.errors);
    return previous;
};

export function getErrors(node: Node): JsonError[] {
    const nodes = getNodeList(node);
    return nodes.reduceRight(errorReducer, []);
}
