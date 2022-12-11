import { Draft } from 'json-schema-library';
import { Node, ObjectNode, Change, JSONSchema } from '../../types';
import { create } from '../../node/create';
import { json } from '../../node/json';
import { set as setPointer } from 'gson-pointer';
import { settings } from '../../settings';

const { TEMPLATE_OPTIONS } = settings;

/**
 * simple deep copy of object or array
 */
const copy = <T = any>(value: T): T => JSON.parse(JSON.stringify(value));

/**
 * resolves schema containing if-then-else. will modifiy input 'node' by changed
 * schema.
 *
 * @returns possibly changed input node and list of changes
 */
export function resolveIfThenElse(
    draft: Draft,
    node: ObjectNode,
    pointerToValue: string,
    value: unknown
): [ObjectNode, Change[]] {
    if (!node.schema.if || !(node.schema.then || node.schema.else)) {
        return [node, []];
    }

    const changeSet: Change[] = [];
    const thenSchema = { type: 'object', ...(node.schema.then as JSONSchema) } as JSONSchema;
    const elseSchema = { type: 'object', ...(node.schema.else as JSONSchema) } as JSONSchema;

    const currentTargetData = json(node);
    const currentIsValid = draft.isValid(currentTargetData, node.schema.if as JSONSchema);

    let newTargetData = setPointer(copy(currentTargetData), pointerToValue, value);
    const newTargetValid = draft.isValid(newTargetData, node.schema.if as JSONSchema);

    // only update children on changed if-result
    if (currentIsValid === newTargetValid) {
        return [node, changeSet];
    }

    const currentSchema = currentIsValid ? thenSchema : elseSchema;
    const newSchema = newTargetValid ? thenSchema : elseSchema;

    const currentNodes = create<ObjectNode>(draft, currentTargetData, currentSchema, node.pointer);
    const currentPointers = currentNodes.children.map((c) => c.pointer);

    // remove previous schema
    node.children = node.children.filter((child) => {
        const keepChild = !currentPointers.includes(child.pointer);
        if (keepChild === false) {
            // @change delete node
            changeSet.push({
                type: 'delete',
                node: child
            });
        }
        return keepChild;
    });

    newTargetData = draft.getTemplate(newTargetData, newSchema, TEMPLATE_OPTIONS);
    const newNodes: Node[] = create<ObjectNode>(draft, newTargetData, newSchema, node.pointer).children;
    // @change create nodes
    changeSet.push(...newNodes.map((node): Change => ({ type: 'create', node })));
    node.children = node.children.concat(...newNodes);

    return [node, changeSet];
}
