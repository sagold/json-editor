import type { Meta, StoryObj } from '@storybook/react';
import { TimeInput, TimeInputProps } from './TimeInput';
import { ThemeDecorator } from '../ThemeDecorator';

type Story = StoryObj<TimeInputProps>;
const meta: Meta<TimeInputProps> = {
  title: 'packages/rje-widgets/components/TimeInput',
  component: TimeInput,
  decorators: [ThemeDecorator],
  argTypes: {
    // data: { control: { type: 'object' } }
  },
  args: {
    title: 'Time input'
  }
};
export default meta;

export const FormatDate: Story = {
  args: {
    title: 'Time',
    defaultValue: '11:12:54.123',
    // granularity: 'hour',
    onChange: (date) => {
      console.log('on change', `${date.toDate()}`);
    }
  }
};
