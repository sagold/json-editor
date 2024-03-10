import type { Meta, StoryObj } from '@storybook/react';
import { JsonForm } from '@sagold/rje-widgets';
import { JsonSchema } from 'headless-json-editor';

const meta: Meta<typeof JsonForm> = {
    component: JsonForm
};
export default meta;
type Story = StoryObj<typeof JsonForm>;

export const OptionalProperties: Story = {
    args: {
        theme: 'light',
        schema: {
            type: 'object',
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};

export const InitialOptionalProperty: Story = {
    args: {
        theme: 'light',
        data: { optionalProperty: 'input data' },
        schema: {
            type: 'object',
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};

export const AddOptionalProps: Story = {
    args: {
        theme: 'light',
        addOptionalProps: true,
        schema: {
            title: 'addOptionalProps: true',
            type: 'object',
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};

export const RequiredProperties: Story = {
    args: {
        theme: 'light',
        schema: {
            title: 'required: [ property ]',
            type: 'object',
            required: ['requiredProperty'],
            properties: {
                requiredProperty: { title: 'Required Property', type: 'string' },
                optionalProperty: { title: 'Optional Property', type: 'string' }
            }
        }
    }
};

export const AdditionalProperties: Story = {
    args: {
        theme: 'light',
        data: { additionalProperty: 'property without schema' },
        schema: {
            type: 'object'
        }
    }
};

export const AdditionalPropertiesFalse: Story = {
    args: {
        theme: 'light',
        data: { additionalProperty: 'property without schema' },
        schema: {
            title: 'additionalProperties: false',
            type: 'object',
            additionalProperties: false
        } as JsonSchema
    }
};

export const AdditionalPropertiesSchema: Story = {
    args: {
        theme: 'light',
        data: { additionalProperty: 'property without schema' },
        validate: true,
        schema: {
            title: 'additionalProperties: { maxLength }',
            type: 'object',
            additionalProperties: {
                type: 'string',
                maxLength: 10
            }
        }
    }
};

export const EditJson: Story = {
    args: {
        theme: 'light',
        data: { additionalProperty: 'property without schema' },
        schema: {
            type: 'object',
            title: 'options: { editJson: { enabled: true } }',
            description:
                'Using an object with a title will switch actions for optional properties to be placed in the actions-icon besides its title. Inline delete options are moved into their panel for a cleaner ui. Using EditJson action from the actions panel will allow the user to add additional data in json format.',
            options: {
                editJson: {
                    enabled: true
                }
            },
            additionalProperties: {
                type: 'string'
            }
        }
    }
};

export const OneOfObject: Story = {
    args: {
        theme: 'light',
        schema: {
            oneOf: [
                {
                    type: 'object',
                    title: 'First Option',
                    required: ['one'],
                    properties: {
                        one: {
                            type: 'string',
                            title: 'Property String'
                        }
                    }
                },
                {
                    type: 'object',
                    title: 'Second Option',
                    required: ['one'],
                    properties: {
                        one: {
                            type: 'number',
                            title: 'Property Number'
                        }
                    }
                }
            ]
        } as JsonSchema
    }
};

export const InvalidOneOfObject: Story = {
    args: {
        theme: 'light',
        data: { one: 'input data' },
        schema: {
            oneOf: [
                {
                    type: 'object',
                    title: 'First Option',
                    required: ['one'],
                    properties: {
                        one: {
                            type: 'string',
                            title: 'Property One'
                        }
                    }
                },
                {
                    type: 'object',
                    title: 'Unselectable Second Option',
                    required: ['one'],
                    properties: {
                        one: {
                            type: 'string',
                            title: 'Property Two'
                        }
                    }
                }
            ]
        } as JsonSchema
    }
};

export const TypedOneOfObject: Story = {
    args: {
        theme: 'light',
        schema: {
            oneOf: [
                {
                    type: 'object',
                    title: 'Select A',
                    required: ['id', 'one'],
                    properties: {
                        id: { type: 'string', const: 'A' },
                        one: {
                            type: 'string',
                            title: 'Property ID A'
                        }
                    }
                },
                {
                    type: 'object',
                    title: 'Select B',
                    required: ['id', 'one'],
                    properties: {
                        id: { type: 'string', const: 'B' },
                        one: {
                            type: 'string',
                            title: 'Property ID B'
                        }
                    }
                }
            ]
        } as JsonSchema
    }
};

export const OneOfProperty: Story = {
    args: {
        theme: 'light',
        data: { id: 'B', one: 'B' },
        schema: {
            oneOfProperty: 'id',
            oneOf: [
                {
                    type: 'object',
                    title: 'Select A',
                    required: ['id', 'one'],
                    properties: {
                        id: { type: 'string', const: 'A', options: { hidden: true } },
                        one: {
                            type: 'string',
                            title: 'Property ID A'
                        }
                    }
                },
                {
                    type: 'object',
                    title: 'Select B',
                    required: ['id', 'one'],
                    properties: {
                        id: { type: 'string', const: 'B', options: { hidden: true } },
                        one: {
                            type: 'string',
                            minLength: 2,
                            title: 'Property ID B'
                        }
                    }
                }
            ]
        } as JsonSchema
    }
};

export const AllOf: Story = {
    args: {
        theme: 'light',
        validate: true,
        data: { title: 'five!' },
        schema: {
            type: 'object',
            options: { title: false },
            required: ['title'],
            properties: {
                title: { type: 'string' }
            },
            allOf: [
                {
                    properties: {
                        title: { minLength: 1 }
                    }
                },
                {
                    properties: {
                        title: {
                            default: 'title',
                            minLength: 6
                        }
                    }
                }
            ]
        } as JsonSchema
    }
};

export const AllOfIfThen: Story = {
    args: {
        theme: 'light',
        validate: true,
        liveUpdate: true,
        schema: {
            type: 'object',
            options: { title: false },
            properties: {
                title: { type: 'string', default: 'four' }
            },
            allOf: [
                {
                    if: {
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: {
                                minLength: 4
                            }
                        }
                    },
                    then: {
                        properties: {
                            title: {
                                pattern: '^[0-9]+$',
                                patternExample: 'a string with a length of 4+ should contain only numbers'
                            }
                        }
                    }
                }
            ]
        } as JsonSchema
    }
};

export const DependenciesList: Story = {
    args: {
        theme: 'light',
        schema: {
            title: 'dependencies: { prop: ["prop"] }',
            type: 'object',
            properties: {
                one: { title: 'Property One', type: 'string' },
                two: { title: 'dependency', type: 'string' }
            },
            dependencies: {
                one: ['two']
            },
            options: { title: false }
        } as JsonSchema
    }
};

export const DependenciesListActive: Story = {
    args: {
        theme: 'light',
        data: { one: 'input value' },
        addOptionalProps: false,
        schema: {
            title: 'dependencies: { prop: ["prop"] }',
            type: 'object',
            required: ['one'],
            properties: {
                one: { title: 'Property One', type: 'string' },
                two: { title: 'dependency', type: 'string' }
            },
            dependencies: {
                one: ['two']
            },
            options: { title: false }
        } as JsonSchema
    }
};

export const Dependencies: Story = {
    args: {
        theme: 'light',
        addOptionalProps: false,
        schema: {
            title: 'dependencies: { prop: { schema } }',
            type: 'object',
            properties: {
                one: { title: 'Property One', type: 'string' }
            },
            dependencies: {
                one: {
                    required: ['two'],
                    properties: {
                        two: { title: 'dependency', type: 'string' }
                    }
                }
            },
            options: { title: false }
        } as JsonSchema
    }
};

export const DependenciesActive: Story = {
    args: {
        theme: 'light',
        addOptionalProps: false,
        schema: {
            title: 'dependencies: { prop: { schema } }',
            type: 'object',
            required: ['one'],
            properties: {
                one: { title: 'Property One', type: 'string' }
            },
            dependencies: {
                one: {
                    required: ['two'],
                    properties: {
                        two: { title: 'dependency', type: 'string' }
                    }
                }
            },
            options: { title: false }
        } as JsonSchema
    }
};

export const IfThenElse: Story = {
    args: {
        theme: 'light',
        addOptionalProps: false,
        schema: {
            type: 'object',
            required: ['trigger'],
            properties: {
                trigger: { title: 'Trigger', type: 'boolean', default: false }
            },
            if: {
                required: ['trigger'],
                properties: {
                    trigger: { const: true }
                }
            },
            then: {
                properties: {
                    addition: { type: 'string' }
                }
            },
            options: { title: false }
        } as JsonSchema
    }
};

export const IfThenElseActive: Story = {
    args: {
        theme: 'light',
        addOptionalProps: false,
        schema: {
            type: 'object',
            required: ['trigger'],
            properties: {
                trigger: { title: 'Trigger', type: 'boolean', default: false }
            },
            if: {
                required: ['trigger'],
                properties: {
                    trigger: { const: true }
                }
            },
            then: {
                required: ['addition'],
                properties: {
                    addition: { type: 'string' }
                }
            },
            options: { title: false }
        } as JsonSchema
    }
};

export const IfThenElseSwitch: Story = {
    args: {
        theme: 'light',
        addOptionalProps: false,
        validate: true,
        schema: {
            type: 'object',
            required: ['switch'],
            additionalProperties: false,
            properties: {
                switch: { title: 'Switch', type: 'boolean', default: false }
            },
            if: {
                required: ['switch'],
                properties: {
                    switch: { const: false }
                }
            },
            then: {
                required: ['then', 'number'],
                properties: {
                    then: { title: 'Then statement', type: 'string' },
                    number: { title: 'Value in Then', type: 'number', minimum: 4 }
                }
            },
            else: {
                required: ['else', 'number'],
                properties: {
                    else: { title: 'Else statement', type: 'string', enum: ['option a', 'option b'] },
                    number: { title: 'Value in Else', type: 'number', maximum: 4 }
                }
            },
            options: { title: false }
        } as unknown as JsonSchema
    }
};
