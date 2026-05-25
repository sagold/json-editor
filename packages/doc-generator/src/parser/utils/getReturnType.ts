import ts from 'typescript';
import { Context } from '../types';

export function getReturnType(node: ts.Node, context: Context) {
    if (!ts.isFunctionLike(node)) return undefined;
    const checker = context.program.getTypeChecker();
    const signature = checker.getSignatureFromDeclaration(node as ts.SignatureDeclaration);
    if (!signature) return undefined;
    const returnType = checker.getReturnTypeOfSignature(signature);
    // UseFullyQualifiedType: ensures JSX.Element is printed as "JSX.Element" not just "Element"
    // UseAliasDefinedOutsideCurrentScope: prefers the public alias name (e.g. "JsonSchema") over
    // minified internal names from bundled declarations (e.g. "c" in json-schema-library's .d.cts)
    const raw = checker.typeToString(
        returnType,
        node as ts.Declaration,
        ts.TypeFormatFlags.UseFullyQualifiedType | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
    );
    // strip import("..."). module prefixes from fully-qualified names (e.g. import(".../jsx-runtime").JSX.Element -> JSX.Element)
    return raw.replace(/import\("[^"]*"\)\./g, '');
}
