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
export function getDocs(_ast: ts.SourceFile, node: ts.Node): JSDocInfo {
    let jsDocText: string | undefined;
    let tags: DocTag[] = [];

    if ('jsDoc' in node && Array.isArray((node as any).jsDoc)) {
        const jsDocs = node.jsDoc as ts.JSDoc[];
        if (jsDocs.length > 0) {
            jsDocText = jsDocs
                .map((doc) => parseJsDocComment(doc.comment))
                .filter(Boolean)
                .join('\n') || undefined;
            tags = jsDocs.flatMap((doc) => (doc.tags ?? []).map(parseTag));
        }
    }

    return {
        comment: jsDocText,
        tags
    };
}

function parseTag(tag: ts.JSDocTag): DocTag {
    const name = ts.isJSDocParameterTag(tag) ? entityNameToString(tag.name) : undefined;
    return {
        tag: tag.tagName.text,
        comment: parseComment(tag),
        ...(name !== undefined && { name })
    };
}

function entityNameToString(name: ts.EntityName): string {
    if (ts.isIdentifier(name)) return name.text;
    return entityNameToString(name.left) + '.' + name.right.text;
}

function parseJsDocComment(comment: ts.JSDoc['comment']): string | undefined {
    if (typeof comment === 'string') return comment.trim() || undefined;
    if (Array.isArray(comment)) return comment.map((c) => c.text).join('').trim() || undefined;
    return undefined;
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
