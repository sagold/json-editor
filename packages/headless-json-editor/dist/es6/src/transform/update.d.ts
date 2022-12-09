import { JSONError } from 'json-schema-library';
import { Node, Change, JSONSchema } from '../types';
import { DefaultNodeOptions } from '../node/create';
/**
 * updates schema of a node
 */
export declare function updateSchema(rootNode: Node, pointer: string, schema: JSONSchema): [JSONError] | [Node, Change[]];
/**
 * updates options of a node
 */
export declare function updateOptions(rootNode: Node, pointer: string, options: DefaultNodeOptions): [JSONError] | [Node, Change[]];
