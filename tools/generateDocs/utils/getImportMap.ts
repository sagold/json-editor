import ts from 'typescript';
import query from '@sagold/json-query';
import path from 'node:path';
import { get } from './get.js';

const shortcuts = {
    'headless-json-editor': path.join(process.cwd(), 'packages', 'headless-json-editor', 'src', 'index.ts')
};

export function getImportMap(ast: ts.SourceFile) {
    // console.log('ast', ast);
    const importMap: Record<string, string> = {};
    ast.forEachChild((child) => {
        if (ts.isImportDeclaration(child)) {
            const localImportPath = (get(child, 'StringLiteral')?.getText(ast) ?? 'error').replace(/["']/g, '');
            query
                .get(child, `*?kind:${ts.SyntaxKind['ImportClause']}/namedBindings/elements/*/name`, query.get.VALUE)
                .map((v: ts.Node) => v?.getText(ast))
                .forEach((importName: string) => {
                    if (shortcuts[localImportPath]) {
                        importMap[importName] = shortcuts[localImportPath];
                    } else {
                        importMap[importName] = path.join(path.dirname(ast.fileName), `${localImportPath}.ts`);
                    }
                });
        }
    });
    return importMap;
}
