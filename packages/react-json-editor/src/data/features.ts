export const data = {
    switch: [
        {
            type: 'header',
            text: 'my header'
        },
        {
            type: 'paragraph',
            text: 'Lorem ipsum sit dolor'
        }
    ]
    // @todo additionalProperties = false => should add error to additional property and add delete option
    // @todo additionalProperties = true => results in wron schema (root) for property
    // @todo no add.Props => returns error instead of schema. should be derived schema?
    // unknownProperty: 123,
    // unknownList: [{ title: 'super unknown' }],
    // unknownNotAllowed: {
    //     unknown: 'unknown property'
    // },
    // unknownAllowed: {
    //     // @todo schema of parent is returned here (in node), but node type is string
    //     unknown: 'unknown property'
    // }
};

export const schema = {
    type: 'object',
    title: 'main',
    description: 'this is the root object',
    properties: {
        title: {
            type: 'string',
            description: 'string input with min length 1',
            minLength: 1
        },
        year: {
            type: 'number',
            default: 2019,
            maximum: 2020,
            description: 'number input with maximum 2020'
        },
        isInteractive: {
            title: 'True if should be interactive',
            description: 'boolean checkbox, usually checkboxes are ambigious',
            type: 'boolean',
            default: true
        },
        selection: {
            title: 'Enum selection with custom titles',
            type: 'string',
            enum: ['dark', 'light'],
            defaultValue: 'dark theme',
            options: {
                enum: ['Zeige dunkel an', 'Zeige hell an']
            }
        },
        const: {
            // @todo without string we received an unknown node - should be string
            type: 'string',
            title: 'const value',
            const: 'schema form tree',
            description: 'probably to be disabled when correct (or autocorrect)'
        },
        typeSelection: {
            type: 'object',
            oneOfProperty: 'type',
            oneOf: [
                {
                    type: 'object',
                    title: 'first option',
                    properties: {
                        type: { type: 'string', const: 'first' },
                        title: { type: 'string', title: 'header 1' }
                    }
                },
                {
                    type: 'object',
                    title: 'second option',
                    properties: {
                        type: { type: 'string', const: 'second' },
                        title: { type: 'string', title: 'header 2' }
                    }
                }
            ]
        },
        anyOf: {
            title: 'any of simple value',
            type: 'object',
            properties: {
                staticProperty: {
                    title: 'static property',
                    type: 'string'
                }
            },
            anyOf: [
                {
                    properties: {
                        firstProperty: {
                            title: 'first dynamic property',
                            type: 'string'
                        }
                    }
                },
                {
                    properties: {
                        secondProperty: {
                            title: 'second dynamic property',
                            type: 'string'
                        }
                    }
                }
            ]
        },
        nullField: {
            type: 'null',
            title: 'Field of type "null"',
            description: 'from rjsf - use for extra information'
        },
        schemaDependencies: {
            title: 'schema dependencies',
            type: 'object',
            properties: {
                surname: {
                    title: 'first name',
                    type: 'string',
                    description: 'if a first name is entered, an input for last name is available'
                }
            },
            dependentSchemas: {
                surname: {
                    properties: {
                        lastname: {
                            title: 'last name',
                            type: 'string'
                        }
                    }
                }
            }
        },
        remoteNestedEnum: {
            title: 'remote enum in array',
            type: 'array',
            options: {
                syncEnum: {
                    source: '#/list'
                }
            },
            items: {
                type: 'string',
                enum: ['everyone', 'system', 'it_administrator_internal']
            },
            uniqueItems: true
        },
        list: {
            title: 'array of strings',
            type: 'array',
            items: {
                type: 'string'
            },
            minItems: 1,
            default: ['first item']
        },
        switch: {
            type: 'array',
            title: 'array with oneOf object selection and sortable activated',
            minItems: 1,
            options: {
                sortable: { enabled: true }
            },
            default: [
                {
                    type: 'header',
                    text: 'my header'
                }
            ],
            items: {
                oneOf: [
                    {
                        id: 'header',
                        title: 'header',
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                const: 'header',
                                options: {
                                    hidden: true
                                }
                            },
                            text: { type: 'string' }
                        }
                    },
                    {
                        id: 'paragraph',
                        title: 'paragraph',
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                const: 'paragraph',
                                options: {
                                    hidden: true
                                }
                            },
                            text: { type: 'string' }
                        }
                    }
                ]
            }
        },
        unknownNotAllowed: {
            type: 'object',
            additionalProperties: false
        },
        unknownAllowed: {
            type: 'object',
            additionalProperties: true
        }
    }
};
