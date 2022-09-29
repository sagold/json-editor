import { Node } from '../types';
import { flat } from './flat';

/**
 * array.find for syntax tree
 */
export function find(node: Node, search: (node: Node) => boolean): Node | undefined {
    return flat(node).find(search);
}
