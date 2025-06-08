import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { JsonSchema, Editor, HistoryPlugin, useEditorPlugin } from '@sagold/react-json-editor';
import defaultWidgets, { JsonForm, Icon } from '@sagold/rje-mantine-widgets';
import { JsonWidget, JsonWidgetPlugin } from './jsonwidget/JsonWidget';
import { MantineThemeDecorator } from './docs/MantineThemeDecorator';
import { Button } from '@mantine/core';
import './rje-code-widgets.scss';

function CodeWidgetComponent(args) {
    const [editor, setEditor] = useState<Editor>();
    const [data, setData] = useState<unknown>(null);
    const history = useEditorPlugin(editor, HistoryPlugin);
    return (
        <div className="rje-form rje-theme rje-theme--light">
            <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => history?.undo()} disabled={history?.getUndoCount() === 0}>
                    <Icon>undo</Icon>
                </Button>
                <Button onClick={() => history?.redo()} disabled={history?.getRedoCount() === 0}>
                    <Icon>redo</Icon>
                </Button>
            </div>
            <JsonForm
                style={{ maxWidth: 680 }}
                addOptionalProps={false}
                schema={args.schema}
                onChange={setData}
                data={args.data}
                editor={setEditor}
                plugins={[HistoryPlugin]}
                widgets={[JsonWidgetPlugin, ...defaultWidgets]}
            />
        </div>
    );
}

type Story = StoryObj<typeof JsonWidget>;
const meta: Meta<typeof JsonWidget> = {
    title: 'packages/rje-code-widgets/JsonWidget',
    component: JsonWidget,
    decorators: [MantineThemeDecorator],
    argTypes: {
        // data: {
        //     control: { type: 'text' }
        // },
        // liveUpdate: {
        //     control: { type: 'boolean' }
        // },
        // disabled: {
        //     control: { type: 'boolean' }
        // },
        // readOnly: {
        //     control: { type: 'boolean' }
        // },
        // required: {
        //     control: { type: 'boolean' }
        // }
    },
    render: CodeWidgetComponent
};
export default meta;

const propertySchema = {
    type: 'object',
    required: ['productId', 'price'],
    properties: {
        productName: {
            title: 'Name of product',
            description:
                'Full description of [product name](https://namechk.com/product-name-generator/), including product number',
            type: 'string',
            minLength: 1
        },
        header: {
            type: 'object',
            title: 'Product header',
            description:
                'A product header is shown **below** the the product picture. A _title_ should be short and descriptive, the following date the date of the actual product release, not the date of updating product information.',
            required: ['title'],
            properties: {
                title: {
                    title: 'Product title',
                    type: 'string'
                },
                date: {
                    title: 'Date of entry',
                    type: 'string'
                }
            }
        },
        category: {
            enum: ['mobility', 'entertainment', 'education', 2923, true]
        },
        constant: {
            const: 'product-page'
        },
        productId: {
            title: 'ID of product',
            type: 'number'
        },
        price: {
            title: 'Price of product, in Euros',
            type: 'number'
        },
        tags: {
            title: 'Keywords of product',
            type: 'array',
            items: {
                type: 'string',
                enum: ['red', 'green', 'blue', 'cyan']
            }
        }
    },
    additionalProperties: false
} as unknown as JsonSchema;

const defaultSchema = {
    type: 'object',
    options: {
        editJson: {
            enabled: true,
            modalSize: 'large'
        }
    },
    properties: {
        title: {
            title: 'title',
            type: 'string'
        },
        jsonString: {
            title: 'Json Code Widget',
            type: 'string',
            format: 'json',
            options: {
                liveUpdate: true,
                schema: propertySchema
            }
        },
        jsonStringRef: {
            type: 'string',
            title: 'Json Data using $ref',
            format: 'json',
            options: {
                schema: {
                    $ref: '#/$defs/propertySchema'
                }
            }
        },
        jsonStringMissingSchema: {
            title: 'Json Code Widget',
            type: 'string',
            format: 'json'
        },
        jsonData: {
            type: 'object',
            format: 'json',
            $ref: '#/$defs/propertySchema'
        }
    },
    $defs: {
        propertySchema
    }
} as unknown as JsonSchema;

const dataObject = {
    productId: 123,
    category: 'enter',
    header: {
        title: 'What a wreck'
    },
    productName: '',
    price: 4563,
    tags: ['home', 'green', 123],
    yadda: 123
};

export const Primary: Story = {
    args: {
        schema: defaultSchema,
        data: {
            jsonString: JSON.stringify(dataObject, null, 2),
            jsonStringRef: JSON.stringify(dataObject, null, 2),
            jsonData: dataObject
        }
    }
};

export const AllOfIfThenElse: Story = {
    args: {
        schema: {
            format: 'json',
            title: 'allOf with multiple if-then-else statements',
            description:
                '**allOf** statement can combined multiple **if-then-else** statements. In this case, we want to add additional properties to the schema based on the presence of a specfic value. In case the schema is toggled, we do not want to lose its data in case the initial value is restored',
            type: 'object',
            required: ['addSchema'],
            properties: {
                addSchema: {
                    title: 'add schema?',
                    type: 'boolean',
                    default: false
                },
                additionalSchema: {
                    title: 'initial schema',
                    type: 'string'
                },
                secondSchema: {
                    title: 'second schema, based on additionalSchema having at least 1 character',
                    type: 'string'
                }
            },
            allOf: [
                {
                    if: {
                        properties: {
                            addSchema: {
                                type: 'boolean',
                                const: true
                            }
                        }
                    },
                    then: {
                        required: ['additionalSchema']
                    }
                },
                {
                    if: {
                        required: ['additionalSchema'],
                        properties: {
                            additionalSchema: {
                                type: 'string',
                                minLength: 1
                            }
                        }
                    },
                    then: {
                        required: ['secondSchema']
                    }
                }
            ]
        },
        data: {}
    }
};

export const OneOfSupport: Story = {
    args: {
        data: {
            filters: {
                typeA: [
                    {
                        op: 'nin',
                        property: 'energy_class',
                        values: []
                    }
                ],
                typeB: []
            }
        },
        schema: {
            title: 'Filter example',
            type: 'object',
            required: ['filters'],
            format: 'json',
            properties: {
                filters: {
                    title: 'Filters',
                    type: 'object',
                    required: ['typeA', 'typeB'],
                    properties: {
                        typeA: {
                            title: 'Filter for TypeA',
                            $ref: '#/$defs/filter'
                        },
                        typeB: {
                            title: 'Filter for TypeB',
                            $ref: '#/$defs/filter'
                        }
                    }
                }
            },
            $defs: {
                filter: {
                    type: 'array',
                    items: {
                        oneOfProperty: 'op',
                        oneOf: [
                            { $ref: '#/$defs/in:filter' },
                            { $ref: '#/$defs/nin:filter' },
                            { $ref: '#/$defs/eq:filter' }
                        ]
                    },
                    additionalItems: false
                },
                'in:filter': {
                    title: 'in-filter',
                    description:
                        'in-filter accepts only entries that have one of the following values assigned for the given property.',
                    type: 'object',
                    properties: {
                        op: {
                            const: 'in'
                        },
                        property: {
                            title: 'Column Key',
                            type: 'string',
                            minLength: 1
                        },
                        values: {
                            title: 'List of allowed values',
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },
                'nin:filter': {
                    title: 'nin-filter',
                    description:
                        'nin-filter accepts only entries that have **not one of the following** values assigned for the given property.',
                    type: 'object',
                    properties: {
                        op: {
                            const: 'nin'
                        },
                        property: {
                            title: 'Column Key',
                            type: 'string',
                            minLength: 1
                        },
                        values: {
                            title: 'List of forbidden values',
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },
                'eq:filter': {
                    title: 'eq-filter',
                    description:
                        'eq-filter accepts only entries that exactly have this value on the specified property.',
                    type: 'object',
                    properties: {
                        op: {
                            const: 'eq'
                        },
                        property: {
                            title: 'Column Key',
                            type: 'string',
                            minLength: 1
                        },
                        values: {
                            title: 'Value that has to match',
                            type: 'string'
                        }
                    }
                }
            }
        }
    }
};
