import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { ObjectWidget, ObjectOptions } from './ObjectWidget';
import { JSONSchema, ArrayNode } from 'headless-json-editor';
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
    schema: JSONSchema;
    options?: Partial<ObjectOptions>;
};

const Template: ComponentStory<any> = ({ data, schema, options = {} }: ComponentStoryProps) => {
    const [node, editor] = useJsonEditor<ArrayNode<ObjectOptions>>({
        addOptionalProps: false,
        schema,
        widgets: defaultWidgets,
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
            optionalProperty: { type: 'number' }
        }
    }
};
