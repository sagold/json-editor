import fs from 'node:fs';
import path from 'node:path';
import query from '@sagold/json-query';
import apiData from '../../docs/generated/api.json' with { type: 'json' };
import * as render from './render';
import { getDeclaration } from './utils/getDeclaration';

const EOL = '\n';
const SEPARATOR = ' · ';

type APIData = typeof apiData;

function getDeclarationType(entity: Record<string, any>) {
    if (entity.kindType === 'ClassDeclaration') {
        return 'Class';
    }
    if (entity.kindType === 'TypeAliasDeclaration') {
        return 'Type';
    }
    if (entity.kindType === 'VariableDeclaration') {
        return entity?.type?.name ?? 'Value';
    }
    if (entity.kindType === 'FunctionDeclaration') {
        return entity.name.startsWith('use') ? 'Hook' : entity.isComponent ? 'Component' : 'Function';
    }
    return entity.kindType;
}

// const property = (property: Record<string, any>) => `### \`${property.text}\`${EOL}
// ${property.comment ? `${property.comment}${EOL}` : ''}`;

const getTag = (tags: { tag: string; name: string; comment: string }[], type: string, name?: string) =>
    tags.find((tag) => tag.tag === type && (name == null || tag.name === name));

const getTags = (tags: { tag: string; name: string; comment: string }[], type: string) =>
    tags.filter((tag) => tag.tag === type);

const getReturnsTag = (tags: { tag: string; comment: string }[]) => tags.find((tag) => tag.tag === 'returns');

const method = (method: Record<string, any>) => {
    const returns = getReturnsTag(method.tags);
    const hasReturns = method.returns && method.returns !== '' && method.returns !== 'void';
    const caveat = getTags(method.tags, 'caveat');

    const doc = [
        `### \`${method.name}\``,
        '',
        // usage example
        ...render.codeBlock(method.text.replace(/\s*{(.|\n)*$/, '')),
        // method description
        maybe('', method.comment),
        maybe(method.comment),
        maybe('', method.comment),
        maybe('#### Parameters', method.parameter?.length),
        '',
        ...(method.parameter?.map(
            (param) => `- **\`${param.name}\`** ${getTag(method.tags, 'param', param.name)?.comment ?? ''}`
        ) ?? []),
        '',
        // returns
        maybe('#### Returns', hasReturns),
        maybe('', hasReturns),
        maybe(`**\`${method.returns}\`** ${returns?.comment ?? ''}`, hasReturns),
        maybe('', hasReturns),
        // caveat
        maybe('', caveat?.length),
        maybe('#### Caveats', caveat?.length),
        maybe('', caveat?.length),
        ...(caveat?.map((c) => `- ${c.comment}`) ?? []),
        maybe('', caveat?.length)
    ];

    return doc;
};

function maybe(content?: string, test?: any) {
    return arguments.length === 1 ? (content ? content : null) : test ? content : null;
}

function maybeAll(test?: any, ...contents: (string | null)[]) {
    return test ? contents : [];
}

/** returns a flat list of strings, removing nested arrays */
function flat(list: (string | string[])[]) {
    if (list == null) {
        return [];
    }
    const result = [];
    list.forEach((item) => {
        if (Array.isArray(item)) {
            result.push(...flat(item));
            return;
        }
        result.push(item);
    });
    return result;
}

const generate = {
    VariableDeclaration: (api: APIData, data: Record<string, any>) => {
        const doc = [
            `${data.comment}`,
            ...render.codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            // object
            ...maybeAll(data.properties.length, '## Properties'),
            maybe('', data.properties?.length),
            ...flat(
                data.properties?.map((property) => [
                    `### ${property.name}`,
                    '',
                    ...render.codeBlock(`${property.text}`),
                    '',
                    maybe(property.comment),
                    maybe('', property.comment),
                    ...maybeAll(
                        property.parameter?.length,
                        '#### Parameter',
                        '',
                        ...flat(
                            property.parameter?.map((param) => {
                                const comment = getTag(property.tags, 'param', param.name)?.comment;
                                return `- **\`${param.name}\`** ${comment ?? ''}`;
                            })
                        ),
                        '',
                        ...maybeAll(
                            property.type?.returns ?? getTag(property.tags, 'returns'),
                            '#### Returns',
                            '',
                            `${property.type?.returns ? `**\`${property.type?.returns}\`**` : ''} ${getTag(property.tags, 'returns')?.comment}`
                        )
                    )
                ])
            )
        ];

        return doc;
    },
    TypeAliasDeclaration: (api: APIData, data: Record<string, any>) => {
        // inconsistent due to Type<SubType> vs Type = {}
        const properties =
            data.properties ||
            data.type?.properties ||
            flat(data.types?.map((type) => type?.properties)).filter((v) => v != null);

        const doc = [
            `${data.comment}`,
            ...render.codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            // properties
            maybe('## Properties', data.properties?.length),
            maybe('', properties?.length),
            ...flat(
                properties?.map((property) => [
                    `### ${property.name}`,
                    '',
                    ...render.codeBlock(`${property.text}`),
                    '',
                    maybe(property.comment),
                    maybe('', property.comment),
                    ...maybeAll(
                        property.parameter?.length,
                        '#### Parameter',
                        '',
                        ...flat(
                            property.parameter?.map((param) => {
                                const comment = getTag(property.tags, 'param', param.name)?.comment;
                                return `- **\`${param.name}\`** ${comment ?? ''}`;
                            })
                        ),
                        '',
                        ...maybeAll(
                            property.type?.returns ?? getTag(property.tags, 'returns'),
                            '#### Returns',
                            '',
                            `${property.type?.returns ? `**\`${property.type?.returns}\`**` : ''} ${getTag(property.tags, 'returns')?.comment}`
                        )
                    )
                ])
            ),
            maybe('', data.properties?.length)
        ];
        return doc;
    },
    FunctionDeclaration: (api: APIData, data: Record<string, any>) => {
        // function parameters
        const { parameter } = data;
        // returns comment
        const returnsTag = getTag(data.tags, 'returns', undefined);
        const hasReturns = data.returns || returnsTag?.comment;

        const doc = [
            // comment
            `${data.comment}`,
            // usage
            ...render.codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            maybe(`## ${data.isComponent ? 'Properties' : 'Parameters'}`, parameter?.length),
            maybe('', parameter?.length)
        ];

        // ## properties
        if (parameter?.length > 0) doc.push();
        parameter?.map((param) => {
            doc.push(`### \`${param.name}${param.type?.name ? `: ${param.type.name}` : ''}\``);
            if (param.type?.kindType === 'TypeReference') {
                const propertiesTypeName = param.type.name;
                // print all properties from prop-type
                api[propertiesTypeName]?.properties?.forEach((typeProperty) => {
                    const tag = getTag(data.tags, 'param', `${param.name}.${typeProperty.name}`) ?? '';

                    if (typeProperty.kindType === 'UnionType') {
                        doc.push(`- **\`${typeProperty.name}: ${typeProperty.text}\`** ${tag?.comment ?? ''}`);
                    } else {
                        doc.push(`- **\`${typeProperty.text}\`** ${tag?.comment ?? ''}`);
                    }
                });
            }
        });

        // ## returns
        doc.push(
            ...maybeAll(
                hasReturns,
                '',
                '## Returns',
                '',
                `**\`${data.returns ? data.returns : ''}\`** ${returnsTag?.comment ?? ''}`,
                ''
            )
        );

        return doc;
    },
    ClassDeclaration: (api: APIData, data: Record<string, any>) => {
        // constructor parameters
        const { parameter } = data?.['constructor'];
        // @returns tag
        const returnsTag = data.tags?.find((tag) => tag.tag === 'returns');

        const doc: string[] = [
            // comment
            maybe(data.comment),
            // usage
            ...render.codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            // parameter
            maybe('## Parameters', parameter?.length),
            maybe('', parameter?.length)
        ];

        // ## parameters
        parameter?.map((param) => {
            doc.push(`### \`${param.name}${param.type?.name ? `: ${param.type?.name}` : ''}\``);

            if (param.type.kindType === 'TypeReference' && api[param.type.name]) {
                const referencedName = param.type.name;
                const referencedType = api[referencedName];
                const properties = query.get(referencedType, '**/properties/*', query.get.VALUE);
                // print all properties from prop-type
                properties.forEach((typeProperty) => {
                    const tag = getTag(data.tags, 'param', `${param.name}.${typeProperty.name}`) ?? '';
                    doc.push(
                        '',
                        `#### ${typeProperty.name}${typeProperty.optional ? '' : ' (required)'}`,
                        ...render.codeBlock(typeProperty.text),
                        typeProperty.comment
                    );
                    // if (typeProperty.kindType === 'UnionType') {
                    //     doc.push(`- **\`${typeProperty.name}: ${typeProperty.text}\`** ${tag?.comment ?? ''}`);
                    // } else {
                    //     doc.push(`- **\`${typeProperty.text}\`** ${tag?.comment ?? ''}`);
                    // }
                });
            }
        });

        doc.push(
            // ## returns
            ...maybeAll(returnsTag?.comment, '', '## Returns', '', returnsTag?.comment, ''),

            // ## Instance Properties
            // if (data.properties?.length > 0) doc += `## Properties${EOL}${EOL}`;
            // doc += data.properties?.map(property).join(EOL);

            // ## Instance Methods
            ...maybeAll(
                data.methods?.length,
                `## Methods`,
                '',
                data.methods
                    ?.filter((m) => m.kindType === 'MethodDeclaration')
                    .map((entity) => `[${entity.name}](#${entity.name.toLowerCase()})`)
                    .join(SEPARATOR),
                '',
                ...flat(data.methods?.filter((m) => m.kindType === 'MethodDeclaration').map(method)),
                ''
            )

            // ## Usage

            // ## Caveat
        );

        return doc;
    }
};

type GenerateDocsArgs = {
    data: APIData;
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

    if (generate[entity.kindType] == null) {
        console.error(`Entity type '${entity.kindType}' is not yet implemented. Skipping '${identifier}'`);
        return;
    }

    // create docs
    const docs = generate[entity.kindType](data, entity) as (string | null)[];
    try {
        // append snippets
        const usage = fs.readFileSync(path.join(folderPath, `${entity.name}-usage.md`), 'utf8');
        docs.push(...usage.split(EOL));
    } catch (e) {}
    combine.forEach(({ identifier, header }) => {
        const entity = data[identifier];
        const combineDocs = generate[entity.kindType](data, entity) as (string | null)[];
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

const rjeAPI: Omit<GenerateDocsArgs, 'identifier'> = {
    data: apiData,
    folderPath: path.join(process.cwd(), 'docs', 'src', 'api'),
    location: 'api'
};
generateDocs({ ...rjeAPI, identifier: 'Editor' });
generateDocs({ ...rjeAPI, identifier: 'Widget' });
generateDocs({ ...rjeAPI, identifier: 'setDefaultWidgets' });
generateDocs({ ...rjeAPI, identifier: 'useEditor' });
generateDocs({ ...rjeAPI, identifier: 'useEditorPlugin' });
generateDocs({ ...rjeAPI, identifier: 'WidgetPlugin' });

const rjeMantineWidgetsAPI: Omit<GenerateDocsArgs, 'identifier'> = {
    data: apiData,
    folderPath: path.join(process.cwd(), 'docs', 'src', 'api', 'widgets'),
    location: 'api/widgets'
};
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'ArrayWidgetPlugin',
    combine: [{ identifier: 'ArrayOptions', header: 'JSON Schema Options' }]
});
generateDocs({ ...rjeMantineWidgetsAPI, identifier: 'BooleanWidgetPlugin' });
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'DateWidgetPlugin',
    combine: [{ identifier: 'DateOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'MultiSelectWidgetPlugin',
    combine: [{ identifier: 'MultiSelectOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'NullWidgetPlugin',
    combine: [{ identifier: 'NullOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'ObjectWidgetPlugin',
    combine: [{ identifier: 'ObjectOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'OneOfSelectWidgetPlugin',
    combine: [{ identifier: 'OneOfSelectOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'StringWidgetPlugin',
    combine: [{ identifier: 'StringOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'ColorWidgetPlugin',
    combine: [{ identifier: 'ColorOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'NumberWidgetPlugin',
    combine: [{ identifier: 'NumberOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'SelectWidgetPlugin',
    combine: [{ identifier: 'SelectOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'TagListWidgetPlugin',
    combine: [{ identifier: 'TagListOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'TextWidgetPlugin',
    combine: [{ identifier: 'TextOptions', header: 'JSON Schema Options' }]
});
generateDocs({
    ...rjeMantineWidgetsAPI,
    identifier: 'UnknownWidgetPlugin'
});
