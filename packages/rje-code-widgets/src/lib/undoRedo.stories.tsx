import { ComponentStory } from '@storybook/react';
import { Widget, JsonSchema, useEditor, HistoryPlugin, useEditorPlugin } from '@sagold/react-json-editor';
import theme from '../../../rje-aria-widgets/src/lib/theme';
import defaultWidgets, { Button } from '@sagold/rje-aria-widgets';
import { JsonWidget, JsonWidgetOptions, JsonWidgetPlugin } from './jsonwidget/JsonWidget';

export default {
    title: 'packages/rje-code-widgets/UndoRedo',
    component: JsonWidget
};

type ComponentStoryProps = {
    schema: JsonSchema;
    data?: any;
    options?: Partial<JsonWidgetOptions>;
};

const Template: ComponentStory<any> = ({ data, schema }: ComponentStoryProps) => {
    const [node, editor] = useEditor({
        schema,
        data,
        widgets: [JsonWidgetPlugin, ...defaultWidgets],
        onChange: (data) => console.log('changed', data),
        plugins: [HistoryPlugin],
        validate: true
    });

    const historyPlugin = useEditorPlugin(editor, HistoryPlugin);

    return (
        <div className="rje-form rje-theme--light" style={theme}>
            <div style={{ display: 'flex', gap: 8 }}>
                <Button
                    icon="undo"
                    onPress={() => historyPlugin?.undo()}
                    disabled={historyPlugin?.getUndoCount() === 0}
                />
                <Button
                    icon="redo"
                    onPress={() => historyPlugin?.redo()}
                    disabled={historyPlugin?.getRedoCount() === 0}
                />
            </div>
            <Widget editor={editor} node={node} />
        </div>
    );
};

export const ObjectJson = Template.bind({});
ObjectJson.args = {
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
};
