import type { Meta, StoryObj } from '@storybook/react';
import { ColorInput, ColorInputProps } from './ColorInput';
import { ThemeDecorator } from '../ThemeDecorator';

type Story = StoryObj<ColorInputProps>;
const meta: Meta<ColorInputProps> = {
    title: 'packages/rje-widgets/components/ColorInput',
    component: ColorInput,
    decorators: [ThemeDecorator],
    argTypes: {
        // value: { control: { type: 'string' } }
    },
    args: {
        title: 'Time input'
    }
};
export default meta;

export const Uncontrolled: Story = {
    args: {
        title: 'hex color input',
        defaultValue: '#333',
        // granularity: 'hour',
        onChange: (color) => {
            console.log('color', color);
        }
    }
};

export const Controlled: Story = {
    args: {
        title: 'hex color input',
        value: '#fafa99',
        // granularity: 'hour',
        onChange: (color) => {
            console.log('color', color);
        }
    }
};
