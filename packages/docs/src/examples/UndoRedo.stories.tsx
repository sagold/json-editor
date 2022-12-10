import { useRef } from 'react';
import { useJsonEditor, defaultWidgets } from '@sagold/react-json-editor';
import { HistoryPlugin, HistoryPluginInstance } from 'headless-json-editor';
import { Form, Button, Icon } from 'semantic-ui-react';
import { ComponentStory } from '@storybook/react';

const schema = {
    type: 'object',
    properties: {
        title: {
            title: 'text',
            type: 'string'
        },
        boolean: {
            title: 'checkbox',
            type: 'boolean'
        },
        list: {
            type: 'array',
            options: {
                sortable: {
                    enabled: true
                }
            },
            items: {
                type: 'string'
            }
        }
    }
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Examples/UndoRedo',
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: {} },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, editor] = useJsonEditor({ data, schema, widgets: defaultWidgets, plugins: [HistoryPlugin] });
    const historyPlugin = useRef<HistoryPluginInstance>(editor.plugin('history') as HistoryPluginInstance);
    const Widget = editor.getWidget(node);
    const history = historyPlugin.current;
    const isUndoEnabled = history ? history.getUndoCount() > 0 : false;
    const isRedoEnabled = history ? history.getRedoCount() > 0 : false;

    return (
        <div>
            <Button.Group icon>
                <Button icon onClick={() => historyPlugin.current?.undo()} disabled={!isUndoEnabled}>
                    <Icon name="undo" />
                </Button>
                <Button icon onClick={() => historyPlugin.current?.redo()} disabled={!isRedoEnabled}>
                    <Icon name="redo" />
                </Button>
            </Button.Group>
            <Form error>
                <Widget node={node} editor={editor} />
            </Form>
        </div>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const UndoRedo = Template.bind({});
