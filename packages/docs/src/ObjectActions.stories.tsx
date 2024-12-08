import type { Meta, StoryObj } from '@storybook/react';
import { JsonForm } from '@sagold/rje-aria-widgets';

const meta: Meta<typeof JsonForm> = {
    component: JsonForm
};

export default meta;
type Story = StoryObj<typeof JsonForm>;

export const AllPropertiesRequired: Story = {
    args: {
        theme: 'light',
        addOptionalProps: true,
        schema: {
            title: 'All properties are required',
            type: 'object',
            properties: {
                optionalProperty1: { title: '1. Optional property', type: 'object' },
                optionalProperty2: { title: '2. Optional property', type: 'object' }
            }
        }
    }
};

export const OptionalProperties: Story = {
    args: {
        theme: 'light',
        addOptionalProps: false,
        data: {
            optionalProperty: 'initial value'
        },
        schema: {
            title: 'Properties may be removed',
            type: 'object',
            properties: {
                optionalProperty1: { title: '1. Optional property', type: 'object' },
                optionalProperty2: { title: '2. Optional property', type: 'object' }
            }
        }
    }
};
