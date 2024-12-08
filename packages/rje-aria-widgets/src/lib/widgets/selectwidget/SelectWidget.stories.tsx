import React from 'react';
import { ComponentStory } from '@storybook/react';
import { useEditor } from '@sagold/react-json-editor';
import { SelectWidget } from './SelectWidget';
import { widgets } from '../../../index';
import { Theme } from '../../components/theme/Theme';

export default {
    title: 'packages/rje-aria-widgets/SelectWidget',
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
        },
        format: {
            control: { type: 'select' },
            options: ['select', 'radiogroup', 'taglist']
        }
    }
};

const Template: ComponentStory<any> = ({ data, schema, format, ...options }) => {
    const s = { ...schema, format };

    const [node, editor] = useEditor({ schema: s, widgets, data, validate: true });
    return (
        <Theme>
            <SelectWidget node={node} editor={editor} options={options} />
        </Theme>
    );
};

export const Default = Template.bind({});
Default.args = {
    data: 'apple',
    placeholder: 'Choose your juice',
    disabled: false,
    readOnly: false,
    required: false,
    horizontal: false,
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
