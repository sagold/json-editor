import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { TextWidget } from './TextWidget';
import { Form } from 'semantic-ui-react';

export default {
    title: 'packages/rje-widgets/TextWidget',
    argTypes: {
        data: {
            control: { type: 'text' }
        },
        inline: {
            control: { type: 'boolean' }
        },
        // placeholder: {
        //     control: { type: 'text' }
        // },
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
        <Form error>
            <TextWidget node={node} editor={editor} options={options} />
        </Form>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 'some input string',
    liveUpdate: false,
    disabled: false,
    hidden: false,
    readOnly: false,
    required: false,
    schema: {
        title: 'Default string widget',
        type: 'string',
        format: 'textarea',
        maxLength: 20,
        description: 'options could go into storybook controls'
    }
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    data: 'some input string',
    schema: {
        title: 'Default string widget',
        type: 'string',
        format: 'textarea',
        maxLength: 4
    }
};
