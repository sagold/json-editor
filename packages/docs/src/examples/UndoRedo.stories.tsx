import { useRef } from 'react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { HistoryPlugin, HistoryPluginInstance, JsonSchema } from 'headless-json-editor';
import { Meta, StoryObj } from '@storybook/react';
import { widgets } from '@sagold/rje-widgets';
import { Button } from '../../../rje-widgets/src/lib/components/button/Button';
import { Theme } from '../../../rje-widgets/src/lib/components/theme/Theme';

const schema = {
    type: 'object',
    required: ['title'],
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
} as JsonSchema;

function UndoRedoExample() {
    const [node, editor] = useJsonEditor({ data: {}, schema, widgets, plugins: [HistoryPlugin] });
    const historyPlugin = useRef<HistoryPluginInstance>(editor.plugin('history') as HistoryPluginInstance);
    const Widget = editor.getWidget(node);
    const history = historyPlugin.current;
    const isUndoEnabled = history ? history.getUndoCount() > 0 : false;
    const isRedoEnabled = history ? history.getRedoCount() > 0 : false;

    return (
        <Theme style={{ flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 8, paddingBottom: '1em' }}>
                <Button icon="undo" onPress={() => historyPlugin.current?.undo()} disabled={!isUndoEnabled}></Button>
                <Button icon="redo" onPress={() => historyPlugin.current?.redo()} disabled={!isRedoEnabled}></Button>
            </div>
            <div className="rje-form">
                <Widget node={node} editor={editor} />
            </div>
        </Theme>
    );
}

const meta: Meta<unknown> = {
    title: 'Examples/UndoRedo',
    component: UndoRedoExample
};
export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const UndoRedo: StoryObj<typeof UndoRedoExample> = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    }
};
