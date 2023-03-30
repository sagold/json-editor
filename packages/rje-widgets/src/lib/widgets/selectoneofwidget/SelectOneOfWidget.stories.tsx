import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { SelectOneOfWidget } from './SelectOneOfWidget';
import { JsonSchema, ParentNode, Node, DefaultNodeOptions } from '@sagold/react-json-editor';

export default {
    title: 'packages/rje-widgets/SelectOneOfWidget',
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
    schema: JsonSchema;
    options?: Partial<DefaultNodeOptions>;
};

const Template: ComponentStory<any> = ({ data, schema, options = {} }: ComponentStoryProps) => {
    const [node, editor] = useJsonEditor<ParentNode>({
        schema,
        widgets,
        data,
        validate: true
    });
    return (
        <div className="rje-form">
            <SelectOneOfWidget node={node.children[0] as Node} editor={editor} options={options} />
        </div>
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
                        required: ['type', 'title'],
                        properties: {
                            type: { type: 'string', const: 'first' },
                            title: { type: 'string', title: 'header 1' }
                        }
                    },
                    {
                        type: 'object',
                        title: 'second option',
                        required: ['type', 'title'],
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
