import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';
import { ThemeDecorator } from '../ThemeDecorator';

type Story = StoryObj<typeof TextArea>;
const meta: Meta<typeof TextArea> = {
  title: 'packages/rje-widgets/components/TextArea',
  decorators: [ThemeDecorator],
  component: TextArea
};
export default meta;

export const Default: Story = {
  args: {
    disabled: false,
    defaultValue: 'Suchbegriff',
    title: 'Input as String',
    setValue: (value) => console.log('value', value)
  }
};

export const Placeholder: Story = {
  args: {
    disabled: false,
    placeholder: 'Placeholder',
    title: 'A required input',
    required: true,
    setValue: (value) => console.log('value', value)
  }
};

export const ReadOnly: Story = {
  args: {
    disabled: false,
    readOnly: true,
    defaultValue: 'Suchbegriff',
    title: 'Input as String',
    setValue: (value) => console.log('value', value)
  }
};

export const Error: Story = {
  args: {
    disabled: false,
    error: true,
    defaultValue: 'Suchbegriff',
    title: 'Input with Error',
    setValue: (value) => console.log('value', value)
  }
};
