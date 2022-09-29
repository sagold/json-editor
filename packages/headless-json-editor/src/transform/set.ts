import { Draft, JSONPointer, JSONSchema, JSONError } from 'json-schema-library';
import {
    Node,
    ObjectNode,
    ArrayNode,
    isValueNode,
    isParentNode,
    isJSONError,
    ParentNode,
    isNode,
    Change
} from '../node/types';
import { create } from '../node/create';
import { json } from '../node/json';
import { split, set as setPointer, join } from 'gson-pointer';
import { invalidPathError } from '../errors';
import { getChildNodeIndex } from '../node/getChildNode';
import { deepEqual } from 'fast-equals';

function getSchemaOfChild(draft: Draft, parentNode: Node, childProperty: string, value: any): JSONSchema | JSONError {
    const data = json(parentNode);
    data[childProperty] = value;
    const schema = draft.step(childProperty, parentNode.schema, data, parentNode.pointer);
    // unknown property in schema
    if (isJSONError(schema)) {
        if (schema.code !== 'unknown-property-error') {
            console.log(`failed retrieving schema for '${parentNode.pointer}/${childProperty}'`);
            console.log(schema);
            return schema;
        }
        return draft.createSchemaOf(value);
    }
    return schema;
}

/**
 * set (add, update) given data to location of json pointer
 */
export function set(
    core: Draft,
    previousRoot: ParentNode,
    pointer: JSONPointer,
    value: any
): [JSONError] | [ParentNode, Change[]] {
    const changeSet: Change[] = [];
    const frags = split(pointer);
    const newRootNode = { ...previousRoot };
    let parentNode: Node = newRootNode; // @todo this might be really bad
    let targetIndex = -1;
    let targetNode: Node | null = newRootNode;
    let childProperty = ''; // @todo this might be really bad
    while (frags.length > 0) {
        if (!targetNode || !isParentNode(targetNode)) {
            return [
                invalidPathError({
                    pointer,
                    reason: 'expected parent data to be object or array',
                    where: 'resolving json pointer to node in transform.change'
                })
            ];
        }

        // in case our current node has a oneOf statement, the schema might
        // change and must replace the whole subtree
        if (targetNode.schema.oneOf || targetNode.schema.oneOfSchema) {
            // build new data starting from parentNode
            const dataFromParentNode = json(parentNode);
            setPointer(dataFromParentNode, join(childProperty, frags), value);
            // we know that the previoius node has to be a parent
            const parent = parentNode as ObjectNode | ArrayNode;
            // from parent retrieve the new oneOf schema
            const childSchema = core.step(childProperty, parentNode.schema, dataFromParentNode, parentNode.pointer);
            // in case the schema is different, replace the subtree and return
            let index = getChildNodeIndex(parentNode, childProperty);
            if (index === -1) {
                index = parent.type === 'array' ? parseInt(childProperty) : parent.children.length;
            }

            const currentSchema = parent.children[index]?.schema;
            if (currentSchema == null || !deepEqual(childSchema, currentSchema)) {
                // @change replace node
                if (isNode(parent.children[index])) {
                    changeSet.push({
                        type: 'delete',
                        node: parent.children[index]
                    });
                }
                parent.children[index] = create(
                    core,
                    dataFromParentNode[childProperty],
                    childSchema,
                    `${parentNode.pointer}/${childProperty}`
                );
                // @change create node
                changeSet.push({
                    type: 'create',
                    node: parent.children[index]
                });
                return [newRootNode, changeSet];
            }
        }

        // unlink children of current node
        targetNode.children = [...targetNode.children];
        childProperty = frags.shift() as string;
        targetIndex = getChildNodeIndex(targetNode, childProperty);

        if (targetIndex >= 0) {
            // unlink and assign next child node
            // @todo unnecessary unlink for last target node
            targetNode.children[targetIndex] = {
                ...targetNode.children[targetIndex]
            };
            // update nodes for next iteration of end result
            parentNode = targetNode;
            targetNode = targetNode.children[targetIndex];
        } else {
            // targetIndex = parentNode.type === 'object' ? targetNode.children.length : parseInt(childProperty);
            // new node
            parentNode = targetNode;
            targetNode = null;
        }

        const itemsSchema: any = parentNode.schema?.items;
        if (itemsSchema?.oneOf) {
            // build new data starting from parentNode
            const dataFromParentNode = json(parentNode);
            setPointer(dataFromParentNode, join(childProperty, frags), value);
            // from parent retrieve the new oneOf schema
            const childSchema = core.step(childProperty, parentNode.schema, dataFromParentNode, parentNode.pointer);

            // we know that the previoius node has to be a array parent
            const parent = parentNode as ArrayNode;
            const currentSchema = parent.children[childProperty]?.schema;
            if (currentSchema == null || !deepEqual(childSchema, currentSchema)) {
                // @change replace node
                if (isNode(parent.children[childProperty])) {
                    changeSet.push({
                        type: 'delete',
                        node: parent.children[childProperty]
                    });
                }
                parent.children[childProperty] = create(
                    core,
                    dataFromParentNode[childProperty],
                    childSchema,
                    `${parentNode.pointer}/${childProperty}`
                );
                // @change create node
                changeSet.push({
                    type: 'create',
                    node: parent.children[childProperty]
                });
                return [newRootNode, changeSet];
            }
        }
    }

    // new property or item
    if (targetNode == null) {
        if (parentNode.type === 'array' && `${parseInt(childProperty)}` !== childProperty) {
            return [
                invalidPathError({
                    pointer,
                    reason: `child property '${childProperty}' to array is not a number`,
                    where: 'resolving target node in transform.change'
                })
            ];
        }

        const schema = getSchemaOfChild(core, parentNode, childProperty, value);
        if (isJSONError(schema)) {
            return [schema];
        }

        const childPointer = `${parentNode.pointer}/${childProperty}`;
        const childIndex = parentNode.type === 'object' ? parentNode.children.length : childProperty;
        (parentNode as ObjectNode).children[childIndex] = create(core, value, schema, childPointer);
        // @change create node
        changeSet.push({
            type: 'create',
            node: (parentNode as ObjectNode).children[childIndex]
        });
        return [newRootNode, changeSet];
    }

    // simple node update, targetNode has already been unlinked/cloned
    if (isValueNode(targetNode)) {
        if (typeof targetNode.value === typeof value) {
            // @change update node
            targetNode.value = value;
            changeSet.push({ type: 'update', node: targetNode });
            return [newRootNode, changeSet];
        }

        const schema = getSchemaOfChild(core, parentNode, childProperty, value);
        if (isJSONError(schema)) {
            return [schema];
        }

        if (deepEqual(schema, targetNode.schema)) {
            // @change update node
            targetNode.value = value;
            changeSet.push({ type: 'update', node: targetNode });
            return [newRootNode, changeSet];
        }

        const childPointer = `${parentNode.pointer}/${childProperty}`;
        // @change create node
        if (isNode((parentNode as ObjectNode).children[targetIndex])) {
            changeSet.push({
                type: 'delete',
                node: (parentNode as ObjectNode).children[targetIndex]
            });
        }
        (parentNode as ObjectNode).children[targetIndex] = create(core, value, schema, childPointer);
        changeSet.push({
            type: 'create',
            node: (parentNode as ObjectNode).children[targetIndex]
        });
        return [newRootNode, changeSet];
    }

    // replace node, creating new object or array tree
    if (isParentNode(targetNode)) {
        const schema = getSchemaOfChild(core, parentNode, childProperty, value);
        if (isJSONError(schema)) {
            return [schema];
        }

        const parent = parentNode as ParentNode;
        const previousNode = parent.children[targetIndex] as ParentNode;
        const nextNode = create(core, value, schema, targetNode.pointer);

        // @todo sync old subtree with new subtree
        parent.children[targetIndex] = nextNode;

        if (deepEqual(previousNode.schema, nextNode.schema)) {
            const next = nextNode as ParentNode;
            // @change update parent, replace children
            changeSet.push({ type: 'update', node: nextNode });
            previousNode.children.forEach((childNode) => changeSet.push({ type: 'delete', node: childNode }));
            // @todo why can next node be missing children?
            next.children?.forEach((childNode) => changeSet.push({ type: 'create', node: childNode }));
        } else {
            // @change replace node
            changeSet.push({ type: 'delete', node: previousNode });
            changeSet.push({
                type: 'create',
                node: parent.children[targetIndex]
            });
        }

        return [newRootNode, changeSet];
    }

    throw new Error('Invalid state in transform.change');
}
