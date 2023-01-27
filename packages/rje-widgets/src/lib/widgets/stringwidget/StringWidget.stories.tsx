import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { StringWidget } from './StringWidget';
import { Form } from 'semantic-ui-react';

export default {
    title: 'packages/rje-widgets/StringWidget',
    argTypes: {
        data: {
            control: { type: 'text' }
        },
        inline: {
            control: { type: 'boolean' }
        },
        placeholder: {
            control: { type: 'text' }
        },
        liveUpdate: {
            control: { type: 'boolean' }
        },
        icon: {
            control: { type: 'text' }
        },
        iconPosition: {
            control: {
                options: ['left', 'right'],
                type: 'select'
            }
        },
        label: {
            control: { type: 'text' }
        },
        labelPosition: {
            control: {
                options: ['left', 'right', 'right corner', 'left corner'],
                type: 'select'
            }
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
            <StringWidget node={node} editor={editor} options={options} />
        </Form>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 'some input string',
    inline: false,
    liveUpdate: false,
    icon: undefined,
    iconPosition: 'left',
    disabled: false,
    hidden: false,
    readOnly: false,
    required: false,
    schema: {
        title: 'Default string widget',
        type: 'string',
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
        maxLength: 4
    }
};
