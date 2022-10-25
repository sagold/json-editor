import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { SelectOneOfWidget } from './SelectOneOfWidget';
import { JSONSchema, ParentNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';
import '../../styles.scss';

export default {
    title: 'Widget/SelectOneOfWidget',
    component: SelectOneOfWidget,
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
    options?: Partial<DefaultNodeOptions>;
};

const Template: ComponentStory<any> = ({ data, schema, options = {} }: ComponentStoryProps) => {
    const [node, editor] = useJsonEditor<ParentNode>({
        schema,
        widgets: defaultWidgets,
        data,
        validate: true
    });
    return (
        <Form error>
            <SelectOneOfWidget node={node.children[0] as Node} editor={editor} options={options} />
        </Form>
    );
};

export const DefaultEditor = Template.bind({});
DefaultEditor.args = {
    data: {
        // @todo error when using oneOf on root object
        example: {
            type: 'first',
            title: ''
        }
    },
    schema: {
        type: 'object',
        properties: {
            example: {
                type: 'object',
                title: 'one of selection header',
                oneOfProperty: 'type',
                description: 'description only for object typeSelection',
                oneOf: [
                    {
                        type: 'object',
                        title: 'first option',
                        properties: {
                            type: { type: 'string', const: 'first' },
                            title: { type: 'string', title: 'header 1' }
                        }
                    },
                    {
                        type: 'object',
                        title: 'second option',
                        properties: {
                            type: { type: 'string', const: 'second' },
                            title: { type: 'string', title: 'header 2' }
                        }
                    }
                ]
            }
        }
    },
    options: {}
};
