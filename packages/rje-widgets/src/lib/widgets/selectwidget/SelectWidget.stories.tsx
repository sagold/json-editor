import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { SelectWidget } from './SelectWidget';
import { Form } from 'semantic-ui-react';

export default {
    title: 'packages/rje-widgets/SelectWidget',
    argTypes: {}
};

const Template: ComponentStory<any> = ({ data, schema, ...options }) => {
    const [node, editor] = useJsonEditor({ schema, widgets, data, validate: true });
    return (
        <Form error>
            <SelectWidget node={node} editor={editor} options={options} />
        </Form>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 'apple',
    // liveUpdate: false,
    // disabled: false,
    // hidden: false,
    // readOnly: false,
    // required: false,
    schema: {
        title: 'Default string selection widget',
        type: 'string',
        enum: ['apple', 'coconut']
    }
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    data: 'nails',
    schema: {
        title: 'Default string selection widget',
        enum: ['apple', 'coconut']
    }
};
