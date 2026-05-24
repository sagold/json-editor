import ts from 'typescript';
import query from '@sagold/json-query';
import path from 'node:path';
import { get } from './get.js';

export type ImportEntry = {
    /** Resolved absolute path to the source file, if known */
    filepath?: string;
    /** Raw package specifier when the import comes from a package (e.g. "@sagold/react-json-editor") */
    package?: string;
};

const shortcuts: Record<string, string> = {
    'headless-json-editor': path.join(process.cwd(), 'packages', 'headless-json-editor', 'src', 'index.ts'),
    '@sagold/react-json-editor': path.join(process.cwd(), 'packages', 'react-json-editor', 'src', 'index.ts')
};

export function getImportMap(ast: ts.SourceFile): Record<string, ImportEntry> {
    const importMap: Record<string, ImportEntry> = {};
    ast.forEachChild((child) => {
        if (ts.isImportDeclaration(child)) {
            const localImportPath = (get(child, 'StringLiteral')?.getText(ast) ?? 'error').replace(/["']/g, '');
            const isPackageImport = !localImportPath.startsWith('.');
            query
                .get(child, `*?kind:${ts.SyntaxKind['ImportClause']}/namedBindings/elements/*/name`, query.get.VALUE)
                .map((v: ts.Node) => v?.getText(ast))
                .forEach((importName: string) => {
                    if (shortcuts[localImportPath]) {
                        importMap[importName] = {
                            filepath: shortcuts[localImportPath],
                            package: isPackageImport ? localImportPath : undefined
                        };
                    } else if (isPackageImport) {
                        // External package without a known source shortcut — record specifier only
                        importMap[importName] = { package: localImportPath };
                    } else {
                        importMap[importName] = {
                            filepath: path.join(path.dirname(ast.fileName), `${localImportPath}.ts`)
                        };
                    }
                });
        }
    });
    return importMap;
}
