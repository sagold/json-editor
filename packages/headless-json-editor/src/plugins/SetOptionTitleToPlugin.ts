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
