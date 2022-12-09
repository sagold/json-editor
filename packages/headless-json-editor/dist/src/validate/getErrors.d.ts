import { Draft, JSONPointer, JSONError } from 'json-schema-library';
import { Node } from '../types';
/**
 * validate current node and return the validation errors
 */
export declare function getErrors(draft: Draft, root: Node, pointer?: JSONPointer): JSONError | (JSONError | Promise<JSONError | undefined>)[];
/**
 * splits validation errors into errors and async errors
 */
export declare function splitErrors(errors: (JSONError | Promise<JSONError | undefined>)[]): [JSONError[], Promise<JSONError[]>[]];
