import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchema, useEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { StringWidget, StringOptions } from './StringWidget';
import { Theme } from '../../components/theme/Theme';

type StringWidgetStoryProps = {
    data: string;
    schema: JsonSchema;
    format: 'text' | 'password';
} & StringOptions;

function StringWidgetStory({ data, schema, format, ...options }: StringWidgetStoryProps) {
    const s = { ...schema, format };
    const [node, editor] = useEditor({ schema: s, widgets, data, validate: true });
    return (
        <Theme>
            <StringWidget node={node} editor={editor} options={options} />
        </Theme>
    );
}

type Story = StoryObj<StringWidgetStoryProps>;

const meta: Meta<StringWidgetStoryProps> = {
    title: 'packages/rje-widgets/StringWidget',
    component: StringWidgetStory,
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
        format: {
            control: { type: 'select' },
            options: ['text', 'password']
        }
    }
};

export default meta;

export const Default: Story = {
    args: {
        data: 'some input string',
        liveUpdate: false,
        icon: undefined,
        tag: undefined,
        swapIconPosition: false,
        disabled: false,
        readOnly: false,
        required: false,
        schema: {
            title: 'Default string widget',
            type: 'string',
            maxLength: 20,
            description: 'options could go into storybook controls'
        }
    }
};

export const ErrorState: Story = {
    args: {
        data: 'some input string',
        schema: {
            title: 'Default string widget',
            type: 'string',
            maxLength: 4
        }
    }
};
