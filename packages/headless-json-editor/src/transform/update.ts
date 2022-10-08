import { JSONError } from 'json-schema-library';
import { Node, isJSONError, Change, JSONSchema } from '../types';
import { unlinkPath } from './unlinkPath';
import { DefaultNodeOptions } from '../node/create';

/**
 * updates schema of a node
 */
export function updateSchema(rootNode: Node, pointer: string, schema: JSONSchema): [JSONError] | [Node, Change[]] {
    const result = unlinkPath(rootNode, pointer);
    if (isJSONError(result)) {
        return [result];
    }

    const [root, targetNode] = result;
    targetNode.schema = schema;

    return [root, [{ type: 'update', node: targetNode }]];
}

/**
 * updates options of a node
 */
export function updateOptions(
    rootNode: Node,
    pointer: string,
    options: DefaultNodeOptions
): [JSONError] | [Node, Change[]] {
    const result = unlinkPath(rootNode, pointer);
    if (isJSONError(result)) {
        return [result];
    }

    const [root, targetNode] = result;
    targetNode.options = options;

    return [root, [{ type: 'update', node: targetNode }]];
}
