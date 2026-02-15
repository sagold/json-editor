import { StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';
import { ArrayOptions } from '@sagold/rje-mantine-widgets';
import { UseEditorOptions, useEditor, Widget } from '@sagold/react-json-editor';

type WidgetProps = ArrayOptions & { editorProps: UseEditorOptions };
function WidgetForm({ editorProps, ...props }: WidgetProps) {
    const editor = useEditor(editorProps);
    return (
        <div className="rje-form">
            <Widget editor={editor} options={props} />
        </div>
    );
}

export default {
    title: 'issues/ArrayWidget',
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
    name: '✅ OneOf ref fails',
    args: {
        editorProps: {
            validate: true,
            data: {
                main: [{ type: 'parent', children: [{ type: 'one' }, { type: 'one' }] }]
            },
            schema: {
                type: 'object',
                description: 'nested OneOfs, where a nested oneOf is invalid',
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
                            'Adding a duplicate item to this list fails as uniqueItems=true in children. In addition, the error message should flag the duplicated item with a unique-item error',
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
                                            required: ['type', 'title'],
                                            properties: {
                                                type: {
                                                    options: { hidden: true },
                                                    type: 'string',
                                                    const: 'one'
                                                },
                                                title: {
                                                    type: 'string',
                                                    default: 'First'
                                                }
                                            }
                                        },
                                        {
                                            type: 'object',
                                            title: 'Child: Second',
                                            required: ['type', 'title'],
                                            properties: {
                                                type: {
                                                    options: { hidden: true },
                                                    type: 'string',
                                                    const: 'two'
                                                },
                                                title: {
                                                    type: 'string',
                                                    default: 'Second'
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
