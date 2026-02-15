import { StoryObj } from '@storybook/react-vite';
import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from './MantineThemeDecorator';

export default {
    title: 'packages/rje-mantine-widgets/examples/ReplaceWidget',
    decorators: [MantineThemeDecorator],
    component: Form
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const editor = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    return <Widget editor={editor} />;
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
            required: ['text', 'textarea'],
            properties: {
                textarea: {
                    type: 'boolean'
                }
            },
            if: {
                properties: { textarea: { const: true } }
            },
            then: {
                properties: { text: { title: 'textarea', type: 'string', format: 'textarea' } }
            },
            else: {
                properties: { text: { title: 'text', type: 'string' } }
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
