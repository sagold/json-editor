import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchema, useEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { TextWidget, TextWidgetOptions } from './TextWidget';
import { Theme } from '../../components/theme/Theme';

type TextWidgetStoryProps = {
    data: string;
    schema: JsonSchema;
} & TextWidgetOptions;
function TextWidgetStory({ data, schema, ...options }: TextWidgetStoryProps) {
    const [node, editor] = useEditor({ schema, widgets, data, validate: true });
    return (
        <Theme>
            <TextWidget node={node} editor={editor} options={options} />
        </Theme>
    );
}
type Story = StoryObj<TextWidgetStoryProps>;
const meta: Meta<TextWidgetStoryProps> = {
    title: 'packages/rje-widgets/TextWidget',
    component: TextWidgetStory,
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
export default meta;

export const Default: Story = {
    args: {
        data: 'some input string',
        liveUpdate: false,
        disabled: false,
        readOnly: false,
        required: false,
        schema: {
            title: 'Default string widget',
            type: 'string',
            format: 'textarea',
            maxLength: 200,
            description: 'options could go into storybook controls'
        }
    }
};

export const ErrorState: Story = {
    args: {
        data: 'some input string',
        liveUpdate: true,
        schema: {
            title: 'Default string widget',
            type: 'string',
            format: 'textarea',
            maxLength: 4
        }
    }
};
