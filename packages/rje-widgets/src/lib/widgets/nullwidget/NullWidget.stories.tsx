import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { NullWidget } from './NullWidget';
import { Form } from 'semantic-ui-react';

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
        <Form error>
            <NullWidget node={node} editor={editor} options={options} />
        </Form>
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
