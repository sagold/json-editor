import { Node, isParentNode } from "../../types";
import { JsonSchema } from "../../jsonSchema";

function isSimilarSchema(a: JsonSchema, b: JsonSchema) {
    return a.type === b.type;
}

export function syncNodes(from: Node, to: Node) {
    if (from == null || to == null) {
        return;
    }
    if (isSimilarSchema(from.schema, to.schema)) {
        to.id = from.id;
    } else {
    }
    if (from.type === to.type) {
        if (isParentNode(to) && isParentNode(from)) {
            to.children.forEach((child, index) => syncNodes(from.children[index], child));
            return;
        }
    }
}
