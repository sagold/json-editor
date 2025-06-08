import { StoryObj } from '@storybook/react-webpack5';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { UseEditorOptions, useEditor, Widget, DefaultNodeOptions } from '@sagold/react-json-editor';

type WidgetProps = DefaultNodeOptions & { editorProps: UseEditorOptions };
function WidgetForm({ editorProps, ...props }: WidgetProps) {
    const editor = useEditor(editorProps);
    return <Widget editor={editor} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/BooleanWidget',
    component: WidgetForm,
    decorators: [MantineThemeDecorator],
    argTypes: {
        disabled: { control: 'boolean' },
        showHeader: { control: 'boolean' },
        title: { control: 'text' },
        description: { control: 'text' }
    },
    args: {
        editorProps: {
            data: null,
            onChange: (v) => console.log(`change:`, v),
            schema: {
                title: 'A boolean value',
                description: 'Toggle input',
                type: 'boolean'
            }
        }
    }
};

type Story = StoryObj<WidgetProps>;

export const Options: Story = {
    args: {
        disabled: false,
        showHeader: true
    }
};

export const Disabled: Story = {
    args: {
        disabled: true
    }
};

export const SwitchWidget: Story = {
    args: {
        editorProps: {
            data: '',
            onChange: (v) => console.log(`change: '${v}'`, typeof v),
            schema: {
                title: 'A boolean value',
                description: 'Toggle input',
                type: 'boolean',
                format: 'switch'
            }
        }
    }
};
