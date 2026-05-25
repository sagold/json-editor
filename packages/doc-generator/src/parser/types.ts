import ts, { JSDoc } from 'typescript';
import { DocTag, JSDocInfo } from './utils/getDocs';
import { KindName } from './utils/getKindName';

export type KindByName = keyof typeof ts.SyntaxKind;
export const isObject = (v: unknown): v is Result => v != null && typeof v === 'object';
export const isNode = (v: unknown, kindName: KindByName) => isObject(v) && v.kindName === kindName;

export type Context = {
    export: Result;
    program: ts.Program;
    source: ts.SourceFile;
    parseChildren: (context: Context, node: ts.Node, result: Result, skipNodes?: ts.Node[]) => void;
    parseNode: (context: Context, node: ts.Node, result: Result) => void;
};

/**
 * type declaration
 *
 * - contains a type for the assignment
 * - may contain typeParameters
 */
export type TypeAliasDeclaration = {
    kindName: 'TypeAliasDeclaration';
    name: string;
    type: Result;
    typeParameters?: Result[];
    comment?: string;
    filepath: string;
    isExported?: boolean;
    lineNumber: number;
    tags?: JSDoc[];
};
export const isTypeAliasDeclaration = (v: unknown): v is TypeAliasDeclaration => isNode(v, 'TypeAliasDeclaration');

/**
 * Generic parameter of a type
 *
 * - comments can be assigned by the `@template <name> description` tag
 * - there can of course be multiple parameters, this is the single parameter
 * - parameters can hold properties for documentation, like `SomeType<{ type: string }>`
 * - parameters are passed to the called type and can be assigned there in multiple ways,
 *      possible not resolving in properties to document, like assignment or specific
 *      prop or not at all
 *
 * @example
 * SomeType<TypeParameter>
 * // with TypeParameter: `Data = unknown`
 * SomeType<Data = unknown>
 */
export type TypeParameter = {
    /** default value assignment to type, making type optional */
    default?: Result;
    kindName: 'TypeParameter';
    /** name of parameter */
    name: string;
    text: string;
    /** possible arguments of type parameter, e.g. `SomeType<MyParameter<TypeArgument>>` */
    typeArguments?: Result[];
};
export const isTypeParameter = (v: unknown): v is TypeParameter => isNode(v, 'TypeParameter');

/**
 * AND combination of types
 *
 * @example
 * IntersectionType = TypeA & TypeB & TypeC
 */
export type IntersectionType = {
    kindName: 'IntersectionType';
    /** list of types that are joined to a single type */
    types: Result[];
};
export const isIntersectionType = (v: unknown): v is IntersectionType => isNode(v, 'IntersectionType');

/**
 * Type variable reference to a local or imported type
 *
 * @example
 * SomeType = TypeReference<Args>
 */
export type TypeReference = {
    /** name identifying reference (type variable) */
    name: string;
    kindName: 'TypeReference';
    /** possible arguments of type parameter, e.g. `ReferencedType<TypeArgument>` */
    typeArguments?: Result[];
};
export const isTypeReference = (v: unknown): v is TypeReference => isNode(v, 'TypeReference');

/**
 * Type variable reference to a local or imported type
 *
 * @example
 * SomeType = TypeReference<Args>
 */
export type TypeLiteral = {
    kindName: 'TypeLiteral';
    /** list of PropertySignature of object type */
    properties?: Result[];
};
export const isTypeLiteral = (v: unknown): v is TypeLiteral => isNode(v, 'TypeLiteral');

/**
 * general node containing all possible properties
 */
export type Result = {
    name?: string;
    kindName?: KindName;
    text?: string;
    filepath?: string;
    lineNumber?: number;
    isExported?: boolean;
    isOptional?: boolean;
    isComponent?: boolean;
    isReadOnly?: boolean;
    /** JSDocs. Only available during parse-time */
    docs?: JSDocInfo;
    /** JSDoc tags. Only available after parsing */
    tags?: DocTag[];
    /** JSDoc comment. Only available after parsing */
    comment?: string;
    value?: Result;
    type?: Result;
    types?: Result[];
    properties?: Result[];
    /** list of function parameters */
    parameters?: Result[];
    methods?: Result[];
    heritage?: Result[];
    returns?: Omit<Result, 'type'> & { type?: string };
    typeParameters?: TypeParameter[];
};
