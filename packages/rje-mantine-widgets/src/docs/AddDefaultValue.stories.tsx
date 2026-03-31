import { UseEditorOptions, Widget, useEditor } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from './MantineThemeDecorator';

export default {
    title: 'packages/rje-mantine-widgets/examples/AddDefaultValue',
    component: Form,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const editor = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    const node = editor?.getNode();
    return <Widget node={node} editor={editor} />;
}

export const InvalidData: Story = {
    args: {
        validate: true,
        data: ['a title'],
        schema: {
            title: 'additional items: { type: "number" }',
            type: 'array',
            prefixItems: [
                {
                    title: 'Title',
                    type: 'string'
                }
            ],
            items: {
                title: 'Additional number',
                type: 'number',
                default: 1
            }
        }
    }
};
