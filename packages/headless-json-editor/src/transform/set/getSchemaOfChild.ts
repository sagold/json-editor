import { Draft, JsonError } from 'json-schema-library';
import { ParentNode, isJsonError, JsonSchema } from '../../types';
import { getData } from '../../node/getData';

type UnknownObject = Record<string, unknown>;

/**
 * get json-schema for node.children[property]
 *
 * @returns json-schema for a child at property of node
 */
export function getSchemaOfChild(
    draft: Draft,
    node: ParentNode,
    property: string,
    value: unknown
): JsonSchema | JsonError {
    const data = getData(node) as UnknownObject;
    data[property] = value;
    const schemaNode = draft.step(draft.createNode(node.schema, node.pointer), property, data);
    // unknown property in schema
    if (isJsonError(schemaNode)) {
        if (schemaNode.code !== 'unknown-property-error') {
            console.log(`failed retrieving schema for '${node.pointer}/${property}'`);
            console.log(schemaNode);
            return schemaNode;
        }
        return draft.createSchemaOf(value);
    }
    return schemaNode.schema;
}
