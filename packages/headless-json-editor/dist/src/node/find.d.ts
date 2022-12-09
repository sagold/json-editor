import { Node } from '../types';
/**
 * array.find for syntax tree
 */
export declare function find(node: Node, search: (node: Node) => boolean): Node | undefined;
