import ts from 'typescript';

export type DocTag = {
    tag: string;
    comment: string | undefined;
    name?: string;
};

export type JSDocInfo = {
    comment: string | undefined;
    tags: DocTag[];
};

/**
 * Extracts JSDoc comment and full text for a node
 */
export function getDocs(ast: ts.SourceFile, node: ts.Node): JSDocInfo {
    let jsDocText: string | undefined;
    let tags: DocTag[] = [];

    if ('jsDoc' in node && Array.isArray((node as any).jsDoc)) {
        const jsDocs = node.jsDoc as ts.JSDoc[];
        if (jsDocs.length > 0) {
            jsDocText = stripJsDocDelimiters(jsDocs.map((doc) => doc.getFullText(ast)).join('\n'));
            tags = jsDocs.flatMap((doc) => (doc.tags ?? []).map(parseTag));
        }
    }

    return {
        comment: jsDocText,
        tags
    };
}

function parseTag(tag: ts.JSDocTag): DocTag {
    const name = ts.isJSDocParameterTag(tag) ? (tag.name as ts.Identifier).text : undefined;
    return {
        tag: tag.tagName.text,
        comment: parseComment(tag),
        ...(name !== undefined && { name })
    };
}

function stripJsDocDelimiters(text: string): string {
    return text
        .replace(/^\/\*\*\s*/m, '') // remove opening /**
        .replace(/\s*\*\/\s*$/m, '') // remove closing */
        .replace(/^\s*\* ?/gm, '') // remove leading * on each line
        .replace(/^\s*@param.*$/gm, '') // remove leading * on each line
        .replace(/^\s*@returns?.*$/gm, '') // remove leading * on each line
        .trim();
}

function parseComment(tag: ts.JSDocTag): string | undefined {
    let comment: string | undefined;
    if (typeof tag.comment === 'string') {
        comment = tag.comment;
    }
    if (Array.isArray(tag.comment)) {
        comment = tag.comment.map((c) => c.text).join('');
    }
    return comment?.replace(/^[ -]+/, '');
}
