import { Node, StringNode, isChangeEvent, isJsonError } from '../types';
import { Plugin } from '../HeadlessEditor';
import { setValue } from '../transform/setValue';

type StringEnumNode = StringNode & {
    schema: {
        enum: string[];
        options?: {
            enum?: string[];
        };
    };
};

function isStringNode(node: Node): node is StringNode {
    return node.schema.type === 'string';
}

function isStringEnumNode(node: Node): node is StringEnumNode {
    return isStringNode(node) && Array.isArray(node?.schema?.enum);
}

const SCHEMA_KEY = 'setOptionTitleTo';

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
    id: 'set-option-title-to',
    onEvent(root, event) {
        if (!isChangeEvent(event) || event.node.schema[SCHEMA_KEY] == null || !isStringEnumNode(event.node)) {
            return undefined;
        }
        const node = event.node;
        const target = node.schema[SCHEMA_KEY];
        const index = node.schema!.enum!.indexOf(node.value as string);
        if (index < 0) {
            return undefined;
        }
        const value = node.schema.options?.enum?.[index];
        const [newAST, changes] = setValue(root, target, value);
        if (isJsonError(newAST)) {
            console.log('SetOptionTitleToPlugin error:', newAST);
            return undefined;
        }
        return [newAST, changes ?? []];
    }
});
