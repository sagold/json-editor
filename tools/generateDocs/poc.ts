/* eslint-disable max-len */
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// ts-ast-viewer.com/
import path from 'node:path';
import fs from 'node:fs';
import ts, { type SourceFile, type Program } from 'typescript';
import { get } from './utils/get';
import { getImportMap } from './utils/getImportMap';
import { DocTag, getDocs } from './utils/getDocs';
import { getDeclaration } from './utils/getDeclaration';
import query from '@sagold/json-query';
import pointer from '@sagold/json-pointer';

/**
 * @returns the first occurence of the given identifier
 */
function findIdentifier(ast: SourceFile, identifier: string) {
    let result: ts.Node | undefined;
    ast.forEachChild((child) => {
        if (get(child, 'Identifier')?.getText(ast) === identifier) {
            result = child;
        }
    });
    return result;
}

function parseParameters(ast: SourceFile, node: ts.Node, tags: DocTag[]) {
    const parameters = query.get(node, 'parameters/*', query.get.VALUE).map((parameterNode: ts.Node) => {
        const parameterName = pointer.get(parameterNode, '/name/escapedText');
        return {
            name: parameterName,
            kind: ts.SyntaxKind[node.kind],
            type: pointer.get(parameterNode, '/type/typeName/escapedText'),
            typeArgs: query
                .get(parameterNode, '/type/typeArguments/*/kind', query.get.VALUE)
                .map((kind) => ts.SyntaxKind[kind]),
            optional: pointer.get(parameterNode, '/questionToken') != null,
            text: parameterNode.getText(ast),
            comment: tags.find((tag) => tag.name! === parameterName)?.comment
        };
    });
    return parameters;
}

function parseProperty(ast: SourceFile, propertyDeclaration: ts.Node) {
    const propertyName = pointer.get(propertyDeclaration, '/name/escapedText');
    const docs = getDocs(ast, propertyDeclaration);
    const typeKind = pointer.get<number | undefined>(propertyDeclaration, '/type/kind');

    return {
        name: propertyName,
        kind: ts.SyntaxKind[propertyDeclaration.kind],
        type: pointer.get(propertyDeclaration, '/type/elementType/typeName/escapedText'),
        typeKind: typeKind ? ts.SyntaxKind[typeKind] : undefined,
        typeArgs: query
            .get(propertyDeclaration, '/type/elementType/typeArguments/*/kind', query.get.VALUE)
            .map((kind) => ts.SyntaxKind[kind]),
        comment: docs.comment,
        optional: pointer.get(propertyDeclaration, '/questionToken/') != null,
        text: propertyDeclaration.getText(ast)
    };
}

function parseMethod(ast: SourceFile, methodDeclaration: ts.Node) {
    const docs = getDocs(ast, methodDeclaration);
    return {
        name: get(methodDeclaration, 'Identifier')?.getText(ast),
        kind: ts.SyntaxKind[methodDeclaration.kind],
        types: query.get(methodDeclaration, '/typeParameters/*', query.get.VALUE).map((typeParameter) => ({
            name: pointer.get(typeParameter, 'name/escapedText'),
            kind: ts.SyntaxKind[typeParameter.kind],
            text: typeParameter.getText(ast)
        })),
        comment: docs.comment,
        parameters: parseParameters(ast, methodDeclaration, docs.tags),
        returns: docs.tags.find((tag) => tag.tag.startsWith('return'))?.comment
    };
}

function parseConstructor(ast: SourceFile, node: ts.Node) {
    const docs = getDocs(ast, node);
    return {
        name: get(node, 'Identifier')?.getText(ast),
        kind: ts.SyntaxKind[node.kind],
        comment: docs.comment,
        parameters: parseParameters(ast, node, docs.tags),
        returns: docs.tags.find((tag) => tag.tag.startsWith('return'))?.comment
    };
}

function parseType(ast: SourceFile, typeParameter: ts.Node) {
    const kind = pointer.get<number | undefined>(typeParameter, 'default/kind');
    return {
        name: pointer.get(typeParameter, 'name/escapedText'),
        kind: ts.SyntaxKind[typeParameter.kind],
        text: typeParameter.getText(ast),
        default: kind ? ts.SyntaxKind[kind] : undefined
    };
}

type O = Record<string, any>;
type ParseContext = {
    program: Program;
    source: SourceFile;
    /** set to true to inline declarations defiinitions (skipping nested declarations) to expose a seemingly single type */
    inlineDeclaration?: boolean;
    /** Add Identifier names that should not be inlined, but just referenced */
    skipInlining: string[];
    /** true if the current type is a referenced type */
    isReferenced?: boolean;
};

function getReturnType(context: ParseContext, node: ts.Node) {
    const checker = context.program.getTypeChecker();
    const signature = checker.getSignatureFromDeclaration(node);
    const returnType = signature ? checker.typeToString(checker.getReturnTypeOfSignature(signature)) : undefined;
    return returnType;
}

type Definition = { node: ts.Node; ast: ts.SourceFile };

function resolveTypeDefinition(
    context: ParseContext,
    node: ts.Node,
    result: O,
    referencedType: string,
    definition: Definition
) {
    result.referenced = true;
    const newContext = { ...context, source: definition.ast, isReferenced: true };
    const typeNode = (definition.node as ts.TypeAliasDeclaration).type;
    if (context.inlineDeclaration === true && typeNode) {
        result.kindType = ts.SyntaxKind[typeNode.kind];
        if (parser[typeNode.kind] == null) {
            throw new Error(`Missing type parser for '${ts.SyntaxKind[typeNode.kind]}' (${typeNode.kind})`);
        }
        console.log('[TypeReference] inlining type reference', referencedType);
        return parser[typeNode.kind](newContext, typeNode, result);
    }
    result.kindType = ts.SyntaxKind[definition.node.kind];
    console.log('[TypeReference] parsing type reference', referencedType);
    return parseChildren(newContext, definition.node, result);
}

function isTypeArgument(node: ts.Node) {
    return (
        node.parent != null &&
        ts.isTypeReferenceNode(node.parent) &&
        !!node.parent.typeArguments?.includes(node as ts.TypeReferenceNode)
    );
}

const parser = {
    [ts.SyntaxKind['Identifier']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.name = node.getText(context.source);
    },
    [ts.SyntaxKind['ExportKeyword']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.isExported = true;
    },
    [ts.SyntaxKind['FunctionDeclaration']]: (context: ParseContext, node: ts.Node) => {
        const result = {
            ...getDocs(context.source, node),
            kindType: 'FunctionDeclaration',
            returns: getReturnType(context, node)
        };
        parseChildren(context, node, result);
        return result;
    },
    [ts.SyntaxKind['Parameter']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.parameter = result.parameter ?? [];
        const meta = {
            ...getDocs(context.source, node),
            text: node.getText(context.source)
        };
        result.parameter.push(meta);
        parseChildren(context, node, meta);
    },
    // TYPES
    [ts.SyntaxKind['QuestionToken']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.optional = true;
    },
    [ts.SyntaxKind['TypeParameter']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.typeParameter = result.typeParameter ?? [];
        const parameter = {
            kindType: 'TypeParameter',
            text: node.getText(context.source)
        };
        result.typeParameter.push(parameter);
        parseChildren(context, node, parameter);
    },
    [ts.SyntaxKind['UnknownKeyword']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.default = 'unknown';
    },
    [ts.SyntaxKind['TypeAliasDeclaration']]: (context: ParseContext, node: ts.Node) => {
        const docs = getDocs(context.source, node);
        const localResult = {
            kindType: 'TypeAliasDeclaration',
            comment: docs.comment,
            tags: docs.tags
        };
        // we parse a declaration and want references inlined
        context.inlineDeclaration = true;
        parseChildren(context, node, localResult);
        return localResult;
    },
    [ts.SyntaxKind['UnionType']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.kindType = 'UnionType';
        result.text = node.getText(context.source);
        result.types = parseChildren(context, node);
        // @todo does not add any types
        return result;
    },
    [ts.SyntaxKind['IntersectionType']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        if (context.inlineDeclaration && context.isReferenced) {
            return parseChildren(context, node);
        }

        const docs = getDocs(context.source, node);
        result.comment = docs.comment;
        result.tags = docs.tags;
        result.types = parseChildren(context, node);
        return result;
    },
    [ts.SyntaxKind['FunctionType']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        const docs = getDocs(context.source, node);
        result.type = {
            ...docs,
            kindType: 'FunctionType',
            text: node.getText(context.source)
        };
        parseChildren(context, node, result);
        return result;
    },
    // TypeLiteral ```type [TypeLiteral] = { [PropertySignature] }```
    [ts.SyntaxKind['TypeLiteral']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.properties = [];
        parseChildren(context, node, result);
        return result;
    },
    [ts.SyntaxKind['TypeReference']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        const nextResult = {
            kindType: 'TypeReference'
        };
        if (isTypeArgument(node)) {
            result.typeArgs = [nextResult];
        } else {
            result.type = nextResult;
        }
        parseChildren(context, node, nextResult);

        // references a different type, combine
        const referencedType = pointer.get<string>(node, 'typeName/escapedText');
        if (context.skipInlining.includes(referencedType)) {
            // console.log('[TypeReference] skip', referencedType);
            return;
        }

        const referenceFilePath = getImportMap(context.source)[referencedType];
        if (referenceFilePath && referencedType) {
            const definition = getDeclaration(context.program, referenceFilePath, referencedType);
            if (!definition) {
                // console.log('[TypeReference] failed finding typeReference for', referencedType);
                return;
            }

            return resolveTypeDefinition(context, node, result, referencedType, definition);
        }

        // not in imports — look for a local declaration in the current source file
        if (referencedType) {
            const localNode = findIdentifier(context.source, referencedType);
            if (localNode) {
                return resolveTypeDefinition(context, node, result, referencedType, {
                    node: localNode,
                    ast: context.source
                });
            }
        }
    },
    // PropertySignature ```type [TypeLiteral] = { [PropertySignature] }```
    [ts.SyntaxKind['PropertySignature']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        if (!Array.isArray(result.properties)) {
            console.log('Warning [PropertySignature]:', 'expected result.properties to be an array');
            result.properties = [];
        }
        const property = {
            kindType: 'PropertySignature',
            text: node.getText(context.source),
            comment: getDocs(context.source, node)?.comment
        };

        parseChildren(context, node, property);
        result.properties.push(property);
    }
} as const;

function parseChildren(context: ParseContext, node: ts.Node, result?: O) {
    const returnValues = [];
    node.forEachChild((child) => {
        if (parser[child.kind]) {
            const value = parser[child.kind](context, child, result);
            if (value) {
                returnValues.push(value);
            }
        }
    });
    return returnValues;
}

function parseClassDeclaration(program: Program, ast: SourceFile, classDeclaration: ts.ClassDeclaration) {
    const importMap = getImportMap(ast);
    const types: ReturnType<typeof parseType>[] = [];
    let constructor: ReturnType<typeof parseConstructor> | undefined = undefined;
    const properties: ReturnType<typeof parseProperty>[] = [];
    const methods: ReturnType<typeof parseMethod>[] = [];

    classDeclaration.forEachChild((child) => {
        if (ts.isHeritageClause(child)) {
            const inheritedClassName = pointer.get<string>(child, 'types/0/expression/escapedText');
            const inheritedFilePath = inheritedClassName ? importMap[inheritedClassName] : undefined;
            if (inheritedFilePath) {
                const definition = getDeclaration(program, inheritedFilePath, inheritedClassName);
                if (definition && ts.isClassDeclaration(definition.node)) {
                    const docs = parseClassDeclaration(program, definition.ast, definition.node);
                    properties.push(...docs.properties);
                    methods.push(...docs.methods);
                }
            }
            return;
        }

        switch (ts.SyntaxKind[child.kind]) {
            case 'TypeParameter':
                types.push(parseType(ast, child));
                break;
            case 'Constructor':
                constructor = parseConstructor(ast, child);
                break;
            case 'PropertyDeclaration': {
                properties.push(parseProperty(ast, child));
                break;
            }
            case 'MethodDeclaration': {
                methods.push(parseMethod(ast, child));
                break;
            }
            default:
            // console.log("unhandled", get(child, 'Identifier')?.getText(ast)));
        }
    });

    const docs = {
        name: get(classDeclaration, 'Identifier')?.getText(ast),
        types,
        kind: ts.SyntaxKind[classDeclaration.kind],
        filepath: ast.fileName,
        constructor,
        properties,
        methods
    };

    return docs;
}

function getDocumentationFor(identifier: string, filepath: string, skipInlining: string[]) {
    const filePath = path.join(process.cwd(), 'packages', filepath);
    const program = ts.createProgram([filePath], {
        baseUrl: process.cwd(),
        strictNullChecks: true,
        paths: { 'headless-json-editor': ['packages/headless-json-editor/src/index.ts'] }
    });
    const ast = program.getSourceFile(filePath);
    if (ast == null) {
        throw new Error(`failed building ast from '${filePath}'`);
    }

    const targetNode = findIdentifier(ast, identifier);
    if (targetNode == null) {
        throw new Error(`failed finding Node '${identifier}' in '${filePath}'`);
    }

    if (ts.isClassDeclaration(targetNode)) {
        return parseClassDeclaration(program, ast, targetNode);
    }

    if (ts.isTypeAliasDeclaration(targetNode)) {
        return parser[targetNode.kind]({ program, source: ast, skipInlining }, targetNode);
    }

    if (ts.isFunctionDeclaration(targetNode)) {
        return parser[targetNode.kind]({ program, source: ast, skipInlining }, targetNode);
    }

    console.log('found target node', identifier, ts.SyntaxKind[targetNode.kind], targetNode.kind);
}

const docs = {
    Editor: getDocumentationFor('Editor', 'react-json-editor/src/Editor.ts', ['JsonSchema'])
    // EditorOptions: getDocumentationFor('EditorOptions', 'react-json-editor/src/Editor.ts', ['JsonSchema']),
    // useEditor: getDocumentationFor('useEditor', 'react-json-editor/src/useEditor.ts', [
    //     'UseEditorOptions',
    //     'WidgetPlugin'
    // ])
    // useEditorOptions: getDocumentationFor('UseEditorOptions', 'react-json-editor/src/useEditor.ts', ['JsonSchema'])
};
fs.writeFileSync(path.join(process.cwd(), 'docs/generated/api/docs.json'), JSON.stringify(docs, null, 2), 'utf-8');
// console.log(typeDocs);
