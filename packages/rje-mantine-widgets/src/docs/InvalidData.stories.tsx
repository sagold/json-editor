import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-mantine-widgets';
import { StoryObj } from '@storybook/react-webpack5';
import { MantineThemeDecorator } from './MantineThemeDecorator';

export default {
    title: 'packages/rje-mantine-widgets/examples/InvalidData',
    component: Form,
    decorators: [MantineThemeDecorator]
};

type Story = StoryObj<UseEditorOptions>;
function Form({ data, schema }: UseEditorOptions) {
    const editor = useEditor({ data, schema, widgets, plugins: [], onChange: console.log });
    if (editor == null) {
        return null;
    }
    const node = editor.getNode();
    const WidgetComponent = editor.getWidget(node);
    return <WidgetComponent node={node} editor={editor} />;
}

export const InvalidInputValueForObject: Story = {
    args: {
        validate: true,
        data: 99,
        schema: {
            title: 'object schema, but number as input',
            type: 'object',
            required: ['title'],
            properties: {
                title: {
                    type: 'string'
                }
            }
        }
    }
};

export const InvalidInputValueForArray: Story = {
    args: {
        validate: true,
        data: 99,
        schema: {
            $schema: 'draft-2020-12',
            title: 'array schema, but number as input',
            type: 'array',
            prefixItems: [{ type: 'string' }]
        }
    }
};

export const InvalidInputValueForArrayOfObjects: Story = {
    args: {
        validate: true,
        data: 99,
        schema: {
            $schema: 'draft-2020-12',
            title: 'array schema, but number as input',
            type: 'array',
            items: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: {
                        type: 'string'
                    }
                }
            }
        }
    }
};

export const InvalidInputObjectForString: Story = {
    args: {
        validate: true,
        data: { title: 'invalid input' },
        schema: {
            title: 'string schema, but object as input',
            type: 'string'
        }
    }
};

export const InvalidInputObjectForNumber: Story = {
    args: {
        validate: true,
        data: { title: 'invalid input' },
        schema: {
            title: 'number schema, but object as input',
            type: 'number'
        }
    }
};

export const InvalidInputArrayForString: Story = {
    args: {
        validate: true,
        data: ['invalid input'],
        schema: {
            title: 'string schema, but object as input',
            type: 'string'
        }
    }
};

export const InvalidInputArryForNumber: Story = {
    args: {
        validate: true,
        data: ['invalid input'],
        schema: {
            title: 'number schema, but object as input',
            type: 'number'
        }
    }
};

export const OneOfInvalidInputValueForObject: Story = {
    args: {
        validate: true,
        data: 99,
        schema: {
            title: 'oneOf object schema, but number as input',
            oneOf: [
                {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: {
                            type: 'string'
                        }
                    }
                }
            ]
        }
    }
};

export const OneOfInvalidInputObjectForValue: Story = {
    args: {
        validate: true,
        data: { title: 'invalid input' },
        schema: {
            title: 'oneOf object schema, but number as input',
            oneOf: [
                {
                    type: 'string'
                }
            ]
        }
    }
};

export const InvalidInputValueForArrayOneOfString: Story = {
    args: {
        validate: true,
        data: 99,
        schema: {
            title: 'array oneOf schema, but number as input',
            // type: 'array',
            items: {
                oneOf: [{ type: 'string' }]
            }
        }
    }
};

export const InvalidInputObjectForArrayOneOfString: Story = {
    args: {
        validate: true,
        data: { title: 'invalid input' },
        schema: {
            title: 'array oneOf schema, but object as input',
            // type: 'array',
            items: {
                oneOf: [{ type: 'string' }]
            }
        }
    }
};
