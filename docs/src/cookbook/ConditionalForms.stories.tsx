import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { JsonSchema } from '@sagold/react-json-editor';
import { JsonForm, widgets } from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';

const meta: Meta<typeof ConditionalFormStory> = {
    title: 'docs/ConditionalForms',
    component: ConditionalFormStory,
    decorators: [MantineThemeDecorator]
};

export default meta;
type Story = StoryObj<typeof ConditionalFormStory>;

function ConditionalFormStory() {
    return (
        <JsonForm
            widgets={widgets}
            addOptionalProps={false}
            schema={
                {
                    type: 'object',
                    title: 'allOf with single if-then-else statements',
                    required: ['trigger'],
                    properties: {
                        trigger: {
                            title: 'with additional field',
                            type: 'boolean',
                            default: false
                        },
                        optional: {
                            options: { hidden: true, title: false },
                            type: 'object',
                            required: ['title'],
                            properties: {
                                title: {
                                    title: 'Optional form',
                                    type: 'string'
                                }
                            }
                        }
                    },
                    allOf: [
                        {
                            if: {
                                required: ['trigger'],
                                properties: {
                                    trigger: {
                                        const: true
                                    }
                                }
                            },
                            then: {
                                required: ['optional'],
                                properties: {
                                    optional: {
                                        options: { hidden: false },
                                        minLength: 1
                                    }
                                }
                            }
                        }
                    ]
                } as JsonSchema
            }
        />
    );
}

export const ConditionalForm: Story = {};
