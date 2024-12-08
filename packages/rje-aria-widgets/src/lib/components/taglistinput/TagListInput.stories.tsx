import type { Meta, StoryObj } from '@storybook/react';
import { TagListInput, TagListInputProps } from './TagListInput';
import { ThemeDecorator } from '../ThemeDecorator';

type Story = StoryObj<TagListInputProps>;
const meta: Meta<TagListInputProps> = {
    title: 'packages/rje-aria-widgets/components/TagListInput',
    component: TagListInput,
    decorators: [ThemeDecorator],
    args: {
        onCreate(name, items) {
            return { id: items.length, name };
        },
        displayValue: (item) => item.name
    }
    // argTypes: {
    //     data: { control: { type: 'object' } },
    //     schema: { control: { type: 'object' } }
    // }
};
export default meta;

export const Default = {
    args: {
        title: 'Default file selection',
        initialItems: [
            { id: '0', name: 'apple' },
            { id: '1', name: 'banana' }
        ],
        onChange(items) {
            console.log('on change', items);
        }
    }
};
