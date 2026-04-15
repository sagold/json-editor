import { DataNode } from '../types';
import { getNodeList } from './getNodeList';

/**
 * array.find for syntax tree
 */
export function findNode(node: DataNode, search: (node: DataNode) => boolean): DataNode | undefined {
    return getNodeList(node).find(search);
}
