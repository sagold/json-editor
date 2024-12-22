import { StoryObj } from '@storybook/react';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { StringOptions } from './StringWidget';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';

type WidgetProps = StringOptions & { editorProps: UseEditorOptions };
function Widget({ editorProps, ...props }: WidgetProps) {
    const [root, editor] = useEditor(editorProps);
    const ChildWidget = editor.getWidget(root);
    return <ChildWidget editor={editor} node={root} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/StringWidget',
    component: Widget,
    decorators: [MantineThemeDecorator],
    argTypes: {
        showHeader: { control: 'boolean' },
        icon: { control: 'text' },
        tag: { control: 'text' },
        swapIconPosition: { control: 'boolean' },
        clearable: { control: 'boolean' }
    },
    args: {
        editorProps: {
            data: null,
            onChange: (v) => console.log(`change:`, v),
            schema: {
                title: 'A string value',
                description: 'Simple single-line text input',
                type: 'string'
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

export const LiveUpdate: Story = {
    args: {
        liveUpdate: true
    }
};

export const ColorWidget: Story = {
    args: {
        liveUpdate: true,
        editorProps: {
            data: '',
            onChange: (v) => console.log(`change: '${v}'`, typeof v),
            schema: {
                type: 'string',
                format: 'hexColor'
            }
        }
    }
};

export const TextareaWidget: Story = {
    args: {
        liveUpdate: true,
        editorProps: {
            data: '',
            onChange: (v) => console.log(`change: '${v}'`, typeof v),
            schema: {
                type: 'string',
                format: 'textarea'
            }
        }
    }
};
