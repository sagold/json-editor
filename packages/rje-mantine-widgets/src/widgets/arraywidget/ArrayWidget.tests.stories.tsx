import { StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { ArrayOptions } from './ArrayWidget';
import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';

type WidgetProps = ArrayOptions & { editorProps: UseEditorOptions };
function WidgetForm({ editorProps, ...props }: WidgetProps) {
    const editor = useEditor(editorProps);
    return <Widget editor={editor} options={props} />;
}

export default {
    title: 'packages/rje-mantine-widgets/widgets/ArrayWidget/tests',
    component: WidgetForm,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<WidgetProps>;

/**
 * challenge: nested OneOfs, where a nested oneOf is invalid
 * - replaces parentNode...
 * - fix in json-schema-library resolveOneOfFuzzy
 * - json-editor: ensure we still maintain nodes...
 */
export const OneOfRefFails: Story = {
    args: {
        editorProps: {
            validate: true,
            data: {
                main: [{ type: 'parent', children: [{ type: 'one' }, { type: 'one' }] }]
            },
            schema: {
                type: 'object',
                required: ['main'],
                properties: {
                    main: {
                        type: 'array',
                        items: {
                            oneOfProperty: 'type',
                            oneOf: [{ $ref: '#/$defs/parent' }]
                        }
                    }
                },
                $defs: {
                    parent: {
                        type: 'object',
                        title: 'Parent',
                        description:
                            'Adding a duplicate item to this list fails as uniqueItems=true in children. @todo correct error message',
                        required: ['type', 'children'],
                        properties: {
                            type: {
                                options: { hidden: true },
                                type: 'string',
                                const: 'parent'
                            },
                            children: {
                                type: 'array',
                                title: 'Children',
                                uniqueItems: true,
                                items: {
                                    oneOfProperty: 'type',
                                    oneOf: [
                                        {
                                            type: 'object',
                                            title: 'Child: First',
                                            required: ['type'],
                                            properties: {
                                                type: {
                                                    options: { hidden: true },
                                                    type: 'string',
                                                    const: 'one'
                                                }
                                            }
                                        },
                                        {
                                            type: 'object',
                                            title: 'Child: Second',
                                            required: ['type'],
                                            properties: {
                                                type: {
                                                    options: { hidden: true },
                                                    type: 'string',
                                                    const: 'two'
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
