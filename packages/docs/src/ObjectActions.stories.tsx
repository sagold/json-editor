import type { Meta, StoryObj } from '@storybook/react';
import { JsonForm } from '@sagold/rje-widgets';

const meta: Meta<typeof JsonForm> = {
    component: JsonForm
};

export default meta;
type Story = StoryObj<typeof JsonForm>;

export const AllPropertiesRequired: Story = {
    args: {
        className: 'rje-theme rje-theme--light',
        addOptionalProps: true,
        schema: {
            title: 'All properties are required',
            type: 'object',
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};

export const OptionalProperties: Story = {
    args: {
        className: 'rje-theme rje-theme--light',
        addOptionalProps: false,
        data: {
            optionalProperty: 'initial value'
        },
        schema: {
            title: 'Properties may be removed',
            type: 'object',
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};
