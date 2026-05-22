import ts from 'typescript';

export type Declaration = {
    node: ts.Node;
    ast: ts.SourceFile;
};

/**
 * Resolves a named export from an entry file to its actual declaration node,
 * following re-exports across files.
 *
 * @param program - ts.Program containing all source files
 * @param entryFilePath - absolute path to the file exporting the identifier (e.g. index.ts)
 * @param identifier - the exported name to resolve (e.g. 'HeadlessEditor')
 * @returns the ts.Node of the actual declaration and its source file, or undefined
 */
export function getDeclaration(
    program: ts.Program,
    entryFilePath: string,
    identifier: string
): Declaration | undefined {
    const checker = program.getTypeChecker();
    const entryAst = program.getSourceFile(entryFilePath);
    if (entryAst == null) return undefined;

    const moduleSymbol = checker.getSymbolAtLocation(entryAst);
    if (moduleSymbol == null) return undefined;

    // find the named export symbol
    const exportSymbol = checker.getExportsOfModule(moduleSymbol).find((s) => s.getName() === identifier);
    if (exportSymbol == null) return undefined;

    // follow the alias chain to the actual declaration (resolves re-exports)
    const resolvedSymbol =
        exportSymbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exportSymbol) : exportSymbol;

    const declaration = resolvedSymbol.declarations?.[0];
    if (declaration == null) return undefined;

    const sourceFile = declaration.getSourceFile();

    // If the resolved node is not an actual declaration (e.g. it's an ExportSpecifier
    // from a re-export chain), search the source file for a top-level declaration with
    // the matching name.
    const isActualDeclaration =
        ts.isTypeAliasDeclaration(declaration) ||
        ts.isClassDeclaration(declaration) ||
        ts.isInterfaceDeclaration(declaration) ||
        ts.isFunctionDeclaration(declaration) ||
        ts.isVariableDeclaration(declaration);

    if (!isActualDeclaration) {
        let found: ts.Node | undefined;
        sourceFile.forEachChild((child) => {
            if (
                (ts.isTypeAliasDeclaration(child) ||
                    ts.isClassDeclaration(child) ||
                    ts.isInterfaceDeclaration(child) ||
                    ts.isFunctionDeclaration(child)) &&
                (child as ts.NamedDeclaration).name?.getText(sourceFile) === identifier
            ) {
                found = child;
            }
        });
        if (found) {
            return { node: found, ast: sourceFile };
        }
    }

    return {
        node: declaration,
        ast: sourceFile
    };
}
