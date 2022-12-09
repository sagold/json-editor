import { create } from '../../node/create';
import { json } from '../../node/json';
import { set as setPointer } from 'gson-pointer';
/**
 * simple deep copy of object or array
 */
const copy = (value) => JSON.parse(JSON.stringify(value));
/**
 * resolves schema containing if-then-else. will modifiy input 'node' by changed
 * schema.
 *
 * @returns possibly changed input node and list of changes
 */
export function resolveIfThenElse(draft, node, pointerToValue, value) {
    if (!node.schema.if || !(node.schema.then || node.schema.else)) {
        return [node, []];
    }
    const changeSet = [];
    const thenSchema = { type: 'object', ...node.schema.then };
    const elseSchema = { type: 'object', ...node.schema.else };
    const currentTargetData = json(node);
    const currentIsValid = draft.isValid(currentTargetData, node.schema.if);
    let newTargetData = setPointer(copy(currentTargetData), pointerToValue, value);
    const newTargetValid = draft.isValid(newTargetData, node.schema.if);
    // only update children on changed if-result
    if (currentIsValid === newTargetValid) {
        return [node, changeSet];
    }
    const currentSchema = currentIsValid ? thenSchema : elseSchema;
    const newSchema = newTargetValid ? thenSchema : elseSchema;
    const currentNodes = create(draft, currentTargetData, currentSchema, node.pointer);
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
    newTargetData = draft.getTemplate(newTargetData, newSchema);
    const newNodes = create(draft, newTargetData, newSchema, node.pointer).children;
    // @change create nodes
    changeSet.push(...newNodes.map((node) => ({ type: 'create', node })));
    node.children = node.children.concat(...newNodes);
    return [node, changeSet];
}
//# sourceMappingURL=resolveIfThenElse.js.map