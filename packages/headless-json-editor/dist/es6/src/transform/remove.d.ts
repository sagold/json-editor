import { JSONPointer, JSONError } from 'json-schema-library';
import { Node, Change } from '../types';
export declare function remove(previousRoot: Node, pointer: JSONPointer): [JSONError] | [Node, Change[]];
