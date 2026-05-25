import ts from 'typescript';
import { Context } from '../types';

export type Declaration = {
    node: ts.Node;
    source: ts.SourceFile;
};

/**
 * Resolves an identifier to its declaration node by following imports and
 * re-exports. Only follows relative imports or packages declared in tsconfig
 * `paths` (monorepo packages). Skips node_modules packages.
 *
 * @param context - parser context containing the TypeScript program
 * @param sourceFile - the source file where the identifier is referenced
 * @param identifier - the name of the identifier to resolve
 * @returns the declaration node and its source file, or undefined
 */
export function getNodeFromIdentifier(context: Context, identifier: string): Declaration | undefined {
    const found = findImportDeclaration(context.source, identifier);

    if (found != null) {
        const { spec, decl } = found;
        const modulePath = (decl.moduleSpecifier as ts.StringLiteral).text;

        if (isExternalPackage(modulePath, context)) {
            return undefined;
        }

        const checker = context.program.getTypeChecker();
        const symbol = checker.getSymbolAtLocation(spec.name);
        if (symbol == null) return undefined;

        const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;

        return resolveToDeclaration(resolved, identifier);
    }

    // Not imported — may be declared locally in this file
    return findDeclarationInFile(context.source, identifier);
}

function findImportDeclaration(
    sourceFile: ts.SourceFile,
    identifier: string
): { spec: ts.ImportSpecifier; decl: ts.ImportDeclaration } | undefined {
    for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement)) continue;
        const bindings = statement.importClause?.namedBindings;
        if (!bindings || !ts.isNamedImports(bindings)) continue;
        const spec = bindings.elements.find((e) => e.name.text === identifier);
        if (spec) return { spec, decl: statement };
    }
    return undefined;
}

/** Returns true for node_modules packages that should not be followed */
function isExternalPackage(modulePath: string, context: Context): boolean {
    if (modulePath.startsWith('.')) return false;
    const paths = context.program.getCompilerOptions().paths ?? {};
    return !(modulePath in paths);
}

function resolveToDeclaration(symbol: ts.Symbol, identifier: string): Declaration | undefined {
    const declaration = symbol.declarations?.[0];
    if (declaration == null) return undefined;

    const sourceFile = declaration.getSourceFile();
    if (sourceFile.fileName.includes('node_modules')) return undefined;

    if (isActualDeclaration(declaration)) {
        return { node: declaration, source: sourceFile };
    }

    // Resolved to a re-export specifier — search the file for the real declaration
    return findDeclarationInFile(sourceFile, identifier);
}

function isActualDeclaration(node: ts.Node): boolean {
    return (
        ts.isClassDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isVariableDeclaration(node)
    );
}

export function findDeclarationInFile(sourceFile: ts.SourceFile, identifier: string): Declaration | undefined {
    for (const statement of sourceFile.statements) {
        if (
            (ts.isClassDeclaration(statement) ||
                ts.isFunctionDeclaration(statement) ||
                ts.isTypeAliasDeclaration(statement) ||
                ts.isInterfaceDeclaration(statement)) &&
            (statement as ts.NamedDeclaration).name?.getText(sourceFile) === identifier
        ) {
            return { node: statement, source: sourceFile };
        }
        if (ts.isVariableStatement(statement)) {
            for (const decl of statement.declarationList.declarations) {
                if (ts.isIdentifier(decl.name) && decl.name.text === identifier) {
                    return { node: decl, source: sourceFile };
                }
            }
        }
    }
    return undefined;
}
