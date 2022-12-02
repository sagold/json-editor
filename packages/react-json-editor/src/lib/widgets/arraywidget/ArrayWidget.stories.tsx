import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { ArrayWidget, ArrayOptions } from './ArrayWidget';
import { JSONSchema, ArrayNode } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';

export default {
    title: 'Widget/ArrayWidget',
    component: ArrayWidget,
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } },
        options: {
            control: { type: 'object' }
        }
    }
};

type ComponentStoryProps = {
    data: unknown[];
    schema: JSONSchema;
    options?: Partial<ArrayOptions>;
};

const Template: ComponentStory<any> = ({ data, schema, options = {} }: ComponentStoryProps) => {
    const [node, editor] = useJsonEditor<ArrayNode<ArrayOptions>>({
        schema,
        widgets: defaultWidgets,
        data,
        validate: true
    });
    return (
        <Form error>
            <ArrayWidget node={node} editor={editor} options={options} />
        </Form>
    );
};

export const DefaultWidget = Template.bind({});
DefaultWidget.args = {
    data: [
        { title: 'first value', value: 1 },
        { title: 'wrong value type', value: 'four' },
        { title: 'large number', value: 10009919291923 },
        { title: 'empty' }
    ],
    schema: {
        title: 'Array Example',
        description: 'description displayed as subheader',
        type: 'array',
        items: {
            title: 'content item',
            type: 'object',
            options: {
                previewValue: 'title'
            },
            properties: {
                title: { type: 'string' },
                value: { type: 'number', minimum: 1 }
            }
        }
    },
    options: {
        sortable: {
            enabled: true
        },
        header: {
            inverted: false,
            color: undefined
        },
        editJson: {
            enabled: false,
            liveUpdate: false
        },
        layout: {
            type: 'default'
        }
    }
};

export const DragAndDrop = Template.bind({});
DragAndDrop.args = {
    ...DefaultWidget.args,
    options: {
        sortable: {
            enabled: true
        }
    }
};

export const Collapsible = Template.bind({});
Collapsible.args = {
    ...DefaultWidget.args,
    options: {
        collapsed: true
    }
};

export const LayoutOptions = Template.bind({});
LayoutOptions.args = {
    ...DefaultWidget.args,
    options: {
        layout: {
            type: 'cards'
        }
    }
};

export const HeaderOptions = Template.bind({});
HeaderOptions.args = {
    ...DefaultWidget.args,
    options: {
        header: {
            inverted: true
        }
    }
};

export const EditJsonOptions = Template.bind({});
EditJsonOptions.args = {
    ...DefaultWidget.args,
    options: {
        editJson: {
            enabled: true,
            liveUpdate: true
        }
    }
};
