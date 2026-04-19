import { JsonNode } from '../types';
import { getNodeList } from './getNodeList';

/**
 * array.find for syntax tree
 */
export function findNode(node: JsonNode, search: (node: JsonNode) => boolean): JsonNode | undefined {
    return getNodeList(node).find(search);
}
