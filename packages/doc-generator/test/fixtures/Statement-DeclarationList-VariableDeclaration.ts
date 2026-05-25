/**
 * Node tree: TypeAliasDeclaration
 */
type ObjectType = {
    id: string;
    /**
     * @param params    type comment
     */
    callback: (params: string) => string;
};

/**
 * Node tree: VariableStatement » VariableDeclarationList » VariableDeclaration
 *
 * - VariableDeclaration should be the entry point
 * - VariableStatement contains this comment
 */
export const objectDeclaration: ObjectType = {
    id: 'select-widget',
    /**
     * @param params    variable comment
     */
    callback: (params) => params ?? 'unknown'
};
