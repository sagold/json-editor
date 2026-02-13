import { JsonForm } from '@sagold/rje-mantine-widgets';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { JsonSchema } from 'headless-json-editor';
import { MantineThemeDecorator } from './decorators/MantineThemeDecorator';
import deepMerge from 'deepmerge';
import { expect, within } from 'storybook/test';

const meta: Meta<typeof JsonForm> = {
    title: 'docs/ArrayItems',
    component: JsonForm,
    decorators: [MantineThemeDecorator]
};

export default meta;
type Story = StoryObj<typeof JsonForm>;

export const ItemsArray: Story = {
    args: {
        validate: true,
        data: ['a title', 'a subtitle'],
        schema: {
            $schema: 'draft-2020-12',
            title: 'prefixItems: [schema, schema]',
            type: 'array',
            prefixItems: [
                {
                    title: 'Title',
                    type: 'string'
                },
                {
                    title: 'Subtitle',
                    type: 'string'
                }
            ]
        }
    },
    play: async ({ canvas }) => {
        // const arrayMenu = await canvas.findByRole('button', { name: 'array-menu' });
        // expect(arrayMenu, 'should have actions disabled').toBeDisabled();

        const arrayItems = await canvas.findAllByRole('array-listitem');
        expect(arrayItems, 'Should have rendered two items').toHaveLength(2);

        const itemButton = within(arrayItems[0]).queryByRole('button');
        expect(itemButton, 'should NOT have rendered array actions').not.toBeInTheDocument();
    }
};

export const ItemsArrayDraft2019: Story = {
    play: ItemsArray.play,
    args: {
        validate: true,
        data: ['a title', 'a subtitle'],
        schema: {
            $schema: 'draft-2019-09',
            title: 'items: [schema, schema]',
            type: 'array',
            items: [
                {
                    title: 'Title',
                    type: 'string'
                },
                {
                    title: 'Subtitle',
                    type: 'string'
                }
            ]
        }
    }
};

export const AdditionalItemsUndefined: Story = {
    args: {
        validate: true,
        data: ['a title', 'a subtitle'],
        schema: {
            $schema: 'draft-2019-09',
            title: 'additionalItems: undefined',
            type: 'array',
            items: [
                {
                    title: 'Title',
                    type: 'string'
                },
                {
                    title: 'Subtitle',
                    type: 'string'
                }
            ]
        }
    }
};

export const AdditionalItemsTrue: Story = {
    args: {
        validate: true,
        data: ['a title', 'a subtitle', 'an additional item'],
        schema: {
            $schema: 'draft-2019-09',
            title: 'additionalItems: true',
            type: 'array',
            additionalItems: true,
            items: [
                {
                    title: 'Title',
                    type: 'string'
                },
                {
                    title: 'Subtitle',
                    type: 'string'
                }
            ]
        } as JsonSchema
    }
};

export const AdditionalItemsFalse: Story = {
    args: {
        validate: true,
        data: ['a title', 'a subtitle', 'an additional item'],
        schema: {
            $schema: 'draft-2019-09',
            title: 'additionalItems: false',
            type: 'array',
            additionalItems: false,
            items: [
                {
                    title: 'Title',
                    type: 'string'
                },
                {
                    title: 'Subtitle',
                    type: 'string'
                }
            ]
        } as JsonSchema
    }
};

export const AdditionalItemsSchema: Story = {
    args: {
        validate: true,
        data: ['a title', 'a subtitle', 'an additional item'],
        schema: {
            $schema: 'draft-2019-09',
            title: 'additionalItems: { type: "number" }',
            type: 'array',
            additionalItems: {
                title: 'Additional number',
                type: 'number'
            },
            items: [
                {
                    title: 'Title',
                    type: 'string'
                },
                {
                    title: 'Subtitle',
                    type: 'string'
                }
            ]
        }
    }
};

export const ItemsObject: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2023],
        schema: {
            $schema: 'draft-2020-12',
            title: 'items: { object }',
            type: 'array',
            items: {
                type: 'object',
                required: ['alt', 'image'],
                title: 'Content image',
                properties: {
                    alt: {
                        title: 'Image alt text',
                        type: 'string'
                    },
                    image: {
                        title: 'Image',
                        type: 'string',
                        format: 'file'
                    },
                    width: {
                        title: 'Width in px',
                        type: 'number',
                        default: 400
                    }
                }
            }
        }
    },
    play: async ({ canvas }) => {
        const arrayMenu = await canvas.findByRole('button', { name: 'array-menu' });
        expect(arrayMenu, 'should have actions enabled').toBeEnabled();

        const arrayItems = await canvas.findAllByRole('array-listitem');
        expect(arrayItems, 'Should have rendered one item').toHaveLength(1);
    }
};

export const ItemsObjectDraft2019: Story = {
    play: ItemsObject.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2023],
        schema: deepMerge(ItemsObject.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const OneOf: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [{ type: 'header' }],
        schema: {
            $schema: 'draft-2020-12',
            title: 'items: { oneOf: [ schema, schema ] }',
            type: 'array',
            items: {
                oneOfProperty: 'type',
                oneOf: [
                    {
                        id: 'header',
                        title: 'header',
                        type: 'object',
                        required: ['type', 'text'],
                        properties: {
                            type: {
                                type: 'string',
                                const: 'header',
                                options: {
                                    hidden: true
                                }
                            },
                            text: {
                                title: 'Header text',
                                type: 'string'
                            }
                        }
                    },
                    {
                        id: 'paragraph',
                        title: 'paragraph',
                        type: 'object',
                        required: ['type', 'text'],
                        properties: {
                            type: {
                                type: 'string',
                                const: 'paragraph',
                                options: {
                                    hidden: true
                                }
                            },
                            text: {
                                title: 'Paragraph text',
                                type: 'string'
                            }
                        }
                    }
                ]
            },
            additionalItems: {
                title: 'Width in px',
                type: 'number',
                default: 400
            }
        }
    } as JsonSchema
};

export const OneOfDraft2019: Story = {
    play: OneOf.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [{ type: 'header' }],
        schema: deepMerge(OneOf.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const Length: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2023],
        schema: {
            $schema: 'draft-2020-12',
            title: 'minItems: 1, maxItems: 2',
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: {
                title: 'item',
                type: 'number',
                default: 1
            }
        }
    }
};

export const LengthDraft2019: Story = {
    play: Length.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2023],
        schema: deepMerge(Length.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const LengthTemplate: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
            $schema: 'draft-2020-12',
            title: 'minItems: 1 - empty data',
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: {
                title: 'option',
                type: 'string',
                enum: ['first', 'second', 'third']
            }
        }
    }
};

export const LengthTemplateDraft2019: Story = {
    play: LengthTemplate.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: deepMerge(LengthTemplate.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const LengthDefaultOverride: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
            $schema: 'draft-2020-12',
            title: 'minItems: 1 - empty data',
            type: 'array',
            minItems: 1,
            maxItems: 2,
            default: [],
            items: {
                title: 'option',
                type: 'string',
                enum: ['first', 'second', 'third']
            }
        }
    }
};

export const LengthDefaultOverrideDraft2019: Story = {
    play: LengthDefaultOverride.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: deepMerge(LengthDefaultOverride.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const IfThenElse: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
            $schema: 'draft-2020-12',
            title: 'if: { items: { maximum: 1 } }',
            type: 'array',
            items: {
                title: 'Item',
                type: 'number',
                default: 2
            },
            minItems: 1,
            if: {
                items: {
                    maximum: 1
                }
            },
            then: {
                maxItems: 1
            },
            else: {
                maxItems: 0
            }
        }
    }
};

export const IfThenElseDraft2019: Story = {
    play: IfThenElse.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: deepMerge(IfThenElse.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const Enum: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
            $schema: 'draft-2020-12',
            title: 'enum: [[], []]',
            type: 'array',
            enum: [
                [2019, 10, 22],
                [2023, 1, 1]
            ],
            items: {
                type: 'number'
            },
            minItems: 3,
            maxItems: 3
        }
    }
};

export const EnumDraft2019: Story = {
    play: Enum.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: deepMerge(Enum.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const Not: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [123],
        schema: {
            $schema: 'draft-2020-12',
            title: 'not: { items: { const: 123 }}',
            description: 'value 123 is not allowed as array item',
            type: 'array',
            not: {
                type: 'array',
                items: {
                    const: 123
                }
            },
            items: {
                title: 'item',
                type: 'number',
                default: 12
            }
        }
    }
};

export const NotDraft2019: Story = {
    play: Not.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [123],
        schema: deepMerge(Not.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const UniqueItems: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [1, 2, 2],
        schema: {
            $schema: 'draft-2020-12',
            title: 'uniqueItems: true',
            type: 'array',
            uniqueItems: true,
            items: {
                title: 'item',
                type: 'number',
                default: 1
            }
        }
    }
};

export const UniqueItemsDraft2019: Story = {
    play: UniqueItems.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [1, 2, 2],
        schema: deepMerge(UniqueItems.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const Contains: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2, 3],
        schema: {
            $schema: 'draft-2020-12',
            title: 'contains: { const: 1 }',
            type: 'array',
            items: {
                title: 'item',
                type: 'number',
                default: 1
            },
            contains: {
                type: 'number',
                const: 1
            }
        }
    }
};

export const ContainsDraft2019: Story = {
    play: Contains.play,
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2, 3],
        schema: deepMerge(Contains.args!.schema!, { $schema: 'draft-2019-09' })
    }
};
