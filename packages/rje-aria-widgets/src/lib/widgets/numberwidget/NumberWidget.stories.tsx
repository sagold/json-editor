import React from 'react';
import { ComponentStory } from '@storybook/react';
import { useEditor } from '@sagold/react-json-editor';
import { widgets, NumberWidget } from '@sagold/rje-aria-widgets';
import { Theme } from '../../components/theme/Theme';

export default {
    title: 'packages/rje-aria-widgets/NumberWidget',
    argTypes: {
        data: {
            control: { type: 'number' }
        },
        placeholder: {
            control: { type: 'text' }
        },
        withButtons: {
            control: { type: 'boolean' }
        },
        swapIconPosition: {
            control: { type: 'boolean' }
        },
        icon: {
            control: { type: 'text' }
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
        }
    }
};

const Template: ComponentStory<any> = ({ data, schema, ...options }) => {
    const [node, editor] = useEditor({ schema, widgets, data, validate: true });
    return (
        <Theme>
            <NumberWidget node={node} editor={editor} options={options} />
        </Theme>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 2023,
    icon: 'person',
    tag: 'year',
    swapIconPosition: false,
    withButtons: false,
    disabled: false,
    hidden: false,
    readOnly: false,
    required: false,
    schema: {
        title: 'Default string widget',
        type: 'number',
        maximum: 2023,
        description: 'options could go into storybook controls'
    }
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    schema: {
        title: 'Default number widget',
        type: 'number',
        default: 2000,
        options: {
            readOnly: true
        }
    }
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    data: 2023,
    schema: {
        title: 'Default number widget',
        type: 'number',
        maximum: 2000
    }
};

export const EmptyState = Template.bind({});
EmptyState.args = {
    data: null,
    validate: true,
    schema: {
        title: 'Default number widget',
        type: 'number',
        default: null
    }
};
