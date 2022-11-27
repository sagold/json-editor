import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JsonWidget, JsonWidgetPlugin } from './jsonwidget/JsonWidget';
import { HistoryPlugin, HistoryPluginInstance } from 'headless-json-editor';
import { JSONSchema, JsonForm, defaultWidgets, JsonEditor } from '@sagold/react-json-editor';
import { Button, Icon } from 'semantic-ui-react';
import { useState, useRef } from 'react';
import './rje-code-widgets.css';

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

const schema = {
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
                schema={schema}
                data={args.data}
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
    data: {
        jsonString: JSON.stringify(dataObject, null, 2),
        jsonStringRef: JSON.stringify(dataObject, null, 2),
        jsonData: dataObject
    }
};
