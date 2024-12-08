import type { Meta, StoryObj } from '@storybook/react';
import { FileField } from './FileField';
import { ThemeDecorator } from '../ThemeDecorator';

type Story = StoryObj<typeof FileField>;
const meta: Meta<typeof FileField> = {
    title: 'packages/rje-aria-widgets/components/FileField',
    component: FileField,
    decorators: [ThemeDecorator],
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } }
    }
};
export default meta;

export const Default = {
    args: {
        title: 'Default file selection',
        buttonText: 'Select a file'
    }
};
