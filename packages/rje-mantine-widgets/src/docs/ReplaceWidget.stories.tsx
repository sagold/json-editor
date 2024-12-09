import { StoryObj } from '@storybook/react';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from './MantineThemeDecorator';

export default {
    title: 'packages/rje-mantine-widgets/examples/ReplaceWidget',
    decorators: [MantineThemeDecorator],
    component: Form
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const [node, editor] = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    const WidgetComponent = editor.getWidget(node);
    return <WidgetComponent node={node} editor={editor} />;
}

export const SameType: Story = {
    args: {
        data: {
            textarea: false
        },
        schema: {
            type: 'object',
            description: 'testing sync, where type stays the same but widgets are different',
            options: {
                descriptionInline: true
            },
            required: ['text'],
            properties: {
                textarea: {
                    type: 'boolean'
                }
            },
            if: {
                properties: { textarea: { const: true } }
            },
            then: {
                properties: { text: { type: 'string', format: 'textarea' } }
            },
            else: {
                properties: { text: { type: 'string' } }
            }
        }
    }
};

export const SameTypeLiveUpdate: Story = {
    args: {
        data: {
            text: '1234'
        },
        schema: {
            type: 'object',
            description: 'testing sync with live update, where type stays the same but widgets are different',
            options: {
                descriptionInline: true
            },
            required: ['text'],
            properties: {
                text: {
                    options: {
                        liveUpdate: true
                    },
                    type: 'string',
                    title: 'input-text',
                    minLength: 5,
                    description: 'Will switch to textarea with 10+ characters. **NOTE: Loses focus when switching**'
                }
            },
            if: {
                properties: { text: { type: 'string', minLength: 10 } }
            },
            then: {
                properties: { text: { type: 'string', format: 'textarea', title: 'textarea' } }
            }
        }
    }
};
