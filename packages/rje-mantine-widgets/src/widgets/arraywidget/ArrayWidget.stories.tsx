import { StoryObj } from '@storybook/react';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { ArrayOptions } from './ArrayWidget';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';

type WidgetProps = ArrayOptions & { editorProps: UseEditorOptions };
function Widget({ editorProps, ...props }: WidgetProps) {
    const [root, editor] = useEditor(editorProps);
    const ChildWidget = editor.getWidget(root);
    return <ChildWidget editor={editor} node={root} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/ArrayWidget',
    component: Widget,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<WidgetProps>;

export const Options: Story = {
    argTypes: {
        collapsed: {
            control: 'radio',
            options: [null, true, false]
        }
    },
    args: {
        // ----------------
        // DEFAULT OPTIONS
        // ----------------
        /** additional classnames the ui should add to the root of this data point */
        classNames: ['my-array'],
        /** description of this data point */
        description:
            'Options from these control settings can be passed to options-object in `{ type: "array", options: {} }`',
        /** set to true to inline description */
        descriptionInline: false,
        /** if changes to this data point are disabled */
        disabled: false,
        /** title of this data point */
        title: 'Array Widget Options',
        /** disable edit of form, but allow selection and copy of value */
        readOnly: false,
        /** flag titel as required */
        required: false,
        // ----------------
        // ARRAY OPTIONS
        // ----------------
        /** set to { enabled: true } for dragndrop */
        sortable: {
            enabled: true
        },
        /** set to true to show inline button at the end of the array to add another item */
        showInlineAddAction: true,
        /** set to false to deactivate header menu */
        showHeaderMenu: true,
        /** set to false to deactivate array item-controls */
        showItemControls: true,
        /** if set, will add an accordion in the given toggle state */
        collapsed: false,
        /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
        showEditJsonAction: true,
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
            data: [{ title: 'Overview of array options' }],
            schema: {
                title: 'Array Widget Options',
                type: 'array',
                items: {
                    oneOf: [
                        {
                            title: 'Header',
                            type: 'object',
                            required: ['title'],
                            options: { showEditJsonAction: true },
                            properties: {
                                title: { type: 'string' }
                            }
                        },
                        {
                            title: 'Paragraph',
                            type: 'object',
                            required: ['paragraph'],
                            options: { showEditJsonAction: true },
                            properties: {
                                paragraph: { type: 'string', format: 'textarea' }
                            }
                        },
                        {
                            title: 'Quote',
                            type: 'string'
                        },
                        {
                            title: 'Number',
                            options: { showHeader: false },
                            type: 'number'
                        }
                    ]
                },
                additionalItems: {
                    title: 'Additional number',
                    type: 'number',
                    default: 1
                }
            }
        }
    }
};
