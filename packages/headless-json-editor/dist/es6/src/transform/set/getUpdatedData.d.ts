import { Node } from '../../types';
/**
 * @param node - node from which to retrieve basic data
 * @param pointerToValue - json-pointer from node to value
 * @param value
 * @returns data of node with changed value at given pointerToValue
 */
export declare function getUpdatedData<T = unknown>(node: Node, pointerToValue: string, value: unknown): T;
