import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchema, useEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { SelectMultipleWidget, SelectMultipleWidgetOptions } from './SelectMultipleWidget';
import { Theme } from '../../components/theme/Theme';

type SelectMultipleWidgetStoryProps = {
  data: string;
  schema: JsonSchema;
} & SelectMultipleWidgetOptions;

function StringWidgetStory({ data, schema, format, ...options }: SelectMultipleWidgetStoryProps) {
  const s = { ...schema, format };
  const [node, editor] = useEditor({ schema: s, widgets, data, validate: true });
  return (
    <Theme>
      <SelectMultipleWidget node={node} editor={editor} options={options} />
    </Theme>
  );
}

type Story = StoryObj<SelectMultipleWidgetStoryProps>;

const meta: Meta<SelectMultipleWidgetStoryProps> = {
  title: 'packages/rje-widgets/SelectMultipleWidget',
  component: StringWidgetStory,
  argTypes: {
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
    data: ['banana'],
    liveUpdate: false,
    icon: undefined,
    tag: undefined,
    swapIconPosition: false,
    disabled: false,
    readOnly: false,
    required: false,
    schema: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['apple', 'banana', 'peach', 'lemon', 'cabbage']
      }
    }
  }
};

export const ErrorState: Story = {
  args: {
    data: ['nails'],
    schema: {
      title: 'MultiSelect Error State',
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['apple', 'banana', 'peach', 'lemon', 'cabbage'],
        maxLength: 3
      }
    }
  }
};
