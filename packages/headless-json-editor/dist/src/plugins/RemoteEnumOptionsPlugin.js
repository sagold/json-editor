import { get, json, updateSchema, isJSONError } from '../index';
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
export const RemoteEnumOptionsPlugin = (he, options) => {
    const sources = {};
    const targets = {};
    function updateEnumInSchema(root, changedNode) {
        const sourceNode = get(root, targets[changedNode.pointer]);
        if (isJSONError(sourceNode)) {
            return;
        }
        const enumValues = json(sourceNode).filter((v) => !(v == null || v === ''));
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
        return [newRoot, additionalChanges];
    }
    const plugin = {
        id: 'remoteEnumOptions',
        onEvent(root, event) {
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
                }
                else if (sources[parentPointer]) {
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
//# sourceMappingURL=RemoteEnumOptionsPlugin.js.map