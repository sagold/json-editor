import { ArrayNode, Node, NodeType } from '../types';

/** update dynamic node options based on passed data - mainly used for array action-flags */
export function updateOptions(node: Node, data?: unknown) {
    UPDATE[node.type]?.(node, data);
}

const UPDATE: Partial<Record<NodeType, (node: Node, data?: unknown) => void>> = {
    array(node, data) {
        const schema = node.schema;
        node.options.required = schema.minItems != null && schema.minItems > 0;

        const length = Array.isArray(data) ? data.length : ((node as ArrayNode).children?.length ?? 0);

        node.options.canAddItem = true;
        if (schema.maxItems != null && length >= schema.maxItems) {
            node.options.canAddItem = false;
        }
        if (
            (schema.items === false || schema.additionalItems === false) &&
            (node.schemaNode.prefixItems ? length >= node.schemaNode.prefixItems.length : false)
        ) {
            node.options.canAddItem = false;
        }

        node.options.canRemoveItem = length === 0 ? false : schema.minItems ? schema.minItems < length : true;
    }
};
