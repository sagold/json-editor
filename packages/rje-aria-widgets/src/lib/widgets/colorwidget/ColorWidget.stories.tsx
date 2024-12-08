import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchema, useEditor, StringNode } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { ColorWidget, ColorOptions } from './ColorWidget';
import { Theme } from '../../components/theme/Theme';

type ColorWidgetStoryProps = {
    data: string;
    schema: JsonSchema;
} & ColorOptions;

function ColorWidgetStory({ data, schema, format, ...options }: ColorWidgetStoryProps) {
    const [node, editor] = useEditor<string, StringNode>({ schema, widgets, data, validate: true });
    return (
        <Theme>
            <ColorWidget node={node} editor={editor} options={options} />
        </Theme>
    );
}

type Story = StoryObj<ColorWidgetStoryProps>;

const meta: Meta<ColorWidgetStoryProps> = {
    title: 'packages/rje-aria-widgets/ColorWidget',
    component: ColorWidgetStory,
    argTypes: {},
    args: {
        data: ''
    }
};

export default meta;

export const Default: Story = {
    args: {
        data: '#ec62a7',
        schema: {
            title: 'Default Color widget',
            type: 'string',
            format: 'hexColor'
        }
    }
};

export const ErrorState: Story = {
    args: {
        data: 'some random text',
        schema: {
            title: 'Default Color widget',
            type: 'string',
            format: 'hexColor'
        }
    }
};
