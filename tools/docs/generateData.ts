/* eslint-disable max-len */
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// ts-ast-viewer.com/
import path from 'node:path';
import fs from 'node:fs';
import ts, { type SourceFile, type Program, SyntaxKind } from 'typescript';
import { get } from './utils/get';
import { getImportMap } from './utils/getImportMap';
import { getDocs } from './utils/getDocs';
import { getDeclaration } from './utils/getDeclaration';
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
    /** tracks declaration nodes currently being expanded to prevent circular reference loops */
    resolving: Set<ts.Node>;
};

const JSX_KINDS = new Set([SyntaxKind.JsxElement, SyntaxKind.JsxSelfClosingElement, SyntaxKind.JsxFragment]);

function containsJsx(node: ts.Node): boolean {
    if (JSX_KINDS.has(node.kind)) return true;
    let found = false;
    node.forEachChild((child) => {
        if (!found) found = containsJsx(child);
    });
    return found;
}

function getReturnType(context: ParseContext, node: ts.Node) {
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

type Definition = { node: ts.Node; ast: ts.SourceFile };

function resolveTypeDefinition(
    context: ParseContext,
    node: ts.Node,
    result: O,
    referencedType: string,
    definition: Definition
) {
    if (context.resolving.has(definition.node)) {
        // circular reference — this declaration node is already being expanded upstream
        result.type = referencedType;
        return;
    }
    context.resolving.add(definition.node);
    result.referenced = true;
    const newContext = { ...context, source: definition.ast, isReferenced: true };
    const typeNode = (definition.node as ts.TypeAliasDeclaration).type;
    if (context.inlineDeclaration === true && typeNode) {
        result.kindType = SyntaxKind[typeNode.kind];
        if (parser[typeNode.kind] == null) {
            throw new Error(`Missing type parser for '${SyntaxKind[typeNode.kind]}' (${typeNode.kind})`);
        }
        const inlineResult = parser[typeNode.kind](newContext, typeNode, result);
        context.resolving.delete(definition.node);
        return inlineResult;
    }
    result.kindType = SyntaxKind[definition.node.kind];
    const parseResult = parseChildren(newContext, definition.node, result);
    context.resolving.delete(definition.node);
    return parseResult;
}

function isTypeArgument(node: ts.Node) {
    return (
        node.parent != null &&
        ts.isTypeReferenceNode(node.parent) &&
        !!node.parent.typeArguments?.includes(node as ts.TypeReferenceNode)
    );
}

const parser = {
    [SyntaxKind['Identifier']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.name = node.getText(context.source);
    },
    [SyntaxKind['ExportKeyword']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.isExported = true;
    },
    [SyntaxKind['FunctionDeclaration']]: (context: ParseContext, node: ts.Node) => {
        const fnNode = node as ts.FunctionDeclaration;
        const returns = getReturnType(context, node);
        const result = {
            ...getDocs(context.source, node),
            kindType: 'FunctionDeclaration',
            returns,
            isComponent: fnNode.body ? containsJsx(fnNode.body) : false
        };
        parseChildren(context, node, result);
        return result;
    },
    [SyntaxKind['Parameter']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.parameter = result.parameter ?? [];
        const meta = {
            ...getDocs(context.source, node),
            text: node.getText(context.source)
        };
        result.parameter.push(meta);
        parseChildren(context, node, meta);
    },
    // TYPES
    [SyntaxKind['QuestionToken']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.optional = true;
    },
    [SyntaxKind['TypeParameter']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.typeParameter = result.typeParameter ?? [];
        const parameter = {
            kindType: 'TypeParameter',
            text: node.getText(context.source)
        };
        result.typeParameter.push(parameter);
        parseChildren(context, node, parameter);
    },
    [SyntaxKind['UnknownKeyword']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.default = 'unknown';
    },
    [SyntaxKind['LiteralType']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.text = node.getText(context.source);
        return result;
    },
    [SyntaxKind['TypeAliasDeclaration']]: (context: ParseContext, node: ts.Node) => {
        const localResult = {
            ...getDocs(context.source, node),
            kindType: 'TypeAliasDeclaration'
        };
        // we parse a declaration and want references inlined
        context.inlineDeclaration = true;
        parseChildren(context, node, localResult);
        return localResult;
    },
    [SyntaxKind['UnionType']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.kindType = 'UnionType';
        result.text = node.getText(context.source);
        result.types = parseChildren(context, node);
        // @todo does not add any types
        return result;
    },
    [SyntaxKind['IntersectionType']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        if (context.inlineDeclaration && context.isReferenced) {
            return parseChildren(context, node);
        }

        const docs = getDocs(context.source, node);
        result.comment = docs.comment;
        result.tags = docs.tags;
        result.types = parseChildren(context, node);
        return result;
    },
    [SyntaxKind['FunctionType']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.type = {
            ...getDocs(context.source, node),
            kindType: 'FunctionType',
            text: node.getText(context.source)
        };
        parseChildren(context, node, result);
        return result;
    },
    // TypeLiteral ```type [TypeLiteral] = { [PropertySignature] }```
    [SyntaxKind['TypeLiteral']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        result.properties = [];
        parseChildren(context, node, result);
        return result;
    },
    [SyntaxKind['TypeReference']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        const referencedType = pointer.get<string>(node, 'typeName/escapedText');

        if (referencedType && context.skipInlining.includes(referencedType)) {
            return;
        }

        // Shallow mode: not inside a TypeAliasDeclaration — record the type name with its source filepath
        if (context.inlineDeclaration !== true) {
            const importedPath = referencedType ? getImportMap(context.source)[referencedType] : undefined;
            const absolutePath = importedPath ?? context.source.fileName;
            const typeRef = {
                kindType: 'TypeReference',
                name: referencedType,
                filepath: path.relative(process.cwd(), absolutePath)
            };
            if (isTypeArgument(node)) {
                result.typeArgs = result.typeArgs ?? [];
                result.typeArgs.push(typeRef);
            } else {
                result.type = typeRef;
            }
            return;
        }

        // Deep inlining mode: resolve and expand the referenced type
        const nextResult: O = { kindType: 'TypeReference' };
        if (isTypeArgument(node)) {
            result.typeArgs = [nextResult];
        } else {
            result.type = nextResult;
        }
        parseChildren(context, node, nextResult);

        if (!referencedType) return;

        const referenceFilePath = getImportMap(context.source)[referencedType];
        if (referenceFilePath) {
            const definition = getDeclaration(context.program, referenceFilePath, referencedType);
            if (!definition) return;
            return resolveTypeDefinition(context, node, result, referencedType, definition);
        }

        const localNode = findIdentifier(context.source, referencedType);
        if (localNode) {
            return resolveTypeDefinition(context, node, result, referencedType, {
                node: localNode,
                ast: context.source
            });
        }
    },
    [SyntaxKind['PropertyDeclaration']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        const typeKind = pointer.get<number | undefined>(node, '/type/kind');
        const property: O = {
            ...getDocs(context.source, node),
            kindType: 'PropertyDeclaration',
            name: pointer.get(node, '/name/escapedText'),
            typeKind: typeKind ? SyntaxKind[typeKind] : undefined,
            optional: pointer.get(node, '/questionToken/') != null,
            text: node.getText(context.source)
        };
        result.properties = result.properties ?? [];
        result.properties.push(property);
    },
    [SyntaxKind['MethodDeclaration']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        const method: O = {
            ...getDocs(context.source, node),
            kindType: 'MethodDeclaration',
            text: node.getText(context.source),
            returns: getReturnType(context, node)
        };
        parseChildren(context, node, method);
        result.methods = result.methods ?? [];
        result.methods.push(method);
    },
    [SyntaxKind['Constructor']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        const ctor: O = {
            ...getDocs(context.source, node),
            kindType: 'Constructor',
            returns: getReturnType(context, node)
        };
        parseChildren(context, node, ctor);
        result['constructor'] = ctor;
    },
    [SyntaxKind['HeritageClause']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        const inheritedClassName = pointer.get<string>(node, 'types/0/expression/escapedText');
        const inheritedFilePath = inheritedClassName ? getImportMap(context.source)[inheritedClassName] : undefined;
        if (inheritedFilePath && inheritedClassName) {
            const definition = getDeclaration(context.program, inheritedFilePath, inheritedClassName);
            if (definition && ts.isClassDeclaration(definition.node)) {
                const inherited: O = { properties: [], methods: [] };
                parseChildren({ ...context, source: definition.ast }, definition.node, inherited);
                result.properties = result.properties ?? [];
                result.methods = result.methods ?? [];
                result.properties.push(...(inherited.properties ?? []));
                result.methods.push(...(inherited.methods ?? []));
            }
        }
    },
    [SyntaxKind['ClassDeclaration']]: (context: ParseContext, node: ts.Node) => {
        const result: O = {
            ...getDocs(context.source, node),
            kindType: 'ClassDeclaration',
            filepath: context.source.fileName,
            properties: [],
            methods: []
        };
        parseChildren(context, node, result);
        return result;
    },
    // PropertySignature ```type [TypeLiteral] = { [PropertySignature] }```
    [SyntaxKind['PropertySignature']]: (context: ParseContext, node: ts.Node, result: O = {}) => {
        if (!Array.isArray(result.properties)) {
            console.log('Warning [PropertySignature]:', 'expected result.properties to be an array');
            result.properties = [];
        }
        const property = {
            kindType: 'PropertySignature',
            text: node.getText(context.source),
            ...getDocs(context.source, node)
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

function getDocumentationFor(identifier: string, filepath: string, skipInlining: string[]) {
    const filePath = path.join(process.cwd(), 'packages', filepath);
    const program = ts.createProgram([filePath], {
        baseUrl: process.cwd(),
        strictNullChecks: true,
        jsx: ts.JsxEmit.ReactJSX,
        jsxImportSource: 'react',
        typeRoots: [path.join(process.cwd(), 'node_modules/@types')],
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

    if (parser[targetNode.kind] == null) {
        throw new Error(`There is no parser yet for '${identifier}' (${SyntaxKind[targetNode.kind]}) defined`);
    }

    return parser[targetNode.kind]({ program, source: ast, skipInlining, resolving: new Set() }, targetNode);
}

const docs = {
    Editor: getDocumentationFor('Editor', 'react-json-editor/src/Editor.ts', ['JsonSchema']),
    EditorOptions: getDocumentationFor('EditorOptions', 'react-json-editor/src/Editor.ts', ['JsonSchema']),
    setDefaultWidgets: getDocumentationFor('setDefaultWidgets', 'react-json-editor/src/Editor.ts', ['JsonSchema']),
    useEditor: getDocumentationFor('useEditor', 'react-json-editor/src/useEditor.ts', [
        'UseEditorOptions',
        'WidgetPlugin'
    ]),
    useEditorOptions: getDocumentationFor('UseEditorOptions', 'react-json-editor/src/useEditor.ts', ['JsonSchema']),
    useEditorPlugin: getDocumentationFor('useEditorPlugin', 'react-json-editor/src/useEditorPlugin.ts', [
        'UseEditorOptions',
        'WidgetPlugin'
    ]),
    Widget: getDocumentationFor('Widget', 'react-json-editor/src/components/widget/Widget.tsx', ['JsonSchema']),
    WidgetProps: getDocumentationFor('WidgetProps', 'react-json-editor/src/components/widget/Widget.tsx', [
        'JsonNode',
        'Editor'
    ])
};
fs.writeFileSync(path.join(process.cwd(), 'docs/generated/api.json'), JSON.stringify(docs, null, 2), 'utf-8');
// console.log(typeDocs);
