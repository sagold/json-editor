import { Draft } from 'json-schema-library';
import { ObjectNode, Change } from '../../types';
/**
 * resolves schema containing dependencies. will modifiy input 'node' by changed
 * schema.
 *
 * @returns possibly changed input node and list of changes
 */
export declare function resolveDependencies(draft: Draft, node: ObjectNode, pointerToValue: string[], value: unknown): [ObjectNode, Change[]];
