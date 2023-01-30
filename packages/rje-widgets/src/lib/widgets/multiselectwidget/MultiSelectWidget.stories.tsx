import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { MultiSelectWidget } from './MultiSelectWidget';
import { Form } from 'semantic-ui-react';

export default {
    title: 'packages/rje-widgets/MultiSelectWidget',
    argTypes: {
        disabled: {
            control: { type: 'boolean' }
        },
        readOnly: {
            control: { type: 'boolean' }
        },
        required: {
            control: { type: 'boolean' }
        }
    }
};

const Template: ComponentStory<any> = ({ data, schema, ...options }) => {
    const [node, editor] = useJsonEditor({ schema, widgets, data, validate: true });
    return (
        <Form error>
            <MultiSelectWidget node={node} editor={editor} options={options} />
        </Form>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: ['tomatoes', 'cheese'],
    disabled: false,
    readOnly: false,
    required: false,
    schema: {
        title: 'Multi selection widget',
        type: 'array',
        description: 'list of strings',
        items: {
            type: 'string'
        }
    }
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    data: ['tomatoes', 'cheese'],
    disabled: false,
    readOnly: false,
    required: false,
    schema: {
        title: 'Multi selection widget',
        type: 'array',
        description: 'list of strings',
        items: {
            type: 'string'
        },
        maxItems: 1
    }
};
