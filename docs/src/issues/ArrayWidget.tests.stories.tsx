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
                pageContents: []
            },
            schema: {
                type: 'object',
                required: ['pageContents'],
                properties: {
                    pageContents: {
                        title: 'Page',
                        type: 'array',
                        options: {
                            classNames: ['scm-page-contents'],
                            sortable: {
                                enabled: true
                            }
                        },
                        items: {
                            oneOfProperty: 'type',
                            oneOf: [{ $ref: '#/$defs/layout-column-one' }, { $ref: '#/$defs/layout-column-two' }]
                        }
                    },
                    footer: {
                        $ref: '#/$defs/component:footer'
                    }
                },
                $defs: {
                    'layout-column-two': {
                        title: 'two column layout',
                        type: 'object',
                        required: ['type', 'children'],
                        properties: {
                            type: {
                                options: { hidden: true },
                                type: 'string',
                                const: 'layout:column-two'
                            },
                            children: {
                                type: 'array',
                                options: { classNames: ['.scm-two-columns'] },
                                prefixItems: [
                                    {
                                        $ref: '#/$defs/layout-column-one',
                                        options: {
                                            classNames: ['.scm-column']
                                        }
                                    },
                                    {
                                        $ref: '#/$defs/layout-column-one',
                                        options: {
                                            classNames: ['.scm-column']
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    'layout-column-one': {
                        type: 'object',
                        title: 'single column layout',
                        required: ['type', 'children'],
                        properties: {
                            type: {
                                options: { hidden: true },
                                type: 'string',
                                const: 'layout:column-one'
                            },
                            children: {
                                type: 'array',
                                uniqueItems: true,
                                options: {
                                    sortable: {
                                        enabled: true
                                    }
                                },
                                items: {
                                    oneOfPropertyId: 'type',
                                    oneOf: [
                                        { $ref: '#/$defs/component:cta' },
                                        { $ref: '#/$defs/component:product-list' },
                                        { $ref: '#/$defs/component:address' }
                                    ]
                                }
                            }
                        }
                    },
                    components: {
                        oneOf: [
                            { $ref: '#/$defs/component:cta' },
                            { $ref: '#/$defs/component:product-list' },
                            { $ref: '#/$defs/component:address' }
                        ]
                    },
                    'component:cta': {
                        type: 'object',
                        title: 'CTA',
                        required: ['type'],
                        properties: {
                            type: {
                                options: { hidden: true },
                                type: 'string',
                                const: 'module:cta'
                            }
                        }
                    },
                    'component:product-list': {
                        type: 'object',
                        title: 'Product List',
                        required: ['type'],
                        properties: {
                            type: {
                                options: { hidden: true },
                                type: 'string',
                                const: 'module:product-list'
                            }
                        }
                    },
                    'component:address': {
                        type: 'object',
                        title: 'Address',
                        required: ['type'],
                        properties: {
                            type: {
                                options: { hidden: true },
                                type: 'string',
                                const: 'module:address'
                            }
                        }
                    },
                    'component:footer': {
                        type: 'object',
                        title: 'Footer',
                        required: ['type', 'withLogo'],
                        properties: {
                            type: {
                                options: { hidden: true },
                                type: 'string',
                                const: 'module:footer'
                            },
                            withLogo: {
                                type: 'boolean'
                            }
                        }
                    }
                }
            }
        }
    }
};
