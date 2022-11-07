import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JsonWidget, JsonWidgetPlugin } from './jsonwidget/JsonWidget';
import { HistoryPlugin, HistoryPluginInstance } from 'headless-json-editor';
import { JSONSchema, JsonForm, defaultWidgets, useEditor } from '@sagold/react-json-editor';
import { Button, Icon } from 'semantic-ui-react';
import { useState } from 'react';
import './rje-code-widgets.css';

const propertySchema = {
    type: 'object',
    required: ['productId', 'price'],
    properties: {
        productName: {
            type: 'string',
            minLength: 1
        },
        header: {
            type: 'object',
            required: ['title'],
            properties: {
                title: { type: 'string' },
                counter: { type: 'number' }
            }
        },
        productId: {
            type: 'number'
        },
        price: {
            type: 'number'
        },
        tags: {
            type: 'array',
            items: {
                type: 'string'
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

    const editor = useEditor();
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
                editor={editor}
                plugins={[HistoryPlugin]}
                widgets={[JsonWidgetPlugin, ...defaultWidgets]}
                onChange={(data) => {
                    console.log('changed to', data);
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
