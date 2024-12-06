import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { ThemeDecorator } from '../ThemeDecorator';
import { parseDate, parseTime, parseAbsoluteToLocal, DateValue } from '@internationalized/date';

type Story = StoryObj<typeof Calendar>;
const meta: Meta<typeof Calendar> = {
  title: 'packages/rje-widgets/components/Calendar',
  component: Calendar,
  decorators: [ThemeDecorator],
  args: {
    value: parseDate('2023-12-04')
  }
};
export default meta;

export const Default = {};
