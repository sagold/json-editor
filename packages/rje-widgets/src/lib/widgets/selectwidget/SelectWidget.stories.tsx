import { ComponentStory } from '@storybook/react';
import { useJsonEditor } from '@sagold/react-json-editor';
import widgets, { SelectWidget } from '@sagold/rje-widgets';

export default {
    title: 'packages/rje-widgets/SelectWidget',
    argTypes: {
        placeholder: {
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
        }
    }
};

const Template: ComponentStory<any> = ({ data, schema, ...options }) => {
    const [node, editor] = useJsonEditor({ schema, widgets, data, validate: true });
    return (
        <div className="rje-form">
            <SelectWidget node={node} editor={editor} options={options} />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 'apple',
    placeholder: 'Choose your juice',
    disabled: false,
    readOnly: false,
    required: false,
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
