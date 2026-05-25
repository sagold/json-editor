import ts, { SyntaxKind } from 'typescript';

const JSX_KINDS = new Set([SyntaxKind.JsxElement, SyntaxKind.JsxSelfClosingElement, SyntaxKind.JsxFragment]);

export function containsJsx(node: ts.Node): boolean {
    if (JSX_KINDS.has(node.kind)) return true;
    let found = false;
    node.forEachChild((child) => {
        if (!found) found = containsJsx(child);
    });
    return found;
}
