import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { ObjectWidget, ObjectOptions } from './ObjectWidget';
import { JsonSchema, ArrayNode } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';

export default {
    title: 'packages/rje-widgets/ObjectWidget',
    component: ObjectWidget,
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
    schema: JsonSchema;
    options?: Partial<ObjectOptions>;
};

const Template: ComponentStory<any> = ({ data, schema, options = {} }: ComponentStoryProps) => {
    const [node, editor] = useJsonEditor<ArrayNode<ObjectOptions>>({
        addOptionalProps: false,
        schema,
        widgets,
        data,
        validate: true
    });
    return (
        <Form error>
            <ObjectWidget node={node} editor={editor} options={options} />
        </Form>
    );
};

const options: ObjectOptions = {
    editJson: { enabled: true }
};

export const DefaultWidget = Template.bind({});
DefaultWidget.args = {
    options,
    schema: {
        type: 'object',
        title: 'object title',
        description: 'object with a required and an optional property',
        required: ['propertyString'],
        properties: {
            propertyString: { type: 'string' },
            optionalProperty: { type: 'number' },
            description: { type: 'string' }
        }
    }
};

export const NestedObjectWidget = Template.bind({});
NestedObjectWidget.args = {
    options,
    schema: {
        type: 'object',
        title: 'Nested Objects',
        description: '',
        required: ['description', 'object'],
        properties: {
            description: { type: 'string' },
            object: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    caption: { type: 'string' }
                }
            },
            optionalProperty: { type: 'number' }
        }
    }
};
