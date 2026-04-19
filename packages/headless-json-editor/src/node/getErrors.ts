import { getNodeList } from './getNodeList';
import { JsonError } from 'json-schema-library';
import { JsonNode } from '../types';

const errorReducer = (previous: JsonError[], current: JsonNode): JsonError[] => {
    previous.push(...current.errors);
    return previous;
};

export function getErrors(node: JsonNode): JsonError[] {
    const nodes = getNodeList(node);
    return nodes.reduceRight(errorReducer, []);
}
