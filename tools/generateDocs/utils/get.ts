import ts from 'typescript';

type KindByName = keyof typeof ts.SyntaxKind;

/**
 * @returns the first occurence of the given kind-type or undefined
 */
export function get(node: ts.Node, kindName: KindByName) {
    let result: ts.Node | undefined;
    node.forEachChild((child) => {
        if (result == null && ts.SyntaxKind[child.kind] === kindName) {
            result = child;
        }
    });
    return result;
}

/**
 * @returns all occurence of the given kind-type or an empty array
 */
export function getAll(node: ts.Node, kindName: KindByName) {
    const result: ts.Node[] = [];
    node.forEachChild((child) => {
        if (ts.SyntaxKind[child.kind] === kindName) {
            result.push(child);
        }
    });
    return result;
}
