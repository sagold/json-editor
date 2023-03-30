import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { SimpleJsonWidget } from './SimpleJsonWidget';

export default {
    title: 'packages/rje-widgets/SimpleJsonWidget',
    argTypes: {
        data: {
            control: { type: 'text' }
        },
        liveUpdate: {
            control: { type: 'boolean' }
        },
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
        <div className="rje-form">
            <SimpleJsonWidget node={node} editor={editor} options={options} />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 'some input string',
    liveUpdate: true,
    disabled: false,
    hidden: false,
    readOnly: false,
    required: false,
    schema: {
        title: 'Default string widget',
        type: 'object',
        format: 'json',
        description: 'options could go into storybook controls'
    }
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    data: '{ "text"  "some input string"}',
    schema: {
        title: 'Default string widget',
        type: 'object',
        format: 'json'
    }
};
