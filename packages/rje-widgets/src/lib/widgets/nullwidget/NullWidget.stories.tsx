import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { NullWidget } from './NullWidget';

export default {
    title: 'packages/rje-widgets/NullWidget',
    argTypes: {
        type: {
            options: ['toggle', 'checkbox'],
            control: { type: 'select' }
        },
        separator: {
            control: { type: 'boolean' }
        },
        disabled: {
            control: { type: 'boolean' }
        }
    }
};

const Template: ComponentStory<any> = ({ data, schema, ...options }) => {
    const [node, editor] = useJsonEditor({ schema, widgets, data, validate: true });
    return (
        <div className="rje-form">
            <NullWidget node={node} editor={editor} options={options} />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    type: 'toggle',
    data: null,
    separator: false,
    disabled: false,
    schema: {
        title: 'Default null widget',
        type: 'null',
        description: 'use as inline header or for additional information'
    }
};
