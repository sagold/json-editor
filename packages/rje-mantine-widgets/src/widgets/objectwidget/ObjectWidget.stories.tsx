import { StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { ObjectOptions } from './ObjectWidget';
import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';

type WidgetProps = ObjectOptions & { editorProps: UseEditorOptions };
function WidgetForm({ editorProps, ...props }: WidgetProps) {
    const editor = useEditor(editorProps);
    return <Widget editor={editor} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/ObjectWidget',
    component: WidgetForm,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<WidgetProps>;

export const Options: Story = {
    argTypes: {
        collapsed: {
            control: 'radio',
            options: [null, true, false]
        },
        showInlineAddAction: {
            control: 'radio',
            options: [null, true, false]
        }
    },
    args: {
        // ----------------
        // DEFAULT OPTIONS
        // ----------------
        /** additional classnames the ui should add to the root of this data point */
        classNames: ['my-object'],
        /** description of this data point */
        description:
            'Options from these control settings can be passed to options-object in `{ type: "object", options: {} }`',
        /** set to true to inline description */
        descriptionInline: false,
        /** if changes to this data point are disabled */
        disabled: false,
        /** title of this data point */
        title: 'Object Widget Options',
        /** disable edit of form, but allow selection and copy of value */
        readOnly: false,
        /** flag titel as required */
        required: false,
        // ----------------
        // OBJECT OPTIONS
        // ----------------
        /** set to true to show inline button at the end of the array to add another item */
        showInlineAddAction: true,
        /** set to false to deactivate header menu */
        showHeaderMenu: true,
        /** set to false to deactivate array item-controls */
        showItemControls: true,
        /** if set, will add an accordion in the given toggle state */
        collapsed: false,
        selectable: false,
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
            data: [{ title: 'Overview of object options' }],
            schema: {
                title: 'Object Widget Options',
                type: 'object',
                required: ['title', 'teaser'],
                properties: {
                    title: {
                        title: 'Title',
                        type: 'string'
                    },
                    teaser: {
                        title: 'Teaser',
                        type: 'string',
                        format: 'textarea'
                    },
                    caption: {
                        title: 'Caption',
                        type: 'string'
                    },
                    sources: {
                        title: 'Sources',
                        type: 'array',
                        format: 'taglist',
                        items: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    }
};
