import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JsonWidget, JsonWidgetPlugin } from './jsonwidget/JsonWidget';
import { JSONSchema, JsonForm, defaultWidgets } from '@sagold/react-json-editor';
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
                schema: propertySchema
            }
        },
        jsonData: {
            type: 'object',
            format: 'json',
            properties: propertySchema.properties
        }
    }
} as unknown as JSONSchema;

const data = {
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
    return (
        <JsonForm
            schema={schema}
            data={{
                jsonString: JSON.stringify(data, null, 2),
                jsonData: data
            }}
            widgets={[JsonWidgetPlugin, ...defaultWidgets]}
            onChange={(data) => {
                console.log('data', data);
            }}
        />
    );
};
export const Primary = Template.bind({});
Primary.args = {};
