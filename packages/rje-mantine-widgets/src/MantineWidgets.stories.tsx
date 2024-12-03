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
        data: { string: 'huhu', array: ['first', 'fourth'] },
        schema: {
            title: 'Json Editor Mantine Widgets',
            type: 'object',
            required: ['string', 'number', 'boolean', 'select', 'selectTag', 'null', 'array'],
            properties: {
                string: {
                    type: 'string',
                    title: 'string',
                    description: 'standard mantine textinput',
                    maxLength: 10,
                    options: {
                        icon: 'gesture',
                        tag: '👍'
                    }
                },
                number: {
                    type: 'number',
                    title: 'number',
                    description: 'standard mantine numberinput',
                    maximum: 123,
                    options: {
                        icon: '123',
                        tag: '€'
                    }
                },
                boolean: {
                    type: 'boolean',
                    title: 'boolean',
                    description: 'standard mantine switch',
                    options: {}
                },
                select: {
                    type: 'string',
                    title: 'select',
                    description: 'standard non-native mantine select',
                    enum: ['yes', 'maybe', 'no'],
                    pattern: '(yes|maybe)'
                },
                selectTag: {
                    type: 'string',
                    title: 'select',
                    format: 'taglist',
                    description: 'standard mantine chip-group',
                    enum: ['yes', 'maybe', 'no']
                },
                null: {
                    type: 'null',
                    title: 'null widget',
                    description: 'standard mantine divider'
                },
                array: {
                    type: 'array',
                    items: {
                        title: 'string item',
                        description: 'standard mantine textinput',
                        type: 'string'
                    }
                }
            }
        }
    }
};
