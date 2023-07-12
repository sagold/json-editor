import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { StringWidget } from './StringWidget';
import { Theme } from '../../components/theme/Theme';

export default {
    title: 'packages/rje-widgets/StringWidget',
    argTypes: {
        data: {
            control: { type: 'text' }
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
        swapIconPosition: {
            control: { type: 'boolean' }
        },
        tag: {
            control: { type: 'text' }
        },
        disabled: {
            control: { type: 'boolean' }
        },
        readOnly: {
            control: { type: 'boolean' }
        },
        required: {
            control: { type: 'boolean' }
        },
        password: {
            control: { type: 'boolean' }
        }
    }
};

const Template: ComponentStory<any> = ({ data, schema, password, ...options }) => {
    const _schema = { ...schema, format: password ? 'password' : 'text' };
    const [node, editor] = useJsonEditor({ schema: _schema, widgets, data, validate: true });
    return (
        <Theme>
            <StringWidget node={node} editor={editor} options={options} />
        </Theme>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 'some input string',
    liveUpdate: false,
    icon: undefined,
    tag: undefined,
    swapIconPosition: false,
    disabled: false,
    readOnly: false,
    required: false,
    password: false,
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
