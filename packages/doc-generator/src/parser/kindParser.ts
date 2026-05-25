import pointer from '@sagold/json-pointer';
import ts, { SyntaxKind } from 'typescript';
import { containsJsx } from './utils/containsJsx';
import { DocTag, getDocs, JSDocInfo } from './utils/getDocs';
import { getKindName } from './utils/getKindName';
import { type Context, type Result } from './types';
import { getReturnType } from './utils/getReturnType';
import { getNodeFromIdentifier } from './utils/getNodeFromIdentifier';

export type KindParser<T extends ts.Node> = (context: Context, node: T, result: Result) => void;
type ResultKey = keyof Result;

const getText = (node: ts.Node, context: Context) => node.getText(context.source);
const findTagByName = (docs: JSDocInfo, type: string, name?: string) =>
    docs?.tags?.find((tag) => tag.tag === type && (name == null || tag.name === name));
const byName = (a: Result, b: Result) => a.name?.localeCompare(b.name ?? '') ?? 0;

/** ensure a value is set with the given data type */
function setDefault<K extends keyof Result>(result: Result, key: K, fallback: Result[K]): Result[K] {
    if (result[key] == null) result[key] = fallback;
    return result[key] as Result[K];
}

/** returns the current filepath of the file being parsed */
function getFilepath(context: Context) {
    return context.source.fileName.replace(`${process.cwd()}/`, '');
}

/** returns the current filepath of the file being parsed */
function addFilepathAndLineNumber(context: Context, node: ts.Node, result: Record<string, unknown>) {
    result.filepath = context.source.fileName.replace(`${process.cwd()}/`, '');
    const { line } = ts.getLineAndCharacterOfPosition(context.source, node.getStart(context.source));
    result.lineNumber = line + 1; // TypeScript lines are 0-based
}

/**
 * parses nodes at the specified json-pointer to the specified target-property
 * @returns nodes that are already parsed
 */
function parseTo(context: Context, node: ts.Node, result: Result, path: string, target: string) {
    const origin = pointer.get<ts.Node | ts.Node[] | undefined>(node, path);
    if (origin == null) {
        return [];
    }
    const skipNodes: ts.Node[] = [];
    if (Array.isArray(origin)) {
        setDefault(result, target as ResultKey, []);
        origin.forEach((child: ts.Node) => {
            skipNodes.push(child);
            const childResult: Result = {};
            const list = result[target as ResultKey];
            if (Array.isArray(list)) {
                // @ts-expect-error dynamic resolution untyped
                list.push(childResult);
            }
            context.parseNode(context, child, childResult);
        });
    } else {
        skipNodes.push(origin);
        setDefault(result, target as ResultKey, {});
        // @ts-expect-error dynamic resolution untyped
        context.parseNode(context, origin, result[target]);
    }
    return skipNodes;
}

/**
 * Move matching @param tags from docs to the specified list of parameters
 * @param path  path to list of parameters
 */
function assignParamTags(result: Result, path: string, tagType: 'param' | 'template' = 'param') {
    const parameters = pointer.get(result, path);
    const tags = result.docs?.tags;
    if (tags && tags.length > 0 && Array.isArray(parameters)) {
        parameters.forEach((param: Result) => {
            const tag = findTagByName(result.docs!, tagType, param.name);
            if (tag == null) {
                // console.log('failed finding tag', param.name);
                return;
            }
            pointer.set(param, '/docs/comment', tag.comment);
            // remove original tag
            result.docs = result.docs ?? {};
            result.docs.tags = result.docs?.tags?.filter((t: DocTag) => t !== tag);
        });
    }
}

function assignReturnsTag(result: Result, target: string) {
    const targetObject = pointer.get(result, target);
    if (result.docs?.tags && result.docs?.tags?.length > 0 && targetObject) {
        const tag = findTagByName(result.docs, 'returns');
        if (tag == null) {
            return;
        }
        pointer.set(targetObject, '/docs/comment', tag.comment);
        // remove original tag
        result.docs.tags = result.docs?.tags?.filter((t: DocTag) => t !== tag);
    }
}

const parseKeyword: KindParser<any> = (context, node, result) => {
    result.kindName = getKindName(node);
    result.text = getText(node, context);
};

// https://ts-ast-viewer.com/#
export const kindParser: Partial<Record<SyntaxKind, KindParser<any>>> = {
    // Note: also contains main docs for parent of VariableDeclarationList
    [SyntaxKind.ExportKeyword]: (context, node: ts.ExportKeyword, result) => (result.isExported = true),
    [SyntaxKind.Identifier]: (context, node: ts.Identifier, result) => (result.name = getText(node, context)),
    [SyntaxKind.QuestionToken]: (context, node: ts.Identifier, result) => (result.isOptional = true),
    [SyntaxKind.FirstStatement]: (context, node: ts.VariableStatement, result) => {
        // outer node hold main documentation
        result.docs = getDocs(node);
        // continue parsing this node because we are waiting for a declaration (VariableDeclaration)
        context.parseChildren(context, node, result);
    },
    [SyntaxKind.VariableDeclarationList]: (context, node: ts.VariableDeclarationList, result) => {
        // does not contain any relevant information except the full text of this part
        // check for yet unsupported behaviour: how would we add the single parent comment?
        const declarations = node.declarations;
        if (declarations.length > 1) {
            throw new Error(
                `[kindParser: VariableDeclarationList] multiple declarations not yet implemented. Count: ${declarations.length}`
            );
        }
        context.parseChildren(context, node, result);
    },
    // @entry here we have an entry point
    [SyntaxKind.VariableDeclaration]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.isComponent = containsJsx(node);
        addFilepathAndLineNumber(context, node, result);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'type', 'type'));
        // parse rest but skip already parsed nodes
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.TypeReference]: (context, node, result) => {
        result.kindName = 'TypeReference';
        // @todo resolve reference
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'typeArguments', 'typeArguments'));
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.ObjectLiteralExpression]: (context, node: ts.ObjectLiteralExpression, result) => {
        parseTo(context, node, result, 'properties', 'properties');
    },
    [SyntaxKind.PropertyAssignment]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.docs = getDocs(node);
        result.text = getText(node, context);
        context.parseChildren(context, node, result);
    },
    [SyntaxKind.StringLiteral]: (context, node, result) =>
        (result.value = {
            kindName: getKindName(node),
            text: getText(node, context)
        }),
    [SyntaxKind.ArrowFunction]: (context, node, result) => {
        result.value = {
            kindName: getKindName(node),
            text: getText(node, context),
            returns: {
                type: getReturnType(node, context)
            }
        };
        assignReturnsTag(result, 'value/returns');
        // @bug shouldnt we parse to result.value here?
        parseTo(context, node, result, 'parameters', 'parameters');
    },
    [SyntaxKind.Parameter]: (context, node, result) => {
        const skipNodes: ts.Node[] = [];
        result.text = getText(node, context);
        skipNodes.push(...parseTo(context, node, result, 'type', 'type'));
        context.parseChildren(context, node, result, skipNodes);
    },
    // @entry here we have an entry point
    [SyntaxKind.TypeAliasDeclaration]: (context, node, result) => {
        result.docs = getDocs(node);
        result.kindName = getKindName(node);
        addFilepathAndLineNumber(context, node, result);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'type', 'type'));
        skipNodes.push(...parseTo(context, node, result, 'typeParameters', 'typeParameters'));
        context.parseChildren(context, node, result, skipNodes);

        assignParamTags(result, 'typeParameters', 'template');
    },
    [SyntaxKind.TypeLiteral]: (context, node, result) => {
        if (result.type) {
            throw new Error(`[kindParser: TypeLiteral] A type is already defined: ${JSON.stringify(result.type)}`);
        }
        // we again, expect the parent to have parsed "type" manually - so we do
        // not create a type-property ourselves
        // const typeLiteral: Result = { kindName: getKindName(node) };
        // result.type = typeLiteral;
        result.kindName = getKindName(node);
        parseTo(context, node, result, 'members', 'properties');
    },
    [SyntaxKind.PropertySignature]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.docs = getDocs(node);
        result.text = getText(node, context);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'type', 'type'));
        context.parseChildren(context, node, result, skipNodes);
        assignParamTags(result, 'type/parameters');
        if (result.type?.returns) {
            assignReturnsTag(result, 'type/returns');
        }
    },
    // expressions
    [SyntaxKind.ArrayLiteralExpression]: (context, node, result) => {
        result.text = getText(node, context);
        context.parseChildren(context, node, result);
    },
    // keywords
    [SyntaxKind.StringKeyword]: parseKeyword,
    [SyntaxKind.AnyKeyword]: parseKeyword,
    [SyntaxKind.UnknownKeyword]: parseKeyword,
    [SyntaxKind.BooleanKeyword]: parseKeyword,
    [SyntaxKind.NullKeyword]: parseKeyword,
    [SyntaxKind.NumberKeyword]: parseKeyword,
    [SyntaxKind.ReadonlyKeyword]: (context, node, result) => (result.isReadOnly = true),
    [SyntaxKind.ArrayType]: (context, node, result) => {
        result.text = getText(node, context);
        context.parseChildren(context, node, result);
    },
    // types
    [SyntaxKind.UnionType]: (context, node, result) => {
        result.kindName = getKindName(node);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'types', 'types'));
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.IntersectionType]: (context, node, result) => {
        result.kindName = getKindName(node);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'types', 'types'));
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.FunctionType]: (context, node, result) => {
        result.kindName = getKindName(node);
        parseTo(context, node, result, 'type', 'type');
        parseTo(context, node, result, 'parameters', 'parameters');
        parseTo(context, node, result, 'typeParameters', 'typeParameters');
        result.returns = {
            type: getReturnType(node, context)
        };
    },
    // ...
    [SyntaxKind.FunctionDeclaration]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.docs = getDocs(node);
        result.isComponent = containsJsx(node);
        result.returns = {
            type: getReturnType(node, context)
        };
        assignReturnsTag(result, 'returns');

        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'typeParameters', 'typeParameters'));
        skipNodes.push(...parseTo(context, node, result, 'parameters', 'parameters'));
        context.parseChildren(context, node, result, skipNodes);

        assignParamTags(result, 'parameters');
        assignParamTags(result, 'typeParameters', 'template');
    },
    [SyntaxKind.TypeParameter]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.text = getText(node, context);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'default', 'default'));
        skipNodes.push(...parseTo(context, node, result, 'constraint', 'constraint'));
        context.parseChildren(context, node, result, skipNodes);
    },
    // @entry here we have an entry point
    [SyntaxKind.ClassDeclaration]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.docs = getDocs(node);
        addFilepathAndLineNumber(context, node, result);
        result.returns = {
            type: getReturnType(node, context)
        };
        assignReturnsTag(result, 'returns');
        // result.text = getText(node, context);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'members', 'members'));
        // now, spread members to properties, methods and constructor
        // @ts-expect-error temporary variable
        result.members.forEach((member: Result) => {
            if (member.kindName === 'MethodDeclaration') {
                result.methods = result.methods ?? [];
                result.methods.push(member);
            } else if (member.kindName === 'PropertyDeclaration') {
                result.properties = result.properties ?? [];
                result.properties.push(member);
            } else if (member.kindName === 'Constructor') {
                result.parameters = member.parameters;
            } else if (member.kindName == null) {
                // fall silent for now
            } else {
                console.log(JSON.stringify(member, null, 2));
                throw new Error(`[ClassDeclaration] unexpected member type '${member.kindName}'`);
            }
        });
        // remove members
        // @ts-expect-error temporary variable
        delete result.members;
        skipNodes.push(...parseTo(context, node, result, 'heritageClauses', 'heritage'));
        skipNodes.push(...parseTo(context, node, result, 'typeParameters', 'typeParameters'));
        context.parseChildren(context, node, result, skipNodes);
        // merge with inherited classes
        if (Array.isArray(result.heritage)) {
            result.heritage.forEach((parentClass) => {
                if (parentClass.name == null) {
                    return;
                }
                // get inhertied class declaration node
                const { source, node: inheritedNode } = getNodeFromIdentifier(context, parentClass.name) ?? {};
                if (inheritedNode == null || source == null) {
                    return;
                }
                // parse node (this parser)
                const newResult: Result = {};
                const newContext: Context = { ...context, source };
                kindParser[SyntaxKind.ClassDeclaration]!(newContext, inheritedNode, newResult);

                const findByName = (name: string) => (member: Result) => member.name === name;

                // merge members, ignoring already set ones (overwrite)
                newResult.properties
                    ?.filter((member: Result) => !result.properties?.find(findByName(member.name!)))
                    .forEach((member: Result) => {
                        result.properties = result.properties ?? [];
                        result.properties.push(member);
                    });

                newResult.methods
                    ?.filter((member: Result) => !result.methods?.find(findByName(member.name!)))
                    .forEach((member: Result) => {
                        result.methods = result.methods ?? [];
                        result.methods.push(member);
                    });

                // constructor
                result.parameters = result.parameters ?? newResult.parameters;
            });
        }
        result?.methods?.sort(byName);
        result?.properties?.sort(byName);

        // inline constructor options
        // if (Array.isArray(result.parameters)) {
        //     const newType: Result = {};

        //     result.parameters.forEach((param) => {
        //         if (param.type?.kindName === 'TypeReference' && param.type.name) {
        //             const { source, node: referencedType } = getNodeFromIdentifier(context, param.type.name) ?? {};
        //             if (referencedType == null || source == null) {
        //                 return;
        //             }
        //             // parse node
        //             const newResult: Result = {};
        //             const newContext: Context = { ...context, source };
        //             kindParser[referencedType.kind]!(newContext, referencedType, newResult);
        //             console.log(`Referenced type ${newResult.name}`, JSON.stringify(newResult, null, 2));
        //             param.type.type = newResult.type;
        //         }
        //     });
        // }
    },
    [SyntaxKind.HeritageClause]: (context, node, result) => {
        result.text = getText(node, context);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'type', 'type'));
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.ExpressionWithTypeArguments]: (context, node, result) => {
        result.kindName = getKindName(node);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'typeArguments', 'typeArguments'));
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.Constructor]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.docs = getDocs(node);
        // result.docs = getDocs(node);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'parameters', 'parameters'));
        skipNodes.push(...parseTo(context, node, result, 'typeParameters', 'typeParameters'));
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.PropertyDeclaration]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.docs = getDocs(node);
        // result.docs = getDocs(node);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'type', 'type'));
        context.parseChildren(context, node, result, skipNodes);
    },
    [SyntaxKind.MethodDeclaration]: (context, node, result) => {
        result.kindName = getKindName(node);
        result.docs = getDocs(node);
        result.text = getText(node, context);
        // result.docs = getDocs(node);
        const skipNodes: ts.Node[] = [];
        skipNodes.push(...parseTo(context, node, result, 'typeParameters', 'typeParameters'));
        skipNodes.push(...parseTo(context, node, result, 'parameters', 'parameters'));
        assignParamTags(result, 'parameters');
        // -- returns --
        skipNodes.push(...parseTo(context, node, result, 'type', 'returns'));
        result.returns = result.returns ?? {};
        result.returns.type = getReturnType(node, context);
        assignReturnsTag(result, 'returns');
        // --
        context.parseChildren(context, node, result, skipNodes);
    }
} as const;
