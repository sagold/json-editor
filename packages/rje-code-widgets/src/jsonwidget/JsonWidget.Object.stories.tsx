import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import defaultWidgets, { JsonForm } from '@sagold/rje-mantine-widgets';
import { JsonWidgetPlugin } from './JsonWidget';
import { MantineThemeDecorator } from '../docs/MantineThemeDecorator';
import '../rje-code-widgets.scss';
import { JsonSchema } from '@sagold/react-json-editor';

type Story = StoryObj<{ schema: JsonSchema; theme?: string; data?: any }>;

const meta: Meta<{ schema: JsonSchema; theme?: string; data?: any }> = {
    title: 'packages/rje-code-widgets/JsonWidget/Object',
    // component: JsonWidget,
    argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark']
        }
    },
    decorators: [MantineThemeDecorator],
    render({ schema, data, theme }) {
        const s = {
            ...schema,
            options: {
                ...schema.options,
                theme
            }
        };

        return (
            <JsonForm
                addOptionalProps={false}
                schema={s}
                data={data}
                widgets={[JsonWidgetPlugin, ...defaultWidgets]}
                style={{ width: '100%' }}
            />
        );
    }
};
export default meta;

export const Default: Story = {
    args: {
        schema: {
            type: 'object',
            format: 'json',
            options: {
                theme: 'dark'
            },
            required: ['string', 'number', 'object'],
            properties: {
                string: {
                    type: 'string',
                    title: 'a string value'
                },
                number: {
                    type: 'number',
                    title: 'a number value',
                    description:
                        'if this value is a string, it will get converted as number or not stored at all - but still being displayed'
                },
                object: {
                    type: 'object',
                    title: 'an object with required title and subTitle',
                    required: ['title'],
                    properties: {
                        title: { type: 'string' },
                        subTitle: { type: 'string' }
                    }
                }
            }
        }
    }
};
