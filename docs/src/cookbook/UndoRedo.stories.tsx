import { Button } from '@mantine/core';
import { HistoryPlugin, JsonSchema } from 'headless-json-editor';
import { Meta, StoryObj } from '@storybook/react';
import { useEditor, useEditorPlugin } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';

const schema = {
    type: 'object',
    required: ['title'],
    options: { showEditJsonAction: true, showInlineAddAction: true },
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
    const [node, editor] = useEditor({ data: {}, schema, widgets });

    const history = useEditorPlugin(editor, HistoryPlugin);
    const isUndoEnabled = history ? history.getUndoCount() > 0 : false;
    const isRedoEnabled = history ? history.getRedoCount() > 0 : false;

    const Widget = editor.getWidget(node);

    return (
        <>
            <div style={{ display: 'flex', gap: 8, paddingBottom: '1em' }}>
                <Button onClick={() => history?.undo()} disabled={!isUndoEnabled}>
                    undo
                </Button>
                <Button onClick={() => history?.redo()} disabled={!isRedoEnabled}>
                    redo
                </Button>
            </div>
            <div className="rje-form">
                <Widget node={node} editor={editor} />
            </div>
        </>
    );
}

const meta: Meta<unknown> = {
    component: UndoRedoExample,
    decorators: [MantineThemeDecorator]
};
export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const UndoRedo: StoryObj<typeof UndoRedoExample> = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    }
};
