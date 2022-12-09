import { Draft, JSONError } from 'json-schema-library';
import { ParentNode, JSONSchema } from '../../types';
/**
 * get json-schema for node.children[property]
 *
 * @returns json-schema for a child at property of node
 */
export declare function getSchemaOfChild(draft: Draft, node: ParentNode, property: string, value: unknown): JSONSchema | JSONError;
