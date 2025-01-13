import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { StoryObj } from '@storybook/react';
import { MantineThemeDecorator } from './MantineThemeDecorator';

export default {
    title: 'packages/rje-mantine-widgets/examples/OneOf',
    decorators: [MantineThemeDecorator],
    component: Form
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const editor = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    return (
        <div className="rje-form">
            <Widget editor={editor} />
        </div>
    );
}

export const InvalidData: Story = {
    args: {
        data: 123,
        schema: {
            type: 'object',
            oneOf: [
                {
                    type: 'object',
                    title: 'object with number',
                    required: ['number'],
                    properties: {
                        number: { title: 'number', type: 'number' }
                    }
                },
                {
                    type: 'object',
                    title: 'object with title',
                    required: ['title'],
                    properties: {
                        title: { title: 'string', type: 'string' }
                    }
                }
            ]
        }
    }
};

export const InvalidNumber: Story = {
    args: {
        data: {
            number: 'abc'
        },
        schema: {
            type: 'object',
            oneOf: [
                {
                    type: 'object',
                    title: 'object with number',
                    required: ['number'],
                    properties: {
                        number: { title: 'number', type: 'number' }
                    }
                },
                {
                    type: 'object',
                    title: 'object with title',
                    required: ['title'],
                    properties: {
                        title: { title: 'string', type: 'string' }
                    }
                }
            ]
        }
    }
};

export const InvalidString: Story = {
    args: {
        data: {
            title: 123
        },
        schema: {
            type: 'object',
            oneOf: [
                {
                    type: 'object',
                    title: 'object with number',
                    required: ['number'],
                    properties: {
                        number: { title: 'number', type: 'number' }
                    }
                },
                {
                    type: 'object',
                    title: 'object with title',
                    required: ['title'],
                    properties: {
                        title: { title: 'title', type: 'string' }
                    }
                }
            ]
        }
    }
};

export const OneOfType: Story = {
    args: {
        data: {},
        schema: {
            type: 'object',
            required: ['typeSelection'],
            properties: {
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
                }
            }
        }
    }
};
