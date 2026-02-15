import { Button } from '@mantine/core';
import { HistoryPlugin, JsonSchema } from 'headless-json-editor';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEditor, useEditorPlugin } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';
import { useMemo } from 'react';

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
    const editor = useEditor({ data: {}, schema, widgets });
    const history = useEditorPlugin(editor, HistoryPlugin);
    const node = editor?.getNode();
    const Widget = useMemo(() => (editor && node ? editor.getWidget(node) : null), [editor, node]);

    if (editor == null || Widget == null) {
        return null;
    }
    const isUndoEnabled = history ? history.getUndoCount() > 0 : false;
    const isRedoEnabled = history ? history.getRedoCount() > 0 : false;
    return (
        <>
            <div style={{ display: 'flex', gap: 8, paddingBottom: '1em' }}>
                <Button onClick={() => history?.undo()} disabled={!isUndoEnabled}>
                    undo ({history?.getUndoCount()})
                </Button>
                <Button onClick={() => history?.redo()} disabled={!isRedoEnabled}>
                    redo ({history?.getRedoCount()})
                </Button>
            </div>
            <div className="rje-form">
                {/* eslint-disable-next-line react-hooks/static-components */}
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
