import { Draft } from 'json-schema-library';
import { ParentNode, Change } from '../../types';
/**
 * replaces child node in given parent node
 */
export declare function replaceChildNode(core: Draft, parent: ParentNode, child: ParentNode, value: unknown): import("json-schema-library").JSONError | Change[];
