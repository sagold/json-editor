import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JsonWidget, JsonWidgetPlugin } from './jsonwidget/JsonWidget';
import { HistoryPlugin, HistoryPluginInstance } from 'headless-json-editor';
import { JSONSchema, JsonForm, defaultWidgets, JsonEditor } from '@sagold/react-json-editor';
import { Button, Icon } from 'semantic-ui-react';
import { useState, useRef } from 'react';

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
} as unknown as JSONSchema;

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
            properties: propertySchema.properties
        }
    },
    $defs: {
        propertySchema
    }
} as unknown as JSONSchema;

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

export default {
    component: JsonWidget,
    title: 'CodeWidgets/JsonWidget'
} as ComponentMeta<typeof JsonWidget>;

const Template: ComponentStory<typeof JsonWidget> = (args) => {
    const [data, setState] = useState(args.data);

    const editor = useRef<JsonEditor>(null);
    const history = editor.current?.plugin('history') as HistoryPluginInstance;
    const isUndoEnabled = history ? history.getUndoCount() > 0 : false;
    const isRedoEnabled = history ? history.getRedoCount() > 0 : false;

    return (
        <div>
            <Button.Group icon>
                <Button icon onClick={() => history?.undo()} disabled={!isUndoEnabled}>
                    <Icon name="undo" />
                </Button>
                <Button icon onClick={() => history?.redo()} disabled={!isRedoEnabled}>
                    <Icon name="redo" />
                </Button>
            </Button.Group>
            <JsonForm
                schema={args.schema}
                data={data}
                ref={editor}
                plugins={[HistoryPlugin]}
                widgets={[JsonWidgetPlugin, ...defaultWidgets]}
                onChange={(data) => {
                    console.log('change event');
                    setState(data);
                }}
            />
        </div>
    );
};

export const Primary = Template.bind({});
Primary.args = {
    schema: defaultSchema,
    data: {
        jsonString: JSON.stringify(dataObject, null, 2),
        jsonStringRef: JSON.stringify(dataObject, null, 2),
        jsonData: dataObject
    }
};

export const OneOfSupport = Template.bind({});
OneOfSupport.args = {
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
                description: 'eq-filter accepts only entries that exactly have this value on the specified property.',
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
};
