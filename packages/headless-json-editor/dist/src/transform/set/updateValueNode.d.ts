import { Draft } from 'json-schema-library';
import { ValueNode, ParentNode, Change } from '../../types';
/**
 * updates or repalces value node
 */
export declare function updateValueNode(draft: Draft, parent: ParentNode, child: ValueNode, value: any): import("json-schema-library").JSONError | Change[];
