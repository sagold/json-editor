import type { Meta, StoryObj } from '@storybook/react-vite';
import { JsonForm } from '@sagold/rje-mantine-widgets';
import { JsonSchema } from 'headless-json-editor';
import { MantineThemeDecorator } from './decorators/MantineThemeDecorator';
import deepmerge from 'deepmerge';

const meta: Meta<typeof JsonForm> = {
    title: 'docs/ObjectProperties',
    component: JsonForm,
    decorators: [MantineThemeDecorator]
};
export default meta;
type Story = StoryObj<typeof JsonForm>;

export const OptionalProperties: Story = {
    args: {
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
            options: { showHeaderMenu: false },
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};

export const OptionalPropertiesDraft2019: Story = {
    play: OptionalProperties.play,
    args: {
        schema: deepmerge(OptionalProperties.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const InitialOptionalProperty: Story = {
    args: {
        data: { optionalProperty: 'input data' },
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
            options: { showHeaderMenu: false },
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};

export const InitialOptionalPropertyDraft2019: Story = {
    play: InitialOptionalProperty.play,
    args: {
        data: { optionalProperty: 'input data' },
        schema: deepmerge(InitialOptionalProperty.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const AddOptionalProps: Story = {
    args: {
        addOptionalProps: true,
        schema: {
            $schema: 'draft-2020-12',
            title: 'addOptionalProps: true',
            type: 'object',
            options: { showHeaderMenu: false },
            properties: {
                optionalProperty: { title: 'Optional property', type: 'string' }
            }
        }
    }
};

export const AddOptionalPropsDraft2019: Story = {
    play: AddOptionalProps.play,
    args: {
        addOptionalProps: true,
        schema: deepmerge(AddOptionalProps.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const RequiredProperties: Story = {
    args: {
        schema: {
            $schema: 'draft-2020-12',
            title: 'required: [ property ]',
            type: 'object',
            required: ['requiredProperty'],
            options: { showHeaderMenu: false },
            properties: {
                requiredProperty: { title: 'Required Property', type: 'string' },
                optionalProperty: { title: 'Optional Property', type: 'string' }
            }
        }
    }
};

export const RequiredPropertiesDraft2019: Story = {
    play: RequiredProperties.play,
    args: {
        schema: deepmerge(RequiredProperties.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const AdditionalProperties: Story = {
    args: {
        data: { additionalProperty: 'property without schema' },
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
            options: { showHeaderMenu: false }
        }
    }
};

export const AdditionalPropertiesDraft2019: Story = {
    play: AdditionalProperties.play,
    args: {
        data: { additionalProperty: 'property without schema' },
        schema: deepmerge(AdditionalProperties.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const AdditionalPropertiesFalse: Story = {
    args: {
        data: { additionalProperty: 'property without schema' },
        schema: {
            $schema: 'draft-2020-12',
            title: 'additionalProperties: false',
            options: { showEditJsonAction: true },
            type: 'object',
            additionalProperties: false
        } as JsonSchema
    }
};

export const AdditionalPropertiesFalseDraft2019: Story = {
    play: AdditionalPropertiesFalse.play,
    args: {
        data: { additionalProperty: 'property without schema' },
        schema: deepmerge(AdditionalPropertiesFalse.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const AdditionalPropertiesSchema: Story = {
    args: {
        validate: true,
        data: { additionalProperty: 'property without schema' },
        schema: {
            $schema: 'draft-2020-12',
            title: 'additionalProperties: { maxLength }',
            options: { showHeaderMenu: false },
            type: 'object',
            additionalProperties: {
                type: 'string',
                maxLength: 10
            }
        }
    }
};

export const AdditionalPropertiesSchemaDraft2019: Story = {
    play: AdditionalPropertiesSchema.play,
    args: {
        validate: true,
        data: { additionalProperty: 'property without schema' },
        schema: deepmerge(AdditionalPropertiesSchema.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const EditJson: Story = {
    args: {
        data: { additionalProperty: 'property without schema' },
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
            options: { showEditJsonAction: true },
            title: 'options: { showEditJsonAction: true }',
            description:
                'Using an object with a title will switch actions for optional properties to be placed in the actions-icon besides its title. Inline delete options are moved into their panel for a cleaner ui. Using EditJson action from the actions panel will allow the user to add additional data in json format.',
            additionalProperties: {
                type: 'string'
            }
        }
    }
};

export const EditJsonDraft2019: Story = {
    play: EditJson.play,
    args: {
        data: { additionalProperty: 'property without schema' },
        schema: deepmerge(EditJson.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const OneOfObject: Story = {
    args: {
        schema: {
            $schema: 'draft-2020-12',
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

export const OneOfObjectDraft2019: Story = {
    play: OneOfObject.play,
    args: {
        schema: deepmerge(OneOfObject.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const InvalidOneOfObject: Story = {
    args: {
        data: { one: 'input data' },
        schema: {
            $schema: 'draft-2020-12',
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

export const InvalidOneOfObjectDraft2019: Story = {
    play: InvalidOneOfObject.play,
    args: {
        data: { one: 'input data' },
        schema: deepmerge(InvalidOneOfObject.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const TypedOneOfObject: Story = {
    args: {
        schema: {
            $schema: 'draft-2020-12',
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

export const TypedOneOfObjectDraft2019: Story = {
    play: TypedOneOfObject.play,
    args: {
        data: { one: 'input data' },
        schema: deepmerge(TypedOneOfObject.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const OneOfProperty: Story = {
    args: {
        data: { id: 'B', one: 'B' },
        schema: {
            $schema: 'draft-2020-12',
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

export const OneOfPropertyDraft2019: Story = {
    play: OneOfProperty.play,
    args: {
        data: { id: 'B', one: 'B' },
        schema: deepmerge(OneOfProperty.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const AllOf: Story = {
    args: {
        validate: true,
        liveUpdate: true,
        data: { title: 'five!' },
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
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
        } as unknown as JsonSchema
    }
};

export const AllOfDraft2019: Story = {
    play: AllOf.play,
    args: {
        validate: true,
        liveUpdate: true,
        data: { title: 'five!' },
        schema: deepmerge(AllOf.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const AllOfIfThen: Story = {
    args: {
        validate: true,
        liveUpdate: true,
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
            options: { showHeaderMenu: false },
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

export const AllOfIfThenDraft2019: Story = {
    play: AllOfIfThen.play,
    args: {
        validate: true,
        liveUpdate: true,
        schema: deepmerge(AllOfIfThen.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const DependenciesList: Story = {
    args: {
        schema: {
            $schema: 'draft-2020-12',
            title: 'dependentRequired: { prop: ["prop"] }',
            type: 'object',
            properties: {
                one: { title: 'Property One', type: 'string' },
                two: { title: 'dependency', type: 'string' }
            },
            dependentRequired: {
                one: ['two']
            },
            options: { showHeaderMenu: false }
        }
    }
};

export const DependenciesListDraft2019: Story = {
    play: DependenciesList.play,
    args: {
        schema: {
            $schema: 'draft-2019-09',
            title: 'dependencies: { prop: ["prop"] }',
            type: 'object',
            properties: {
                one: { title: 'Property One', type: 'string' },
                two: { title: 'dependency', type: 'string' }
            },
            dependencies: {
                one: ['two']
            },
            options: { showHeaderMenu: false }
        }
    }
};

export const DependenciesListActive: Story = {
    args: {
        data: { one: 'input value' },
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2020-12',
            title: 'dependentRequired: { prop: ["prop"] }',
            type: 'object',
            required: ['one'],
            properties: {
                one: { title: 'Property One', type: 'string' },
                two: { title: 'dependency', type: 'string' }
            },
            dependentRequired: {
                one: ['two']
            }
        } as JsonSchema
    }
};

export const DependenciesListActiveDraft2019: Story = {
    args: {
        data: { one: 'input value' },
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2019-09',
            title: 'dependencies: { prop: ["prop"] }',
            type: 'object',
            required: ['one'],
            properties: {
                one: { title: 'Property One', type: 'string' },
                two: { title: 'dependency', type: 'string' }
            },
            dependencies: {
                one: ['two']
            }
        } as JsonSchema
    }
};

export const Dependencies: Story = {
    args: {
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2020-12',
            title: 'dependentSchemas: { prop: { schema } }',
            type: 'object',
            properties: {
                one: { title: 'Property One', type: 'string' }
            },
            dependentSchemas: {
                one: {
                    required: ['two'],
                    properties: {
                        two: { title: 'dependency', type: 'string' }
                    }
                }
            },
            options: { showHeaderMenu: false }
        }
    }
};

export const DependenciesDraft2019: Story = {
    args: {
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2019-09',
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
            options: { showHeaderMenu: false }
        } as JsonSchema
    }
};

export const DependenciesActive: Story = {
    args: {
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2020-12',
            title: 'dependentSchemas: { prop: { schema } }',
            type: 'object',
            required: ['one'],
            properties: {
                one: { title: 'Property One', type: 'string' }
            },
            dependentSchemas: {
                one: {
                    required: ['two'],
                    properties: {
                        two: { title: 'dependency', type: 'string' }
                    }
                }
            },
            options: { showHeaderMenu: false }
        } as JsonSchema
    }
};

export const DependenciesActiveDraft2019: Story = {
    args: {
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2019-09',
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
            options: { showHeaderMenu: false }
        } as JsonSchema
    }
};

export const IfThenElse: Story = {
    args: {
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
            required: ['trigger'],
            options: { showHeaderMenu: false },
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
            }
        } as JsonSchema
    }
};

export const IfThenElseDraft2019: Story = {
    play: IfThenElse.play,
    args: {
        addOptionalProps: false,
        schema: deepmerge(IfThenElse.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const IfThenElseActive: Story = {
    args: {
        addOptionalProps: false,
        schema: {
            $schema: 'draft-2020-12',
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
            options: { showHeaderMenu: false }
        } as JsonSchema
    }
};

export const IfThenElseActiveDraft2019: Story = {
    play: IfThenElseActive.play,
    args: {
        addOptionalProps: false,
        schema: deepmerge(IfThenElseActive.args!.schema!, { $schema: 'draft-2019-09' })
    }
};

export const IfThenElseSwitch: Story = {
    args: {
        addOptionalProps: false,
        validate: true,
        schema: {
            $schema: 'draft-2020-12',
            type: 'object',
            required: ['switch'],
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
                additionalProperties: false,
                required: ['then', 'number'],
                properties: {
                    switch: { type: 'boolean' },
                    then: { title: 'Then statement', type: 'string' },
                    number: { title: 'Value in Then', type: 'number', minimum: 4 }
                }
            },
            else: {
                additionalProperties: false,
                required: ['else', 'number'],
                properties: {
                    switch: { type: 'boolean' },
                    else: { title: 'Else statement', type: 'string', enum: ['option a', 'option b'] },
                    number: { title: 'Value in Else', type: 'number', maximum: 4 }
                }
            },
            options: { showHeaderMenu: false }
        } as unknown as JsonSchema
    }
};

export const IfThenElseSwitchDraft2019: Story = {
    play: IfThenElseSwitch.play,
    args: {
        addOptionalProps: false,
        validate: true,
        schema: deepmerge(IfThenElseSwitch.args!.schema!, { $schema: 'draft-2019-09' })
    }
};
