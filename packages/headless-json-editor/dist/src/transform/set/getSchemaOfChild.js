import { isJSONError } from '../../types';
import { json } from '../../node/json';
/**
 * get json-schema for node.children[property]
 *
 * @returns json-schema for a child at property of node
 */
export function getSchemaOfChild(draft, node, property, value) {
    const data = json(node);
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
//# sourceMappingURL=getSchemaOfChild.js.map