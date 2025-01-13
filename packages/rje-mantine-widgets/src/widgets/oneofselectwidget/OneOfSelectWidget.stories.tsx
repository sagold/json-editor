import { StoryObj } from '@storybook/react';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { OneOfSelectOptions } from './OneOfSelectWidget';
import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';

type WidgetProps = OneOfSelectOptions & { editorProps: UseEditorOptions };
function WidgetForm({ editorProps, ...props }: WidgetProps) {
    const editor = useEditor(editorProps);
    return <Widget editor={editor} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/OneOfSelectWidget',
    component: WidgetForm,
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
        classNames: ['my-headline'],
        /** description of this data point */
        description:
            'Options from these control settings can be passed to options-object in `{ type: "null", options: {} }`',
        /** set to true to inline description */
        descriptionInline: false,
        /** title of this data point */
        title: 'Null Widget Options',
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
            data: [{ title: 'Overview of oneOf-select options' }],
            schema: {
                title: 'OneOf Select Widget Options',
                type: 'object',
                oneOf: [
                    {
                        title: 'Header',
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: { type: 'string' }
                        }
                    },
                    {
                        title: 'Paragraph',
                        type: 'object',
                        required: ['paragraph'],
                        properties: {
                            paragraph: { type: 'string', format: 'textarea' }
                        }
                    }
                ]
            }
        }
    }
};
