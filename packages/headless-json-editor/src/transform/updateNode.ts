import gp from '@sagold/json-pointer';
import { DefaultNodeOptions, createNode } from '../node/createNode';
import { JsonError, JsonPointer } from 'json-schema-library';
import { getNode } from '../node/getNode';
import { getData } from '../node/getData';
import { Node, isJsonError, Change, ParentNode, JsonSchema } from '../types';
import { unlinkPath } from './unlinkPath';

/**
 * Recreate a json-editor ast node at the given location.
 * Use this to update a node's json-schema which was modified in its source.
 *
 * @param he - instance of headless-json-editor
 * @param rootNode - root node of current json-editor ast
 * @param targetNode - node to be recreated
 * @return [newRootNode, listOfChanges]
 */
export function updateNode<T extends Node = Node>(ast: T, pointer: JsonPointer): [JsonError | T, Change[]?] {
    const targetNode = getNode(ast, pointer);
    if (isJsonError(targetNode)) {
        return [targetNode];
    }
    // unlink nodes along the path, ensuring we do not modify the previous ast
    const result = unlinkPath(ast, pointer);
    if (isJsonError(result)) {
        return [result];
    }
    // get the uptodate json-schema of this node
    const { node: childSchemaNode, error } = ast.schemaNode
        .getNodeRoot()
        .getNode(pointer, getData(ast), { createSchema: true });

    if (error) {
        return [error];
    }

    const [newRootNode] = result;
    // create new node and replace the old one with it
    const newNode = createNode(childSchemaNode, getData(targetNode), pointer);
    const [pointerToParent] = gp.splitLast(pointer);
    const parentNode = getNode(newRootNode, pointerToParent) as ParentNode;
    parentNode.children = parentNode.children.map((node) => (node.pointer === targetNode.pointer ? newNode : node));

    // return the new root node and a list of changes
    return [
        newRootNode,
        [
            { type: 'delete', node: targetNode },
            { type: 'create', node: newNode }
        ]
    ];
}

/**
 * updates schema of a node
 */
export function updateSchema(rootNode: Node, pointer: JsonPointer, schema: JsonSchema): [JsonError] | [Node, Change[]] {
    const result = unlinkPath(rootNode, pointer);
    if (isJsonError(result)) {
        return [result];
    }

    const [root, targetNode] = result;
    targetNode.schema = schema;

    return [root, [{ type: 'update', node: targetNode }]];
}

/**
 * updates options of a node
 */
export function updateOptions(
    rootNode: Node,
    pointer: JsonPointer,
    options: DefaultNodeOptions
): [JsonError] | [Node, Change[]] {
    const result = unlinkPath(rootNode, pointer);
    if (isJsonError(result)) {
        return [result];
    }

    const [root, targetNode] = result;
    targetNode.options = options;

    return [root, [{ type: 'update', node: targetNode }]];
}
