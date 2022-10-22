export const data = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ita multo sanguine profuso in laetitia et in victoria est mortuus. Graccho, eius fere, aequalí? Illum mallem levares, quo optimum atque humanissimum virum, Cn. Quod dicit Epicurus etiam de voluptate, quae minime sint voluptates, eas obscurari saepe et obrui. Duo Reges: constructio interrete. Sed mehercule pergrata mihi oratio tua. Omnis enim est natura diligens sui. Illa argumenta propria videamus, cur omnia sint paria peccata. Atque his de rebus et splendida est eorum et illustris oratio.',
    switch: [
        {
            type: 'header',
            text: 'my header'
        },
        {
            type: 'paragraph',
            text: 'Lorem ipsum sit dolor'
        }
    ],
    dependency: {}
    // @todo additionalProperties = false => should add error to additional property and add delete option
    // @todo additionalProperties = true => results in wron schema (root) for property
    // @todo no add.Props => returns error instead of schema. should be derived schema?
    // unknownProperty: 123,
    // unknownList: [{ title: 'super unknown' }],
};

export const schema = {
    type: 'object',
    title: 'Widgets Overview',
    description: 'this is the root object',
    options: {
        editJson: { liveUpdate: true }
    },
    properties: {
        string: {
            title: 'Required string input',
            type: 'string',
            description:
                'set an input field as required by adding it to the "required" list of properties and add a "minLength: 1" validation',
            minLength: 1
        },
        stringPlaceholder: {
            title: 'Text input with placeholder',
            type: 'string',
            options: {
                icon: 'user',
                iconPosition: 'left',
                placeholder: 'your last name'
            },
            description: 'text inputs can have a placeholder and icon'
        },
        // stringLabel: {
        //     title: 'Text with semantic ui label',
        //     type: 'string',
        //     options: {
        //         label: { content: 'kg' },
        //         labelPosition: 'left corner'
        //     },
        //     description: 'text inputs can have a placeholder and icon'
        // },
        text: {
            type: 'string',
            format: 'textarea',
            description: 'textarea for multiline contents',
            minLength: 1
        },
        number: {
            type: 'number',
            default: 2019,
            maximum: 2020,
            description: 'number input with maximum 2020'
        },
        numberIcons: {
            type: 'number',
            options: {
                icon: 'birthday',
                placeholder: 'your last name'
            },
            defaultValue: null,
            description: 'also numbers can have icons'
        },
        boolean: {
            title: 'True if should be interactive',
            description: 'default boolean checkbox',
            type: 'boolean',
            default: true
        },
        isInteractive: {
            title: 'True if should be interactive',
            description: 'boolean with options: { type: "toggle"}',
            type: 'boolean',
            options: {
                type: 'toggle'
            },
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
        file: {
            title: 'file selection',
            description: 'file selection with preview of selected value',
            type: ['string', 'object'],
            format: 'file'
        },
        imageFile: {
            title: 'image file selection',
            description: 'file selection can have valid types restricted, e.g. to images',
            options: {
                accept: 'image/*'
            },
            type: ['string', 'object'],
            format: 'file'
        },
        typeSelection: {
            type: 'object',
            oneOfProperty: 'type',
            description: 'description only for object typeSelection',
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
            description:
                'This example uses card layout and editJson options. @todo any of is not yet supported in user interface.',
            type: 'object',
            options: {
                classNames: ['my-custom-class'],
                editJson: { enabled: true, liveUpdate: true },
                layout: {
                    type: 'card'
                }
            },
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
            title: 'List of strings',
            description: 'Array with string items only. At least one item is required.',
            type: 'array',
            items: {
                type: 'string'
            },
            minItems: 1,
            default: ['first item']
        },
        switch: {
            type: 'array',
            title: 'Array with item selection',
            description: 'Array with items.oneOf statement and activated drag&drop support.',
            minItems: 1,
            options: {
                sortable: { enabled: true },
                editJson: { liveUpdate: true }
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
        dependency: {
            options: {
                layout: {
                    type: 'card'
                }
            },
            title: 'dependency',
            description:
                'support for schema dependencies, where an additional schema is activated if a given input has a value',
            type: 'object',
            properties: {
                firstname: {
                    title: 'first name',
                    description: 'if a name is given, last name will be active',
                    type: 'string'
                }
            },
            dependencies: {
                firstname: {
                    properties: {
                        lastname: {
                            title: 'last name',
                            type: 'string',
                            minLength: 1
                        }
                    }
                }
            }
        },
        ifthenelse: {
            title: 'if-then-else',
            description: 'switch schema based on schema validation. ',
            type: 'object',
            options: {
                header: {
                    color: 'blue'
                }
            },
            properties: {
                toggle: {
                    title: 'Toggle for conditional schema',
                    description: 'if this content contains more than five characters another schema will be used',
                    type: 'string',
                    default: '123456'
                }
            },
            if: {
                properties: {
                    toggle: {
                        type: 'string',
                        maxLength: 5
                    }
                }
            },
            then: {
                properties: {
                    toggleOn: {
                        title: 'toggle off',
                        description: 'the toggle has less than 5 characters',
                        type: 'string'
                    }
                }
            },
            else: {
                properties: {
                    toggleOff: {
                        title: 'toggle on',
                        description: 'the toggle has more than 5 characters',
                        type: 'string',
                        enum: ['select 1', 'select 2', 'select 3']
                    }
                }
            }
        },
        ifthen: {
            title: 'if-then',
            description: 'switch schema based on schema validation. ',
            type: 'object',
            options: {
                header: {
                    inverted: false,
                    color: 'blue'
                }
            },
            properties: {
                toggle: {
                    title: 'Toggle for conditional schema',
                    description: 'if this content contains more than five characters an additional schema will be used',
                    type: 'string'
                }
            },
            if: {
                properties: {
                    toggle: {
                        type: 'string',
                        minLength: 6
                    }
                }
            },
            then: {
                properties: {
                    toggleOff: {
                        title: 'dynamic schema',
                        description: 'the toggle has more than 5 characters',
                        type: 'string',
                        enum: ['select 1', 'select 2', 'select 3']
                    }
                }
            }
        },
        html: {
            title: 'this could be an input field for html',
            type: 'string',
            format: 'html',
            description: 'textarea for multiline contents',
            minLength: 1
        }
    }
};
