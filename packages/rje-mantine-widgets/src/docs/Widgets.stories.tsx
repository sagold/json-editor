import '../index.scss';
import '@mantine/core/styles.css';
import classNames from 'classnames';
import type { Meta, StoryObj } from '@storybook/react';
import { Flex, MantineProvider } from '@mantine/core';
import { JsonForm } from '@sagold/rje-mantine-widgets';
import { JsonSchema, useEditor } from '@sagold/react-json-editor';
import { widgets } from '../widgets';
import { MantineThemeDecorator } from './MantineThemeDecorator';

function WithTwoColumns(props) {
    const [node, editor] = useEditor({ ...props, widgets });
    // @ts-ignore
    window.getEditor = () => editor;
    const ChildWidget = editor.getWidget(node);
    return (
        <MantineProvider>
            <Flex
                className={classNames('rje-form', `rje-theme rje-theme--light`)}
                style={{ '--input-fz': '16px', paddingBottom: '2em' }}
                justify={'space-evenly'}
                gap={'2em'}
            >
                <div>
                    <ChildWidget node={node} editor={editor} />
                </div>
                <div>
                    <ChildWidget node={node} editor={editor} />
                </div>
            </Flex>
        </MantineProvider>
    );
}

function OneColumn(props) {
    return (
        <MantineProvider>
            {/* mobile devices should havea min size of 16px (which prevents zoom on focus*/}
            <JsonForm {...props} style={{ '--input-fz': '16px' }} />
        </MantineProvider>
    );
}

const meta: Meta<typeof JsonForm> = {
    title: 'packages/rje-mantine-widgets/examples/Widgets',
    decorators: [MantineThemeDecorator],
    component: JsonForm,
    render: OneColumn
};

export default meta;
type Story = StoryObj<typeof JsonForm>;

const schema: JsonSchema = {
    title: 'Json Editor Mantine Widgets',
    type: 'object',
    required: [
        'string',
        'password',
        'text',
        'jsonText',
        'jsonObject',
        'color',
        'number',
        'boolean',
        'switch',
        'select',
        'selectTag',
        'selectRadio',
        'multiSelect',
        'multiSelectTag',
        'null',
        'array',
        'arraySortable',
        'arrayTag',
        'arrayOneOf',
        'oneOfType',
        // 'oneOfTag'
        'objectOptionals'
    ],
    properties: {
        string: {
            type: 'string',
            title: 'string',
            description: 'standard mantine **TextInput**',
            maxLength: 10,
            options: {
                icon: 'gesture',
                tag: '👍'
            }
        },
        password: {
            title: 'password',
            description: 'standard mantine **PasswordInput**',
            type: 'string',
            default: 'password123',
            format: 'password'
        },
        text: {
            title: 'text',
            description: 'standard mantine TextArea',
            type: 'string',
            format: 'textarea',
            minLength: 10,
            options: {
                icon: 'gesture',
                tag: '👍'
            }
        },
        jsonText: {
            title: 'json to string',
            description: 'json-data stored as string',
            type: 'string',
            format: 'json',
            default: '{"number": 123}',
            options: {
                icon: 'gesture',
                tag: '👍'
            }
        },
        jsonObject: {
            title: 'json to object',
            description: 'json-data stored as json-data',
            type: 'object',
            format: 'json',
            required: ['string', 'number', 'boolean'],
            properties: {
                string: { type: 'string', default: 'abc', minLength: 4 },
                number: { type: 'number', default: 123 },
                boolean: { type: 'boolean', default: true }
            }
        },
        color: {
            title: 'hex color',
            description: 'standard mantine ColorInput',
            type: 'string',
            format: 'hexColor'
        },
        number: {
            type: 'number',
            title: 'number',
            description: 'standard mantine NumberInput',
            maximum: 123,
            options: {
                icon: '123',
                tag: '€'
            }
        },
        boolean: {
            title: 'boolean',
            description: 'standard mantine Checkbox',
            type: 'boolean',
            default: true,
            options: {}
        },
        switch: {
            title: 'switch',
            description: 'standard mantine Switch',
            type: 'boolean',
            format: 'switch',
            options: {}
        },
        select: {
            title: 'select',
            description: 'standard non-native mantine select',
            type: 'string',
            enum: ['yes', 'maybe', 'no'],
            pattern: '(yes|maybe)'
        },
        selectTag: {
            type: ['null', 'string'],
            description: 'standard mantine chip-group. Initially unselected, but required',
            default: null,
            title: 'select',
            format: 'taglist',
            enum: ['yes', 'maybe', 'no']
        },
        selectRadio: {
            type: ['null', 'string'],
            description: 'standard mantine chip-group. Initially unselected, but required',
            default: null,
            title: 'select',
            format: 'radiogroup',
            enum: ['yes', 'maybe', 'no']
        },
        multiSelect: {
            title: 'multi-select',
            description: 'standard mantine multi-select',
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'string',
                enum: ['yes', 'maybe', 'no']
            }
        },
        multiSelectTag: {
            title: 'multi-select',
            description: 'standard mantine multi-select',
            type: 'array',
            format: 'taglist',
            uniqueItems: true,
            items: {
                type: 'string',
                enum: ['yes', 'maybe', 'no']
            }
        },
        null: {
            title: 'null widget',
            description: 'standard mantine divider',
            type: 'null'
        },
        oneOfType: {
            type: 'object',
            oneOfProperty: 'type',
            title: 'oneOf Type Selection',
            description: 'parent object which has its content changed by the selected oneOf type',
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
        array: {
            type: 'array',
            items: {
                title: 'string item',
                description: 'standard mantine TextInput',
                type: 'string'
            }
        },
        arraySortable: {
            type: 'array',
            options: {
                sortable: { enabled: true }
            },
            items: {
                options: { showTitle: false },
                type: 'number'
            }
        },
        arrayTag: {
            title: 'string-array',
            description: 'standard mantine TagsInput',
            type: 'array',
            format: 'taglist',
            maxItems: 6,
            minItems: 1,
            default: [],
            items: {
                type: 'string'
            }
        },
        arrayOneOf: {
            title: 'array-oneOf',
            type: 'array',
            items: {
                oneOf: [
                    {
                        title: 'header',
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: {
                                type: 'string'
                            }
                        }
                    },
                    {
                        title: 'paragraph',
                        type: 'object',
                        required: ['text'],
                        properties: {
                            text: {
                                type: 'string',
                                format: 'textarea'
                            }
                        }
                    }
                ]
            }
        },
        objectOptionals: {
            type: 'object',
            required: ['required'],
            properties: {
                required: { title: 'required', type: 'string' },
                optional1: { title: 'optional1', type: 'string' },
                optional2: { title: 'optional2', type: 'string' },
                optional3: { title: 'optional3', type: 'string' }
            }
        }
    }
};

const data = {
    string: 'huhu',
    array: ['first', 'fourth'],
    objectOptionals: { optional1: 'input-value' },
    arraySortable: [100, 200, 300, 400]
};

export const Default: Story = {
    args: {
        validate: true,
        onChange: (v) => console.log(v),
        data,
        schema
    }
};

export const TwoColumns: Story = {
    render: WithTwoColumns,
    args: {
        validate: true,
        onChange: (v) => console.log(v),
        data,
        schema
    }
};
