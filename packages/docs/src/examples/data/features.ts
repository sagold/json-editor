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
    description: 'This form consists of all basic widgets exposed by rje-widgets and some of their variations',
    options: {
        editJson: { enabled: true, liveUpdate: true }
    },
    required: [
        'string',
        'stringPlaceholder',
        'stringValidation',
        'stringReadonly',
        'stringDisabled',
        'text',
        'nullHeadline',
        'nullField',
        'numberHeadline',
        'number',
        'numberIcons',
        'booleanHeadline',
        'boolean',
        'booleanOptions',
        'selectionHeadline',
        'selection',
        'constHeadline',
        'const',
        'fileHeadline',
        'file',
        'imageFile',
        'readOnlyFile',
        'typeSelection',
        'anyOf',
        'remoteNestedEnum',
        'list',
        'switch',
        'dependency',
        'ifthenelse',
        'ifthen',
        'html'
    ],
    properties: {
        string: {
            title: 'Simple text input',
            type: 'string'
        },
        stringPlaceholder: {
            title: 'Text input with formatting options',
            type: 'string',
            options: {
                icon: 'user',
                iconPosition: 'left',
                label: { basic: true, content: 'username' },
                labelPosition: 'right',
                placeholder: 'your username'
            },
            description: 'Text inputs can have a placeholder, icon and label'
        },
        stringValidation: {
            title: 'Text input with valiation rules',
            type: 'string',
            description:
                'The required option is triggered by adding a property to required properties and adding a `minLength: 1` validation rule',
            minLength: 1
        },
        stringReadonly: {
            options: {
                readOnly: true
            },
            title: 'Read only text input',
            type: 'string',
            default: 'Using readOnly option, the input text is still selectable by a user'
        },
        stringDisabled: {
            options: {
                disabled: true
            },
            title: 'Disabled text input',
            type: 'string',
            default: 'Note that disabled text input prevent user interaction like selecting the text'
        },
        text: {
            options: {
                disabled: false
            },
            type: 'string',
            title: 'Textarea',
            format: 'textarea',
            description: 'Setting `format: textarea` triggers the textarea widget for strings',
            minLength: 1
        },
        nullHeadline: {
            type: 'null',
            options: { separator: true },
            title: 'Inline header',
            description:
                'json-schema `null`-type can be used to add additional information. With the option `separator:true` you can add an additional horizontal line.'
        },
        nullField: {
            type: 'null',
            title: '',
            description: 'Null type with empty title and without separator'
        },
        numberHeadline: {
            type: 'null',
            options: { separator: true },
            title: 'NUMBER INPUT'
        },
        numberIcons: {
            title: 'Number input with formatting options',
            description: 'also numbers can have icons',
            type: 'number',
            options: {
                icon: 'birthday',
                placeholder: 'your last name',
                label: 'year'
            },
            defaultValue: null
        },
        number: {
            title: 'Number input with validation rules',
            description: 'Number input allowing a maximum of 2020',
            type: 'number',
            default: 2023,
            maximum: 2020
        },
        booleanHeadline: {
            type: 'null',
            options: { separator: true },
            title: 'BOOLEAN INPUT'
        },
        boolean: {
            title: 'Default boolean input',
            description: 'Boolean value without any options',
            type: 'boolean'
        },
        booleanOptions: {
            title: 'True if should be interactive',
            description: 'Adding `options: { type: "checkbox"}` will render the boolean as checkbox',
            type: 'boolean',
            options: {
                type: 'checkbox'
            },
            default: true
        },
        selectionHeadline: {
            type: 'null',
            options: { separator: true },
            title: 'ENUM INPUT'
        },
        selection: {
            title: 'Enum selection',
            description: 'Enum selection with custom title values',
            type: 'string',
            enum: ['dark', 'light'],
            defaultValue: 'dark theme',
            options: {
                enum: ['Select option "dark"', 'Select option "light"']
            }
        },
        constHeadline: {
            type: 'null',
            options: { separator: true },
            title: 'CONST',
            description: 'const values are disabled when correct'
        },
        const: {
            // @todo without string we received an unknown node - should be string
            type: 'string',
            title: 'const value',
            const: 'schema form tree'
        },
        fileHeadline: {
            type: 'null',
            options: { separator: true },
            title: 'FILE INPUT'
        },
        imageFile: {
            title: 'File selection with mime type',
            description: 'File selection can have valid types restricted, e.g. to images',
            options: {
                accept: 'image/*'
            },
            type: ['string', 'object'],
            format: 'file'
        },
        file: {
            title: 'Required file selection',
            type: ['string', 'object'],
            format: 'file',
            minLength: 1
        },
        readOnlyFile: {
            title: 'Read only file selection with image preview',
            description: 'file selection can have an imageUrlTemplate to render images',
            options: {
                accept: 'image/*',
                readOnly: true,
                imageUrlTemplate:
                    'https://images.unsplash.com/{{value}}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60'
            },
            type: ['string', 'object'],
            format: 'file',
            default: 'photo-1666694421187-75957423ee77'
        },
        typeSelection: {
            type: 'object',
            oneOfProperty: 'type',
            description: 'description only for object typeSelection',
            oneOf: [
                {
                    type: 'object',
                    title: 'first option',
                    required: ['type', 'title'],
                    properties: {
                        type: { type: 'string', const: 'first' },
                        title: { type: 'string', title: 'header 1' }
                    }
                },
                {
                    type: 'object',
                    title: 'second option',
                    required: ['type', 'title'],
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
                editJson: { enabled: true, liveUpdate: true }
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
                        required: ['type', 'text'],
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
                        required: ['type', 'text'],
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
            required: ['firstname'],
            properties: {
                firstname: {
                    title: 'first name',
                    description: 'if a name is given, last name will be active',
                    type: 'string'
                }
            },
            dependencies: {
                firstname: {
                    required: ['lastname'],
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
            required: ['toggle'],
            properties: {
                toggle: {
                    title: 'Toggle for conditional schema',
                    description: 'if this content contains more than five characters another schema will be used',
                    type: 'string',
                    default: '123456'
                }
            },
            if: {
                required: ['toggle'],
                properties: {
                    toggle: {
                        type: 'string',
                        maxLength: 5
                    }
                }
            },
            then: {
                required: ['toggleOn'],
                properties: {
                    toggleOn: {
                        title: 'toggle off',
                        description: 'the toggle has less than 5 characters',
                        type: 'string'
                    }
                }
            },
            else: {
                required: ['toggleOff'],
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
            required: ['toggle'],
            properties: {
                toggle: {
                    title: 'Toggle for conditional schema',
                    description: 'if this content contains more than five characters an additional schema will be used',
                    type: 'string'
                }
            },
            if: {
                required: ['toggle'],
                properties: {
                    toggle: {
                        type: 'string',
                        minLength: 6
                    }
                }
            },
            then: {
                required: ['toggleOff'],
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
