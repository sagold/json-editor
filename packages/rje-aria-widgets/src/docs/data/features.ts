import { JsonSchema } from '@sagold/react-json-editor';

export const data = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ita multo sanguine profuso in laetitia et in victoria est mortuus. Graccho, eius fere, aequalí? Illum mallem levares, quo optimum atque humanissimum virum, Cn. Quod dicit Epicurus etiam de voluptate, quae minime sint voluptates, eas obscurari saepe et obrui. Duo Reges: constructio interrete. Sed mehercule pergrata mihi oratio tua. Omnis enim est natura diligens sui. Illa argumenta propria videamus, cur omnia sint paria peccata. Atque his de rebus et splendida est eorum et illustris oratio.',
    anUnknownItem: {
        description: 'unknown items are optional if `additionalItems!=false` and can be removed'
    }
    // @todo additionalProperties = false => should add error to additional property and add delete option
    // @todo additionalProperties = true => results in wron schema (root) for property
    // @todo no add.Props => returns error instead of schema. should be derived schema?
    // unknownProperty: 123,
    // unknownList: [{ title: 'super unknown' }],
};

export const schema: JsonSchema = {
    type: 'object',
    title: 'Widgets Overview',
    description: 'This form consists of all basic widgets exposed by rje-aria-widgets and some of their variations',
    options: {
        descriptionInline: true,
        headerFontSize: 1.75,
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
        'radiogroup',
        'constHeadline',
        'const',
        'objectIntro',
        'fileHeadline',
        'file',
        'imageFile',
        'readOnlyFile',
        'array',
        'arrayOfStrings',
        'arrayOfStringsError',
        'arrayOfUniqueStrings',
        'arrayItemSelection',
        'arrayHeadline',
        'json'
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
                icon: 'sentiment_calm',
                label: 'username',
                placeholder: 'your username'
            },
            description:
                'Text inputs can have a placeholder, icon and label. Description texts support basic markdown syntax like **bold**, _italic_, ~~strikethrough~~, [links](#) and `code`.'
        },
        stringValidation: {
            title: 'Text input with valiation rules',
            type: 'string',
            options: {
                icon: 'app_registration',
                swapIconPosition: true
            },
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
            description: 'Null type with empty title and without separator',
            options: {
                descriptionInline: true
            }
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
                icon: 'cake',
                placeholder: 'your last name',
                label: 'year'
            },
            default: null
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
            default: null,
            options: {
                enum: ['Select option "dark"', 'Select option "light"']
            }
        },
        radiogroup: {
            title: 'Enum selection using radiogroup',
            description: 'selection with `format="radiogroup"`',
            type: 'string',
            format: 'radiogroup',
            enum: ['dark', 'light'],
            default: 'dark theme',
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
        objectIntro: {
            type: 'object',
            title: 'Objects',
            description: 'Objects wrap children, they can have their own header, description and actions.',
            required: [
                'typeSelection',
                'property',
                'dependency',
                'ifthenelse',
                'ifthen',
                'headline1',
                'headline2',
                'collapsible',
                'card'
            ],
            properties: {
                property: { type: 'string' },
                headline2: {
                    type: 'object',
                    title: 'Nested object headline inverted',
                    description: 'Object colors can also be inverted, e.g. `{options: { header: { inverted: true }}}`',
                    options: {
                        classNames: ['rje-theme--inverted'],
                        header: {
                            inverted: true,
                            color: 'blue'
                        }
                    },
                    required: ['property'],
                    properties: {
                        property: { type: 'string' }
                    }
                },
                headline1: {
                    type: 'object',
                    title: 'Nested object headline with color',
                    description:
                        "Object support a color option, e.g. `{options: { header: { color: 'blue' }}}`. This object contains an optional property which will show an options button to add this property.",
                    options: {
                        header: {
                            color: 'blue'
                        }
                    },
                    required: ['property'],
                    properties: {
                        property: { type: 'string' },
                        optionalProperty: { type: 'string' }
                    }
                },
                typeSelection: {
                    type: 'object',
                    title: 'OneOf Selection',
                    description: 'Type selection using oneOf schema',
                    options: {
                        header: { color: 'black' }
                    },
                    oneOfProperty: 'type',
                    oneOf: [
                        {
                            type: 'object',
                            title: 'Schema Type One',
                            required: ['type', 'property'],
                            properties: {
                                type: { type: 'string', const: 'first' },
                                property: { type: 'number', title: 'A number for option one', default: 1 }
                            }
                        },
                        {
                            type: 'object',
                            title: 'Schema Type Two',
                            required: ['type', 'property'],
                            properties: {
                                type: { type: 'string', const: 'second' },
                                property: { type: 'string', title: 'Schema two property', default: 'a string' }
                            }
                        }
                    ]
                },
                dependency: {
                    options: {
                        header: { color: 'black' }
                    },
                    title: 'dependency',
                    description:
                        'support for schema dependencies, where an additional schema is activated if a given input exists',
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
                            required: ['lastname'],
                            properties: {
                                lastname: {
                                    title: 'last name',
                                    type: 'string'
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
                        header: { color: 'black' }
                    },
                    required: ['toggle'],
                    properties: {
                        toggle: {
                            title: 'Toggle for conditional schema',
                            description:
                                'if this content contains more than five characters another schema will be used',
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
                            color: 'black'
                        }
                    },
                    required: ['toggle'],
                    properties: {
                        toggle: {
                            title: 'Toggle for conditional schema',
                            description:
                                'if this content contains more than five characters an additional schema will be used',
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
                collapsible: {
                    type: 'object',
                    title: 'Nested object headline inverted',
                    description: 'Object which is initially collapsed using `{ options: { collapsed: true }}`',
                    options: {
                        collapsed: true,
                        header: { color: 'black' }
                    },
                    required: ['property'],
                    properties: {
                        property: { type: 'string' }
                    }
                },
                card: {
                    type: 'object',
                    title: 'Object with card layout',
                    description: "You can style objects in card layoue using `options:{ layout: { type: 'card' } }`",
                    options: {
                        // header: {
                        //     inverted: false
                        // },
                        layout: {
                            type: 'card'
                        }
                    },
                    required: ['property'],
                    properties: {
                        property: { type: 'string' },
                        optionalProperty: { type: 'string' }
                    }
                }
            }
        },
        array: {
            title: 'Default Array',
            description: 'A list of strings that accepts an any number of items',
            type: 'array',
            options: {
                classNames: ['rje-theme--inverted']
            },
            items: {
                type: 'object',
                title: 'object with a property',
                required: ['property'],
                properties: {
                    property: {
                        type: 'string'
                    }
                }
            }
        },
        arrayOfStrings: {
            title: 'Array of strings',
            description: 'Multiselect widget has been configured to register for a simple list of strings',
            type: 'array',
            format: 'taglist',
            items: {
                type: 'string'
            },
            default: ['first item']
        },
        arrayOfStringsError: {
            title: 'Expect at least one item, but enforce empty list',
            type: 'array',
            minItems: 1,
            items: {
                type: 'string'
            },
            default: []
        },
        arrayOfUniqueStrings: {
            title: 'Array of unique strings',
            type: 'array',
            items: {
                type: 'string'
            },
            uniqueItems: true,
            default: ['one', 'one']
        },
        arrayItemSelection: {
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
                            text: {
                                type: 'string',
                                format: 'textarea'
                            }
                        }
                    }
                ]
            }
        },
        arrayHeadline: {
            type: 'array',
            title: 'Array headline options',
            options: {
                header: {
                    inverted: true,
                    color: 'teal'
                }
            },
            items: {
                type: 'number'
            },
            description:
                'Array headline options are the same as for object headlines. They can be inverted and have a color'
        },
        json: {
            type: 'object',
            format: 'json',
            required: ['title', 'subtitle'],
            properties: {
                title: {
                    type: 'string',
                    minLength: 1
                },
                subtitle: {
                    type: 'string'
                },
                version: {
                    type: 'number'
                }
            }
        }
    }
};
