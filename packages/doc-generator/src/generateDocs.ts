import fs from 'node:fs';
import path from 'node:path';
import { EOL } from './renderer/utils/EOL';
import { type APIDocs } from './parser/parse';
import { kindRenderer } from './renderer/kindRenderer';
import { SEPARATOR } from './renderer/utils/SEPARATOR';

function getDeclarationType(entity: Record<string, any>) {
    if (entity.kindName === 'ClassDeclaration') {
        return 'Class';
    }
    if (entity.kindName === 'TypeAliasDeclaration') {
        return 'Type';
    }
    if (entity.kindName === 'VariableDeclaration') {
        return entity?.type?.name ?? 'Value';
    }
    if (entity.kindName === 'FunctionDeclaration') {
        return entity.name.startsWith('use') ? 'Hook' : entity.isComponent ? 'Component' : 'Function';
    }
    return entity.kindName;
}

// const property = (property: Record<string, any>) => `### \`${property.text}\`${EOL}
// ${property.comment ? `${property.comment}${EOL}` : ''}`;

type GenerateDocsArgs = {
    data: APIDocs;
    identifier: string;
    location: string;
    folderPath: string;
    combine?: {
        identifier: string;
        header: string;
    }[];
};

/**
 * @param location  folder for storybook sidebar location, e.g. {location}/{identifier}.
 */
function generateDocs(settings: GenerateDocsArgs) {
    const { data, identifier, location, folderPath, combine = [] } = settings;

    const entity = data[identifier];
    if (entity == null) {
        console.error(`Entity '${identifier}' is not a root entity in api data. Skipping`);
        return;
    }

    if (kindRenderer[entity.kindName] == null) {
        console.error(`Entity type '${entity.kindName}' is not yet implemented. Skipping '${identifier}'`);
        return;
    }

    // create docs
    const docs = kindRenderer[entity.kindName](data, entity) as (string | null)[];
    try {
        // append snippets
        const usage = fs.readFileSync(path.join(folderPath, `${entity.name}-usage.md`), 'utf8');
        docs.push(...usage.split(EOL));
    } catch (e) {}
    combine.forEach(({ identifier, header }) => {
        const entity = data[identifier];
        if (entity == null) {
            console.log(`Failed combining entity '${identifier}' - not found in data`);
            return;
        }
        const combineDocs = kindRenderer[entity.kindName](data, entity) as (string | null)[];
        docs.push('', `## ${header}`, '', ...combineDocs);
        try {
            // append snippets
            const usage = fs.readFileSync(path.join(folderPath, `${entity.name}-usage.md`), 'utf8');
            docs.push(...usage.split(EOL));
        } catch (e) {}
    });

    // create main navigation
    const navigation = docs
        .filter((entry) => /^\s*## /.test(entry))
        .map((entry) => entry.replace(/^[ #]+/, ''))
        .map((entry) => `[${entry}](#${entry.toLowerCase().replace(/\s+/g, '-')})`);

    const relUrl = location
        .split('/')
        .map((_i) => '..')
        .join('/');

    // create header
    const type = getDeclarationType(entity);
    const breadCrumbs = location.split('/');
    breadCrumbs.shift(); // api
    breadCrumbs.unshift('API reference');
    breadCrumbs.push(identifier);

    const docsHeader = [
        '{/* generated */}',
        "import { Meta, Canvas } from '@storybook/addon-docs/blocks';",
        `import { DocsHeader } from '${relUrl}/components/DocsHeader';`,
        '',
        `<Meta title="${location}/${identifier}" />`,
        `<DocsHeader title="${identifier}" breadCrumbs="${breadCrumbs.join(' » ')}" type="${type}">`,
        `  ${navigation.join(SEPARATOR)}`,
        '</DocsHeader>',
        ''
    ];
    docs.unshift(...docsHeader);
    fs.writeFileSync(
        path.join(folderPath, `${entity.name}.generated.mdx`),
        docs.filter((v) => v != null && v !== 'undefined').join(EOL),
        'utf-8'
    );
}

const apiData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs', 'api2.json'), 'utf-8')) as APIDocs;

type Meta = {
    folderPath: string;
    identifier: string;
    combine?: { identifier: string; header: string }[];
};

const docFileContents = fs.readFileSync(path.join(process.cwd(), 'docs.json'), 'utf-8');
const docData = JSON.parse(docFileContents.replace(/\n\s+\/\/.*/g, '')) as {
    docs: (string | Meta)[];
};

docData.docs.forEach((doc) => {
    let settings: GenerateDocsArgs;
    if (typeof doc === 'string') {
        settings = {
            data: apiData,
            identifier: doc.split('/').pop() as string,
            location: doc.replace(/^.*\/src\//, '').replace(/\/[^/]+$/, ''),
            folderPath: doc.replace(/\/[^/]+$/, '')
        };
    } else {
        settings = {
            ...doc,
            location: doc.folderPath.replace(/^.*\/src\//, ''),
            data: apiData
        };
    }
    generateDocs(settings);
});
