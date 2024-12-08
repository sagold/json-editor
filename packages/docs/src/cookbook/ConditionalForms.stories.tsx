import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchema } from '@sagold/react-json-editor';
import { JsonForm, widgets, Theme } from '@sagold/rje-aria-widgets';

const meta: Meta<typeof ConditionalFormStory> = {
    component: ConditionalFormStory
};

export default meta;
type Story = StoryObj<typeof ConditionalFormStory>;

function ConditionalFormStory() {
    return (
        <Theme>
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
        </Theme>
    );
}

export const ConditionalForm: Story = {};
