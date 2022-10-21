import { JSONPointer } from 'json-schema-library';
import { Plugin, PluginInstance, PluginEvent } from '../HeadlessJsonEditor';
import { get, json, updateSchema, isJSONError, Change, Node } from '../index';

/**
 * prototypical plugin to support a dynamic enum for a schema like
 *
 * ```json
 * {
 *   type: "array",
 *   options: {
 *     syncEnum: {
 *       source: "#/pointer/to/string-list"
 *     }
 *   },
 *   items: {
 *     type: "string",
 *     enum: []
 *   }
 * }
 * ```
 */
export const RemoteEnumOptionsPlugin: Plugin = (he, options) => {
    const sources: Record<string, JSONPointer> = {};
    const targets: Record<string, JSONPointer> = {};

    function updateEnumInSchema(root: Node, changedNode: Node) {
        const sourceNode = get(root, targets[changedNode.pointer]);
        if (isJSONError(sourceNode)) {
            return;
        }
        const enumValues = (json(sourceNode) as string[]).filter((v: unknown) => !(v == null || v === ''));
        const [newRoot, additionalChanges] = updateSchema(root, changedNode.pointer, {
            ...changedNode.schema,
            items: {
                // @ts-ignore
                ...changedNode.schema.items,
                enum: enumValues
            }
        });
        if (isJSONError(newRoot)) {
            return undefined;
        }
        return [newRoot, additionalChanges] as [Node, Change[]];
    }

    const plugin: PluginInstance = {
        id: 'remoteEnumOptions',
        onEvent(root: Node, event: PluginEvent) {
            if (event.type === 'create' && event.node.options.syncEnum) {
                // @ts-ignore
                const source = get(root, event.node.options.syncEnum.source);
                if (!isJSONError(source)) {
                    sources[source.pointer] = event.node.pointer;
                    targets[event.node.pointer] = source.pointer;
                    return updateEnumInSchema(root, event.node);
                }
            }

            if (event.type === 'update') {
                const parentPointer = event.node.pointer;
                if (targets[event.node.pointer]) {
                    return updateEnumInSchema(root, event.node);
                } else if (sources[parentPointer]) {
                    const targetNode = get(root, sources[parentPointer]);
                    if (!isJSONError(targetNode)) {
                        return updateEnumInSchema(root, targetNode);
                    }
                }
            }
            return undefined;
        }
    };
    return plugin;
};
