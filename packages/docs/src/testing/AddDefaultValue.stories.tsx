import * as React from 'react';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-aria-widgets';
import { Theme } from '../../../rje-aria-widgets/src/lib/components/theme/Theme';
import { StoryObj } from '@storybook/react';

export default {
    title: 'Testing/AddDefaultValue',
    component: Form
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const [node, editor] = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    const WidgetComponent = editor.getWidget(node);
    return (
        <Theme>
            <div className="rje-form">
                <WidgetComponent node={node} editor={editor} />
            </div>
        </Theme>
    );
}

export const InvalidData: Story = {
    args: {
        validate: true,
        data: ['a title'],
        schema: {
            title: 'additionalItems: { type: "number" }',
            type: 'array',
            items: [
                {
                    title: 'Title',
                    type: 'string'
                }
            ],
            additionalItems: {
                title: 'Additional number',
                type: 'number',
                default: 1
            }
        }
    }
};
