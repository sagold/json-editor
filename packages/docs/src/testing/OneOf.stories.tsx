import * as React from 'react';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-aria-widgets';
import { Theme } from '../../../rje-aria-widgets/src/lib/components/theme/Theme';
import { StoryObj } from '@storybook/react';

export default {
    title: 'Testing/OneOf',
    component: Form
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const [node, editor] = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    const WidgetComponent = editor.getWidget(node);
    return (
        <Theme>
            <div className="rje-form">
                <WidgetComponent node={node} editor={editor} />
            </div>
        </Theme>
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
