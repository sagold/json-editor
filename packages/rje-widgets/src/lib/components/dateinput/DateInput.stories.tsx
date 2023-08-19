import type { Meta, StoryObj } from '@storybook/react';
import { DateInput, DateInputProps } from './DateInput';
import { ThemeDecorator } from '../ThemeDecorator';
import { DateFormatter } from '@internationalized/date';

type Story = StoryObj<DateInputProps>;
const meta: Meta<DateInputProps> = {
    title: 'packages/rje-widgets/components/DateInput',
    component: DateInput,
    decorators: [ThemeDecorator],
    argTypes: {
        // data: { control: { type: 'object' } }
    },
    args: {
        title: 'Date input'
    }
};
export default meta;

export const FormatDate: Story = {
    args: {
        title: 'Date',
        defaultValue: '2023-12-01',
        granularity: 'day',
        format: 'date',
        onChange: (date) => {
            console.log('on change', `${date.toDate()}`);
        }
    }
};

// export const Minutes: Story = {
//     args: {
//         defaultDate: '2023-12-01T12:05:01',
//         granularity: 'minute',
//         format: 'date-time',
//         onChange: (date) => {
//             console.log('on change', `${date.toDate()}`);
//         }
//     }
// };

export const FormatDateTime: Story = {
    args: {
        title: 'DateTime',
        defaultValue: new Date().toISOString(),
        granularity: 'second',
        format: 'date-time',
        onChange: (date) => {
            console.log('on change', `${date.toDate()}`);
        }
    }
};
