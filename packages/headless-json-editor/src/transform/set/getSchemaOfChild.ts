import { Draft, JSONError } from 'json-schema-library';
import { ParentNode, isJSONError, JSONSchema } from '../../types';
import { json } from '../../node/json';

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
): JSONSchema | JSONError {
    const data = json(node) as UnknownObject;
    data[property] = value;
    const schema = draft.step(property, node.schema, data, node.pointer);
    // unknown property in schema
    if (isJSONError(schema)) {
        if (schema.code !== 'unknown-property-error') {
            console.log(`failed retrieving schema for '${node.pointer}/${property}'`);
            console.log(schema);
            return schema;
        }
        return draft.createSchemaOf(value);
    }
    return schema;
}
