import { get } from "../node/get";
import { unlinkPath } from "../transform/unlinkPath";
import { Change, Node, StringNode, isChange, isJsonError } from "../types";
import { Plugin } from '../HeadlessEditor';

type StringEnumNode = StringNode & {
    schema: {
        enum: string[];
        options?: {
            enum?: string[];
        }
    }
}

function isStringNode(node: Node): node is StringNode {
    return node.schema.type === "string";
}

function isStringEnumNode(node: Node): node is StringEnumNode {
    return isStringNode(node) && Array.isArray(node?.schema?.enum);
}

const SCHEMA_KEY = "setOptionTitleTo";

/**
 * Add support to save selected option-title as value to another string-property.
 * On a string-selection with custom titles (string-enum) add an json-schema
 * keyword `setOptionTitleTo` with a json-pointer from root to target-value.
 *
 * e.g. { setOptionTitleTo: "#/main/menu/title" }
 *
 * Json-schema usage when adding this plugin:
 *
 * ```
 *  selection: {
 *    type: "string",
 *    enum: [1, 2, 3],
 *    options: {
 *      enum: ["One Title", "Two Title", "Three title"]
 *    },
 *    setOptionTitleTo: "#/title"
 *  },
 *  title: {
 *    type: "string",
 *    options: { disabled: true }
 *  }
 * ```
 */
export const SetOptionTitleToPlugin: Plugin = () => ({
    id: "set-option-title-to",
    onEvent(root, event) {
        if (!isChange(event) || event.node.schema[SCHEMA_KEY] == null || !isStringEnumNode(event.node)) {
            return undefined;
        }
        const node = event.node;
        const target = node.schema[SCHEMA_KEY];
        const index = node.schema!.enum!.indexOf(node.value as string);
        if (index < 0) {
            return undefined;
        }
        const value = node.schema.options?.enum?.[index];
        const result = unlinkPath(root, target); // @todo should return error in array
        if (isJsonError(result)) {
            return undefined;
        }
        const targetNode = get(result[0], target);
        if (targetNode) {
            // @ts-expect-error requires check for type of node
            targetNode.value = value;
            return [result[0], [{ type: "update", node: targetNode } as Change]];
        }
        return undefined;
    }
});
