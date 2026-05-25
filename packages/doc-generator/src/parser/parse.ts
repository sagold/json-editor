import path from 'node:path';
import ts, { SyntaxKind } from 'typescript';
import { getKindName } from './utils/getKindName';
import query from '@sagold/json-query';

import { kindParser } from './kindParser';
import type { Context, Result } from './types';
import { JSDocInfo } from './utils/getDocs';

export type APIDocs = Omit<Result, 'docs'> & { comment?: JSDocInfo['comment']; tags?: JSDocInfo['tags'] };

const ignoreNodes: (keyof typeof SyntaxKind)[] = [
    'EndOfFileToken',
    'Block',
    'BinaryExpression',
    'EqualsGreaterThanToken',
    'ImportDeclaration'
];

function parseChildren(context: Context, node: ts.Node, result: Result, skipNodes: ts.Node[] = []) {
    node.forEachChild((child) => {
        const kindName = getKindName(child);
        if (ignoreNodes.includes(kindName) || skipNodes.includes(child)) {
            return;
        }
        parseNode(context, child, result);
    });
}

function parseNode(context: Context, node: ts.Node, result: Result) {
    const parseKind = kindParser[node.kind];
    if (parseKind == null) {
        console.log(`[parseNode] '${getKindName(node)}' not implemented`);
        return;
    }
    parseKind(context, node, result);
}

/**
 * Parses the list of filenames, returning an object containing all encountered identifiers
 * and their definition as root properties.
 *
 * @caveat same names will cause a collision and duplicates will be overwritten
 */
export function parse(filepaths: string[]): APIDocs {
    const program = ts.createProgram(filepaths, {
        baseUrl: process.cwd(),
        strictNullChecks: true,
        jsx: ts.JsxEmit.ReactJSX,
        jsxImportSource: 'react',
        typeRoots: [path.join(process.cwd(), 'node_modules/@types')],
        paths: {
            'headless-json-editor': ['packages/headless-json-editor/src/index.ts'],
            '@sagold/react-json-editor': ['packages/react-json-editor/src/index.ts'],
            '@sagold/rje-mantine-widgets': ['packages/rje-mantine-widgets/src/index.ts'],
            '@sagold/rje-code-widgets': ['packages/rje-code-widgets/src/index.ts']
        }
    });

    const docData: Result = {};

    filepaths.forEach((filepath) => {
        const sourceFile = program.getSourceFile(filepath);
        if (sourceFile == null) {
            throw new Error(`[parse] failed to create source file for '${filepath}'`);
        }
        const result: Record<string, Result> = {};
        const context: Context = { program, source: sourceFile, parseChildren, parseNode, export: result };
        // @attention might turn out that we better collect declarations from kindParser parsers
        // parseChildren(context, context.source, result);
        context.source.forEachChild((child) => {
            if (ignoreNodes.includes(getKindName(child))) {
                return;
            }
            const nodeResult: Result = {};
            parseNode(context, child, nodeResult);
            if (nodeResult.name) {
                result[nodeResult.name] = nodeResult;
            }
        });

        Object.assign(docData, result);
    });

    // finally we simpliy docs and shift properties directly on parent
    query.get(docData, '**/*?docs', (value) => {
        if (Array.isArray(value.docs?.tags) && value.docs.tags.length > 0) {
            value.tags = value.docs.tags;
        }
        if (typeof value.docs?.comment === 'string' && value.docs.comment.trim() !== '') {
            value.comment = value.docs.comment;
        }
        delete value.docs;
    });

    return docData;
}
