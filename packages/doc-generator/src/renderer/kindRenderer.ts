import query from '@sagold/json-query';
import { type APIDocs, mergeType, isTypeLiteral, isIntersectionType, isTypeReference, TypeReference } from '../parser';
import { codeBlock, simpleCodeBlock } from './codeBlock';
import { method } from './method';
import { maybeAll } from './utils/maybeAll';
import { maybe } from './utils/maybe';
import { flat } from './utils/flat';
import { getTag } from './utils/getTag';
import { SEPARATOR } from './utils/SEPARATOR';
import { Result } from '../parser/types';

type WorkingDoc = (string | null | undefined)[];

type Context = {
    api: APIDocs;
    ignoreHeader?: boolean;
    ignoreReference?: string[];
};

const filterValidTypes = (v: Result) => v != null && Object.keys(v).length > 0;
function resolveTypeReference(ctx: Context, reference: APIDocs) {
    const properties: Result[] = [];
    const references: APIDocs[] = [];

    const mergedType = mergeType(
        { parseResult: ctx.api as Record<string, Result>, ignoreReference: ctx.ignoreReference ?? [] },
        reference,
        // @ts-expect-error todo types
        reference.typeArguments
    );
    if (isTypeLiteral(mergedType)) {
        properties.push(...(mergedType.properties ?? []));
    } else if (isIntersectionType(mergedType)) {
        mergedType.types.forEach((type) => {
            if (isTypeReference(type)) {
                references.push(type);
            } else if (isTypeLiteral(type)) {
                properties.push(...(type.properties ?? []));
            }
        });
    }

    return {
        properties: properties.filter(filterValidTypes),
        references: references.filter(filterValidTypes) as TypeReference[]
    };
}

export const kindRenderer = {
    VariableDeclaration: (ctx: Context, data: Record<string, any>) => {
        const doc = [
            `${data.comment}`,
            ...codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            // object
            ...maybeAll(data.properties.length, '## Properties'),
            maybe('', data.properties?.length),
            ...flat(
                data.properties?.map((property) => [
                    `#### ${property.name}`,
                    '',
                    ...simpleCodeBlock(`${property.text}`),
                    '',
                    maybe(property.comment),
                    maybe('', property.comment)
                    // ...maybeAll(
                    //     property.parameters?.length,
                    //     '#### Parameter',
                    //     '',
                    //     ...flat(property.parameters?.map((param) => `- **\`${param.name}\`** ${param.comment ?? ''}`)),
                    //     '',
                    //     ...maybeAll(
                    //         property.value?.returns,
                    //         '#### Returns',
                    //         '',
                    //         `${property.value?.returns?.type ? `**\`${property.value?.returns?.type}\`**` : ''} ${property.value?.returns?.comment ?? ''}`
                    //     )
                    // )
                ])
            )
        ];

        return doc;
    },
    TypeAliasDeclaration: (ctx: Context, data: Record<string, any>) => {
        const { api } = ctx;
        const { properties, references } = resolveTypeReference(ctx, data.type);
        const doc = [
            `${data.comment}`,
            ...codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            // properties
            maybe('## Properties', properties?.length && ctx.ignoreHeader !== true),
            maybe('', properties?.length),
            ...flat(
                // @ts-expect-error wrong types
                properties?.map((property) => [
                    `#### ${property.name}`,
                    '',
                    ...simpleCodeBlock(`${property.text}`),
                    '',
                    ...maybeAll(property.comment, '', property.comment ?? ''),
                    ...maybeAll(
                        property.type?.parameters?.length,
                        '##### Parameter',
                        '',
                        ...flat(
                            property.type?.parameters?.map((param) => {
                                return `- **\`${param.name}\`** ${param.comment ?? ''}`;
                            }) ?? []
                        ),
                        '',
                        ...maybeAll(
                            // @ts-expect-error wrong types
                            property.type?.returns ?? getTag(property.tags, 'returns'),
                            '##### Returns',
                            '',
                            `${property.type?.returns ? `**\`${property.type?.returns.type}\`**` : ''} ${property.type?.returns?.comment}`
                        )
                    )
                ])
            ),
            // log references
            maybe('', data.properties?.length),
            ...flat(
                references.map((ref) => {
                    const referencedEntity = api[ref.name];
                    if (referencedEntity == null) {
                        return [];
                    }
                    return [
                        `### Referenced from \`${ref.name}\``,
                        ...kindRenderer[referencedEntity.kindName]({ ...ctx, ignoreHeader: true }, referencedEntity)
                    ];
                })
            )
        ];
        return doc;
    },
    FunctionDeclaration: (ctx: Context, data: Record<string, any>) => {
        const { api } = ctx;
        // function parameters
        const { parameters } = data;

        const doc = [
            // comment
            `${data.comment}`,
            // usage
            ...codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            maybe(`## ${data.isComponent ? 'Properties' : 'Parameters'}`, parameters?.length),
            maybe('', parameters?.length)
        ];

        // ## properties
        if (parameters?.length > 0) doc.push();
        parameters?.map((param) => {
            // console.log('render param', param.name, param.type);
            doc.push(`### \`${param.name}${param.type?.name ? `: ${param.type.name}` : ''}\``, '', param?.comment);

            // multiple param properties?
            if (param.type?.kindName === 'TypeReference') {
                const { properties, references } = resolveTypeReference(ctx, param.type);
                // console.log(`reference -> '${param.type.name}'`, JSON.stringify(reference, null, 2));
                // print all properties from prop-type
                // reference?.type?.properties?.forEach((typeProperty: APIDocs) => {
                properties?.forEach((typeProperty: APIDocs) => {
                    doc.push(
                        '',
                        `#### ${typeProperty.name}`,
                        ...simpleCodeBlock(typeProperty.text),
                        typeProperty.comment ?? '',
                        ''
                    );
                });
            } else {
                // just the description
                const comment = getTag(data.tags, 'param', param.name)?.comment;
                if (comment) {
                    doc.push('', comment, '');
                }
            }
        });

        // ## returns
        doc.push(
            ...maybeAll(
                data.returns,
                '',
                '## Returns',
                '',
                `**\`${data.returns.type ? data.returns.type : ''}\`** ${data.returns.comment ?? ''}`,
                ''
            )
        );

        return doc;
    },
    ClassDeclaration: ({ api }: Context, data: Record<string, any>) => {
        const doc: WorkingDoc = [
            // comment
            maybe(data.comment),
            // usage
            ...codeBlock(data.tags?.find((tag) => tag.tag === 'example')?.comment),
            // parameter
            maybe('## Parameters', data.parameters?.length),
            maybe('', data.parameters?.length)
        ];

        // ## constructor parameters
        data.parameters?.map((param) => {
            doc.push(`### \`${param.name}${param.type?.name ? `: ${param.type?.name}` : ''}\``);

            if (param.type.kindName === 'TypeReference' && api[param.type.name]) {
                const referencedName = param.type.name;
                const referencedType = api[referencedName];

                // inline type references
                if (referencedType.type.types) {
                    referencedType.type.types.forEach((type, index, list) => {
                        if (type.kindName === 'TypeReference' && api[type.name]) {
                            list[index] = api[type.name];
                        }
                    });
                }

                const properties = query.get(referencedType, '**/properties/*', query.get.VALUE);
                // print all properties from prop-type
                properties.forEach((typeProperty) => {
                    if (typeProperty.name == null) {
                        return;
                    }
                    // const tag = getTag(data.tags, 'param', `${param.name}.${typeProperty.name}`) ?? { comment: '' };
                    doc.push(
                        '',
                        `#### ${typeProperty.name}${typeProperty.isOptional ? '' : ' (required)'}`,
                        ...simpleCodeBlock(typeProperty.text),
                        typeProperty.comment
                    );
                });
            }
        });

        doc.push(
            // ## returns
            ...maybeAll(data.returns?.comment, '', '## Returns', '', data.returns?.comment, ''),

            // ## Instance Properties
            // if (data.properties?.length > 0) doc += `## Properties${EOL}${EOL}`;
            // doc += data.properties?.map(property).join(EOL);

            // ## Instance Methods
            ...maybeAll(
                data.methods?.length,
                '',
                `## Methods`,
                '',
                data.methods.map((entity) => `[${entity.name}](#${entity.name.toLowerCase()})`).join(SEPARATOR),
                '',
                ...flat(data.methods.map(method)),
                ''
            )

            // ## Usage

            // ## Caveat
        );

        return doc;
    }
};
