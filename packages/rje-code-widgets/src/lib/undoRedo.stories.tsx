import { ComponentStory } from '@storybook/react';
import widgets from '@sagold/rje-widgets';
import { Form, Button } from 'semantic-ui-react';
import {
    JsonForm,
    Node,
    Widget,
    JsonSchema,
    useJsonEditor,
    HistoryPlugin,
    HistoryPluginInstance
} from '@sagold/react-json-editor';
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
        <>
            <div>
                <Button
                    content="undo"
                    onClick={() => historyPlugin.current.undo()}
                    disabled={historyPlugin.current?.getUndoCount() === 0}
                />
                <Button
                    content="redo"
                    onClick={() => historyPlugin.current.redo()}
                    disabled={historyPlugin.current?.getRedoCount() === 0}
                />
            </div>
            <Form error>
                <Widget editor={editor} node={node} />
            </Form>
        </>
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
