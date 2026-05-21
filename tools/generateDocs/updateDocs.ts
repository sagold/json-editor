import query from '@sagold/json-query';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const apiDocsPath = path.join(process.cwd(), 'docs', 'generated', 'api', 'docs.json');
const apiDocs = JSON.parse(fs.readFileSync(apiDocsPath, 'utf8'));

function createDocs(identifier: string) {
    // "name": "Editor",
    // "variant": "declaration",
    const results = query.get(apiDocs, `/**/*?name:${identifier}&&variant:"declaration"`);
    if (results.length !== 1) {
        throw new Error(`Found ${results.length} results for '${identifier}' where exactly 1 is expected`);
    }

    const result = results[0];
    const entity = {
        name: result.name,
        kind: ts.SyntaxKind[result.kind]
    };

    return entity;
}

const docs = createDocs('Editor');
console.log(docs);
