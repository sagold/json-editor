import { StoryObj } from '@storybook/react';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { NullOptions } from './NullWidget';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';

type WidgetProps = NullOptions & { editorProps: UseEditorOptions };
function Widget({ editorProps, ...props }: WidgetProps) {
    const [root, editor] = useEditor(editorProps);
    const ChildWidget = editor.getWidget(root);
    return <ChildWidget editor={editor} node={root} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/NullWidget',
    component: Widget,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<WidgetProps>;

export const Options: Story = {
    args: {
        // ----------------
        // DEFAULT OPTIONS
        // ----------------
        /** additional classnames the ui should add to the root of this data point */
        classNames: ['my-headline'],
        /** description of this data point */
        description:
            'Options from these control settings can be passed to options-object in `{ type: "null", options: {} }`',
        /** set to true to inline description */
        descriptionInline: false,
        /** title of this data point */
        title: 'Null Widget Options',
        /** flag titel as required */
        required: false,
        // ----------------
        // NULL OPTIONS
        // ----------------
        /** if true will add a separator line to the header */
        showTitleDivider: true,
        /** mantine Title props */
        titleProps: {
            order: 3
        },
        dividerProps: {
            labelPosition: 'left'
        },
        editorProps: {
            validate: true,
            data: [{ title: 'Overview of null options' }],
            schema: {
                title: 'Null Widget Options',
                type: 'null'
            }
        }
    }
};
