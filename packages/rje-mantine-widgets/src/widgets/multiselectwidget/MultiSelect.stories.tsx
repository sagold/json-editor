import { StoryObj } from '@storybook/react-webpack5';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { MultiSelectOptions } from './MultiSelect';
import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';

type WidgetProps = MultiSelectOptions & { editorProps: UseEditorOptions };
function WidgetForm({ editorProps, ...props }: WidgetProps) {
    const editor = useEditor(editorProps);
    return <Widget editor={editor} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/MultiSelectWidget',
    component: WidgetForm,
    decorators: [MantineThemeDecorator],
    args: {
        editorProps: {
            data: [],
            onChange: (v) => console.log('change:', v),
            schema: {
                type: 'array',
                format: 'select',
                uniqueItems: true,
                options: {
                    enum: ['First', 'Second', 'Third']
                },
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

export const Taglist: Story = {
    args: {
        liveUpdate: false,
        editorProps: {
            onChange: (v) => console.log('change:', v),
            schema: {
                type: 'array',
                format: 'taglist',
                uniqueItems: true,
                items: {
                    type: 'string',
                    enum: ['first', 'second', 'third']
                }
            }
        }
    }
};
