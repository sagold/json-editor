import { Node } from '../types';
import { getNodeList } from './getNodeList';

/**
 * array.find for syntax tree
 */
export function findNode(node: Node, search: (node: Node) => boolean): Node | undefined {
    return getNodeList(node).find(search);
}
