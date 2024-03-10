import { ComponentStory } from '@storybook/react';
import { useEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { SimpleJsonWidget } from './SimpleJsonWidget';
import { Theme } from '../../components/theme/Theme';

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
    const [node, editor] = useEditor({ schema, widgets, data, validate: true });
    return (
        <Theme>
            <SimpleJsonWidget node={node} editor={editor} options={options} />
        </Theme>
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
        description: 'options could go into storybook controls',
        properties: {}
    }
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    data: '{ "text"  "some input string"}',
    schema: {
        title: 'Default string widget',
        type: 'object',
        format: 'json',
        required: ['title'],
        properties: {
            title: {
                type: 'string',
                minLength: 4,
                default: '123'
            }
        }
    }
};
