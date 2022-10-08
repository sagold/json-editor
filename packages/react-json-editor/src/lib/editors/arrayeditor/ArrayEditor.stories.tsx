import { ComponentStory } from '@storybook/react';
import { defaultEditors, useJsonEditor } from '../../../index';
import { ArrayEditor, ArrayOptions } from './ArrayEditor';
import { JSONSchema, ArrayNode } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';
import '../../styles.scss';

export default {
    title: 'Editor/ArrayEditor',
    component: ArrayEditor,
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
    const [node, instance] = useJsonEditor<ArrayNode<ArrayOptions>>({
        schema,
        editors: defaultEditors,
        data
    });
    if (node == null) {
        return <></>;
    }

    instance.validate();

    return (
        // <div style={{ width: '400px' }}>
        <Form error>
            <ArrayEditor node={node} instance={instance} options={options} />
        </Form>
    );
};

export const DefaultEditor = Template.bind({});
DefaultEditor.args = {
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
            type: 'grid'
        }
    }
};

export const DragAndDrop = Template.bind({});
DragAndDrop.args = {
    ...DefaultEditor.args,
    options: {
        sortable: {
            enabled: true
        }
    }
};

export const Collapsible = Template.bind({});
Collapsible.args = {
    ...DefaultEditor.args,
    options: {
        collapsed: true
    }
};

export const LayoutOptions = Template.bind({});
LayoutOptions.args = {
    ...DefaultEditor.args,
    options: {
        layout: {
            type: 'cards'
        }
    }
};

export const HeaderOptions = Template.bind({});
HeaderOptions.args = {
    ...DefaultEditor.args,
    options: {
        header: {
            inverted: true
        }
    }
};

export const EditJsonOptions = Template.bind({});
EditJsonOptions.args = {
    ...DefaultEditor.args,
    options: {
        editJson: {
            enabled: true,
            liveUpdate: true
        }
    }
};
