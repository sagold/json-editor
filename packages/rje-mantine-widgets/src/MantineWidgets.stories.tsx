import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonForm } from '@sagold/rje-mantine-widgets';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
// import { JsonSchema } from 'headless-json-editor';

const meta: Meta<typeof JsonForm> = {
    component: JsonForm,
    render(props) {
        return (
            <MantineProvider>
                <JsonForm {...props} />
            </MantineProvider>
        );
    }
};
export default meta;
type Story = StoryObj<typeof JsonForm>;

export const Default: Story = {
    args: {
        validate: true,
        data: { title: 'huhu' },
        schema: {
            title: 'Json Editor Mantine Widgets',
            type: 'object',
            required: ['title'],
            properties: {
                title: {
                    type: 'string',
                    title: 'string',
                    description: 'standard mantine textinput',
                    maxLength: 10,
                    options: {
                        icon: 'settings',
                        tag: '€'
                    }
                }
            }
        }
    }
};
