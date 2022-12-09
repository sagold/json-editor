import { Draft } from 'json-schema-library';
import { ParentNode, Change } from '../../types';
declare type UnknownParentData = Record<string, unknown> | unknown[];
/**
 * resolves an oneOf schema. It will update the given parent node with the new
 * child or return undefined if no changes were made.
 *
 * @param draft
 * @param parent - parent object or array containing oneOf definitions
 * @param property - index of child item to update
 * @param data - udpated data (next value) of parent object or array
 * @returns undefined if the schema has not changed or a list of changes if the child item was replaced
 */
export declare function resolveOneOf(draft: Draft, parent: ParentNode, property: string, data: UnknownParentData): Change[] | undefined;
export {};
