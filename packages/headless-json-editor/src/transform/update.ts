import { JsonError } from 'json-schema-library';
import { Node, isJsonError, Change, JsonSchema } from '../types';
import { unlinkPath } from './unlinkPath';
import { DefaultNodeOptions } from '../node/create';

/**
 * updates schema of a node
 */
export function updateSchema(rootNode: Node, pointer: string, schema: JsonSchema): [JsonError] | [Node, Change[]] {
    const result = unlinkPath(rootNode, pointer);
    if (isJsonError(result)) {
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
): [JsonError] | [Node, Change[]] {
    const result = unlinkPath(rootNode, pointer);
    if (isJsonError(result)) {
        return [result];
    }

    const [root, targetNode] = result;
    targetNode.options = options;

    return [root, [{ type: 'update', node: targetNode }]];
}
