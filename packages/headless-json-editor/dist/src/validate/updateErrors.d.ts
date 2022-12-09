import { Draft, JSONPointer, JSONError } from 'json-schema-library';
import { Node } from '../types';
/**
 * perform validation and assign errors to corresponding nodes
 */
export declare function updateErrors(draft: Draft, root: Node, pointer?: JSONPointer): Promise<JSONError | JSONError[][]>;
