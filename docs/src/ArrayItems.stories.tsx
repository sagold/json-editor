import { JsonForm } from '@sagold/rje-mantine-widgets';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { JsonSchema } from 'headless-json-editor';
import { MantineThemeDecorator } from './decorators/MantineThemeDecorator';

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

export const ItemsArrayUnique: Story = {
    args: {
        validate: true,
        data: [{ title: 'a title' }, { subtitle: 'a subtitle' }],
        schema: {
            title: 'items: [schema, schema]',
            type: 'array',
            options: { showEditJsonAction: true },
            items: [
                {
                    title: 'Title',
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string' }
                    }
                },
                {
                    title: 'Subtitle',
                    type: 'object',
                    required: ['subtitle'],
                    properties: {
                        subtitle: { type: 'string' }
                    }
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
    } as JsonSchema
};

export const OneOf: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [{ type: 'header' }],
        schema: {
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

export const Length: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2023],
        schema: {
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

export const LengthTemplate: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
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

export const LengthDefaultOverride: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
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

export const IfThenElse: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
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

export const Enum: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [],
        schema: {
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

export const Not: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [123],
        schema: {
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

export const UniqueItems: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [1, 2, 2],
        schema: {
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

export const Contains: Story = {
    args: {
        validate: true,
        addOptionalProps: false,
        data: [2, 3],
        schema: {
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
