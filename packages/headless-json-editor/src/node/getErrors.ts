import { getNodeList } from './getNodeList';
import { JsonError } from 'json-schema-library';
import { DataNode } from '../types';

const errorReducer = (previous: JsonError[], current: DataNode): JsonError[] => {
    previous.push(...current.errors);
    return previous;
};

export function getErrors(node: DataNode): JsonError[] {
    const nodes = getNodeList(node);
    return nodes.reduceRight(errorReducer, []);
}
