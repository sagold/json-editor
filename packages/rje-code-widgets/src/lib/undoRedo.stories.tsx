import defaultWidgets, { Icon } from '@sagold/rje-mantine-widgets';
import { Button } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { JsonWidget, JsonWidgetOptions, JsonWidgetPlugin } from './jsonwidget/JsonWidget';
import { MantineThemeDecorator } from '../docs/MantineThemeDecorator';
import { Widget, JsonSchema, useEditor, HistoryPlugin, useEditorPlugin } from '@sagold/react-json-editor';

const Template = ({ data, schema }: { schema: JsonSchema; data?: any; options?: Partial<JsonWidgetOptions> }) => {
    const editor = useEditor({
        schema,
        data,
        widgets: [JsonWidgetPlugin, ...defaultWidgets],
        onChange: (data) => console.log('changed', data),
        plugins: [HistoryPlugin],
        validate: true
    });

    const historyPlugin = useEditorPlugin(editor, HistoryPlugin);

    return (
        <div className="rje-form rje-theme--light">
            <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => historyPlugin?.undo()} disabled={historyPlugin?.getUndoCount() === 0}>
                    <Icon>undo</Icon>
                </Button>
                <Button onClick={() => historyPlugin?.redo()} disabled={historyPlugin?.getRedoCount() === 0}>
                    <Icon>redo</Icon>
                </Button>
            </div>
            <Widget editor={editor} />
        </div>
    );
};

type Story = StoryObj<{
    schema: JsonSchema;
    data?: any;
    options?: Partial<JsonWidgetOptions>;
}>;

const meta: Meta<typeof JsonWidget> = {
    title: 'packages/rje-code-widgets/UndoRedo',
    component: JsonWidget,
    decorators: [MantineThemeDecorator],
    render: Template
};
export default meta;

export const ObjectJson: Story = {
    args: {
        data: {},
        schema: {
            type: 'object',
            format: 'json',
            title: 'Content',
            required: ['title'],
            properties: {
                title: { type: 'string', minLength: 1 },
                subtitle: { type: 'string' },
                text: { type: 'string', format: 'html' }
            }
        }
    }
};
