import { useEffect, useRef } from 'react';
import { useJsonEditor, defaultEditors } from '../../index';
import { createHistoryPlugin, HistoryPlugin } from 'headless-json-editor';
import { Form, Button, Icon } from 'semantic-ui-react';
import { ComponentStory } from '@storybook/react';
import '../styles.scss';

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
    title: 'Example',
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: {} },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, instance] = useJsonEditor({ data, schema, editors: defaultEditors, plugins: [] });
    const historyPlugin = useRef<HistoryPlugin>();
    useEffect(() => {
        if (instance && historyPlugin.current == null) {
            const history = createHistoryPlugin();
            historyPlugin.current = history;
            instance.addPlugin(history);
        }
    });

    if (node == null) {
        return <></>;
    }

    const Editor = instance.getEditor(node);
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
                <Editor node={node} instance={instance} />
            </Form>
        </div>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const UndoRedo = Template.bind({});
