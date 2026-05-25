import ts from 'typescript';
import pointer from '@sagold/json-pointer';

export type DocTag = {
    tag: string;
    comment: string | undefined;
    name?: string;
};

export type JSDocInfo = {
    comment?: string;
    tags?: DocTag[];
};

type DocResult = {
    comments: string[];
    tags: DocTag[];
};

function parseDocNode(node: ts.JSDoc, result: DocResult) {
    const comment = ts.getTextOfJSDocComment(node.comment);
    if (comment) {
        result.comments.push(comment);
    }
    node.tags?.forEach((tag) => {
        const name = pointer.get<string>(tag, 'name/escapedText');
        const typeParameters = pointer
            .get<ts.TypeParameter[]>(tag, 'typeParameters')
            ?.map((param) => pointer.get(param, 'name/escapedText'))
            .filter((name) => name != null)
            .join(', ') as string;

        const parsedTag = {
            comment: ts.getTextOfJSDocComment(tag.comment),
            tag: pointer.get<string>(tag, 'tagName/escapedText') ?? 'unknown tag',
            name: name ?? typeParameters
        };

        result.tags.push(parsedTag);
    });

    return result;
}

/**
 * Extracts JSDoc comment and full text for a node
 */
export function getDocs(node: ts.Node): undefined | JSDocInfo {
    const jsDocs = (node as any).jsDoc as undefined | ts.JSDoc[];
    if (jsDocs == null) {
        return undefined;
    }

    // lets simplify parsing all tags as there are a lot of them and
    // I do not want to add a parser for each node kind
    const result: DocResult = { comments: [], tags: [] };
    jsDocs.forEach((doc) => parseDocNode(doc, result));
    result.comments = result.comments.filter((comment) => comment != null && comment.trim() !== '');
    result.tags = result.tags.filter((tag) => tag !== null && Object.keys(tag).length > 0);
    // cleanup
    if (result.comments.length === 0 && result.tags.length === 0) {
        return undefined;
    }
    const jsDocInfo: JSDocInfo = {};
    if (result.comments.length > 0) {
        jsDocInfo.comment = result.comments.join('\n');
    }
    if (result.tags.length > 0) {
        jsDocInfo.tags = result.tags;
    }
    return jsDocInfo;
}
