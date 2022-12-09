import { Draft } from 'json-schema-library';
import { ParentNode, Change } from '../../types';
/**
 * creates a new child node for the given property. Expects that no child node
 * is present at 'property'
 */
export declare function createChildNode(draft: Draft, node: ParentNode, property: string, value: unknown): import("json-schema-library").JSONError | Change[];
