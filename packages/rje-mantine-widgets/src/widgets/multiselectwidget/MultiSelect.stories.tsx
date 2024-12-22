import { StoryObj } from '@storybook/react';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { MultiSelectOptions } from './MultiSelect';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';

type WidgetProps = MultiSelectOptions & { editorProps: UseEditorOptions };
function Widget({ editorProps, ...props }: WidgetProps) {
    const [root, editor] = useEditor(editorProps);
    const ChildWidget = editor.getWidget(root);
    return <ChildWidget editor={editor} node={root} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/MultiSelectWidget',
    component: Widget,
    decorators: [MantineThemeDecorator],
    args: {
        editorProps: {
            data: [],
            onChange: (v) => console.log('change:', v),
            schema: {
                type: 'array',
                uniqueItems: true,
                items: {
                    type: 'string',
                    enum: ['first', 'second', 'third']
                }
            }
        }
    }
};

type Story = StoryObj<WidgetProps>;

export const Default: Story = {
    args: {
        liveUpdate: false
    }
};
