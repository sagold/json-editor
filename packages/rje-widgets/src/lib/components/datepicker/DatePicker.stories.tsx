import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';
import { ThemeDecorator } from '../ThemeDecorator';

type Story = StoryObj<typeof DatePicker>;
const meta: Meta<typeof DatePicker> = {
  title: 'packages/rje-widgets/components/DatePicker',
  component: DatePicker,
  decorators: [ThemeDecorator],
  argTypes: {
    // data: { control: { type: 'object' } }
  },
  args: {
    title: 'Date picker'
  }
};
export default meta;

export const FormatDateTime = {
  args: {
    format: 'date-time'
  }
};

export const FormatDate = {
  args: {
    format: 'date'
  }
};

export const ReadOnly = {
  args: {
    format: 'date',
    readOnly: true,
    defaultValue: '2023-11-11'
  }
};
