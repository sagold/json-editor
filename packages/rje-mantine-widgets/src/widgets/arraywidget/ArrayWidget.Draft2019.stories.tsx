import { StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { ArrayOptions } from './ArrayWidget';
import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';
import { deepMerge } from '@mantine/core';
import { MinItems, Options } from './ArrayWidget.stories';

type WidgetProps = ArrayOptions & { editorProps: UseEditorOptions };
function WidgetForm({ editorProps, ...props }: WidgetProps) {
    const editor = useEditor(editorProps);
    return <Widget editor={editor} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/ArrayWidget/draft-2019-09',
    component: WidgetForm,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<WidgetProps>;

export const OptionsDraft2019: Story = deepMerge(Options, {
    args: {
        editorProps: {
            schema: {
                $schema: 'draft-2019-09',
                title: 'Array Widget Options',
                type: 'array',
                items: Options.args!.editorProps!.schema.items
            }
        }
    }
});

export const MinItemsDraft2019: Story = deepMerge(MinItems, {
    args: {
        editorProps: {
            schema: {
                $schema: 'draft-2019-09',
                type: 'array',
                minItems: 2,
                items: MinItems.args!.editorProps!.schema.prefixItems
            }
        }
    }
});
