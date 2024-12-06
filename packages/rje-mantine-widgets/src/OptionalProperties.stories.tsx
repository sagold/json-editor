import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonForm } from '@sagold/rje-mantine-widgets';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
// import { JsonSchema } from 'headless-json-editor';

const meta: Meta<typeof JsonForm> = {
    title: 'packages/rje-mantine-widgets/OptionalProperties',
    component: JsonForm,
    render(props) {
        return (
            <MantineProvider>
                {/* mobile devices should havea min size of 16px (which prevents zoom on focus*/}
                <JsonForm {...props} style={{ '--input-fz': '16px' }} />
            </MantineProvider>
        );
    }
};

export default meta;
type Story = StoryObj<typeof JsonForm>;

export const Default: Story = {
    args: {
        validate: true,
        onChange: (v) => console.log(v),
        data: { objectOptionals: { optional1: 'input-value' } },
        schema: {
            title: 'Json Editor Optional Object Properties',
            type: 'object',
            required: ['objectOptionals'],
            properties: {
                objectOptionals: {
                    type: 'object',
                    required: ['required'],
                    properties: {
                        required: { title: 'required', type: 'string' },
                        optional1: { title: 'optional1', type: 'string' },
                        optional2: { title: 'optional2', type: 'string' },
                        optional3: { title: 'optional3', type: 'string' }
                    }
                }
            }
        }
    }
};
