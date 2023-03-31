import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { BooleanWidget } from './BooleanWidget';
import { Theme } from '../../components/theme/Theme';

export default {
    title: 'packages/rje-widgets/BooleanWidget',
    argTypes: {
        data: {
            control: { type: 'boolean' }
        },
        type: {
            options: ['toggle', 'checkbox'],
            control: { type: 'select' }
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
        <Theme>
            <BooleanWidget node={node} editor={editor} options={options} />
        </Theme>
    );
};

export const Default = Template.bind({});
Default.args = {
    type: 'toggle',
    data: false,
    disabled: false,
    readOnly: false,
    required: false,
    schema: {
        title: 'Default boolean widget',
        type: 'boolean',
        description: 'options could go into storybook controls'
    }
};
