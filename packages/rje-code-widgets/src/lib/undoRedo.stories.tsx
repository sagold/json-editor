import { ComponentStory } from '@storybook/react';
import { Widget, JsonSchema, useJsonEditor, HistoryPlugin, HistoryPluginInstance } from '@sagold/react-json-editor';
import theme from '../../../rje-widgets/src/lib/theme';
import widgets, { Button } from '@sagold/rje-widgets';
import { JsonWidget, JsonWidgetOptions, JsonWidgetPlugin } from './jsonwidget/JsonWidget';
import { useRef } from 'react';

export default {
    title: 'packages/rje-code-widgets/UndoRedo',
    component: JsonWidget
};

type ComponentStoryProps = {
    schema: JsonSchema;
    data?: any;
    options?: Partial<JsonWidgetOptions>;
};

const Template: ComponentStory<any> = ({ data, schema, options = {} }: ComponentStoryProps) => {
    const [node, editor] = useJsonEditor({
        schema,
        data,
        widgets: [JsonWidgetPlugin, ...widgets],
        onChange: (data) => console.log('changed', data),
        plugins: [HistoryPlugin],
        validate: true
    });

    const historyPlugin = useRef<HistoryPluginInstance>(editor.plugin('history') as HistoryPluginInstance);
    console.log('history', historyPlugin.current);

    return (
        <div className="rje-form rje-theme--light" style={theme}>
            <div style={{ display: 'flex', gap: 8 }}>
                <Button
                    icon="undo"
                    onPress={() => historyPlugin.current.undo()}
                    disabled={historyPlugin.current?.getUndoCount() === 0}
                />
                <Button
                    icon="redo"
                    onPress={() => historyPlugin.current.redo()}
                    disabled={historyPlugin.current?.getRedoCount() === 0}
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
