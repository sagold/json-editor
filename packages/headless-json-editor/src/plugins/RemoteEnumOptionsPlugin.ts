import { JsonPointer } from 'json-schema-library';
import { Plugin, PluginInstance } from '../HeadlessEditor';
import { get, getData, updateSchema, isJsonError, Change, Node } from '../index';
import { PluginEvent } from "../types";

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
export const RemoteEnumOptionsPlugin: Plugin = () => {
    const sources: Record<string, JsonPointer> = {};
    const targets: Record<string, JsonPointer> = {};

    function updateEnumInSchema(root: Node, changedNode: Node) {
        const sourceNode = get(root, targets[changedNode.pointer]);
        if (isJsonError(sourceNode)) {
            return;
        }
        const enumValues = (getData(sourceNode) as string[]).filter((v: unknown) => !(v == null || v === ''));
        const [newRoot, additionalChanges] = updateSchema(root, changedNode.pointer, {
            ...changedNode.schema,
            items: {
                // @ts-ignore
                ...changedNode.schema.items,
                enum: enumValues
            }
        });
        if (isJsonError(newRoot)) {
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
                if (!isJsonError(source)) {
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
                    if (!isJsonError(targetNode)) {
                        return updateEnumInSchema(root, targetNode);
                    }
                }
            }
            return undefined;
        }
    };
    return plugin;
};
