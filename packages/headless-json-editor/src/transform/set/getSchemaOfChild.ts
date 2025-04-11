import { ParentNode } from '../../types';
import { getData } from '../../node/getData';

type UnknownObject = Record<string, unknown>;

/**
 * get json-schema for node.children[property]
 *
 * @returns json-schema for a child at property of node
 */
export function getSchemaOfChild(node: ParentNode, property: string, value: unknown) {
    const data = getData(node) as UnknownObject;
    data[property] = value;
    const { node: schemaNode, error } = node.schemaNode.getNodeChild(property, data, { createSchema: true });
    // unknown property in schema
    if (error) {
        if (error.code !== 'unknown-property-error') {
            console.log(`failed retrieving schema for '${node.pointer}/${property}'`, error);
            return error;
        }
        return node.schemaNode.compileSchema(node.schemaNode.createSchema(value));
    }
    if (schemaNode == null) {
        // @todo not happening because of createSchema: true
        return node.schemaNode.createError('schema-warning', {
            pointer: `${node.pointer}/${property}`,
            schema: node.schema,
            value
        });
    }
    return schemaNode;
}
