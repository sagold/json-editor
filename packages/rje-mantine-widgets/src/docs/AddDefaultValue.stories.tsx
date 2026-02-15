import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from './MantineThemeDecorator';
import { useMemo } from 'react';

export default {
    title: 'packages/rje-mantine-widgets/examples/AddDefaultValue',
    component: Form,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const editor = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    const node = editor?.getNode();
    const WidgetComponent = useMemo(() => (editor && node ? editor.getWidget(node) : null), [editor, node]);

    if (editor == null || WidgetComponent == null) {
        return null;
    }
    {/* eslint-disable-next-line react-hooks/static-components */}
    return <WidgetComponent node={node} editor={editor} />;
}

export const InvalidData: Story = {
    args: {
        validate: true,
        data: ['a title'],
        schema: {
            title: 'additionalItems: { type: "number" }',
            type: 'array',
            items: [
                {
                    title: 'Title',
                    type: 'string'
                }
            ],
            additionalItems: {
                title: 'Additional number',
                type: 'number',
                default: 1
            }
        }
    }
};
