import { ComponentStory } from '@storybook/react';
import { errors } from 'headless-json-editor';
import { JsonForm, JsonEditor } from '@sagold/react-json-editor';
import { useEffect, useRef, useState } from 'react';

export default {
    title: 'Examples/JsonSchemaSupport',
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: {} },
        schema: { control: { type: 'object' }, defaultValue: { type: 'object' } }
    }
};

const Template: ComponentStory<any> = ({ data, schema }) => {
    const editor = useRef<JsonEditor>(null);
    const [editorData, setEditorData] = useState(data);
    return (
        <JsonForm
            ref={editor}
            data={editorData}
            schema={schema}
            validate={true}
            liveUpdate={true}
            onChange={(data) => {
                console.log(data);
            }}
        />
    );
};

export const AllOfWithConditions = Template.bind({});
AllOfWithConditions.args = {
    data: {},
    schema: {
        type: 'object',
        title: 'allOf with single if-then-else statements',
        description:
            'Goal: Optional form to be toggled by a valid schema. Optional form, store data even when hidden. Does not remove data when hidden, does not return errors when hidden. This setup is very specific and is no easy drop-in toggle, but tries to stay true to json-schema where possible (still, schema is merged which it should not). Follows test/features/toggleForm. !! The problem that remains is, that json-editor currently does not create nodes for missing schemas, thus it removes data unless the hidden property is structurely complete (properties are given)',
        required: ['trigger'],
        properties: {
            trigger: {
                title: 'show optional schema',
                type: 'boolean',
                default: false
            },
            optional: {
                options: { hidden: true, title: false },
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    }
                }
            },

            check: {
                type: 'null',
                title: 'test attribute - should come last in any case',
                description: 'mimimi'
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
                            title: 'Optional form',
                            options: { hidden: false },
                            required: ['title']
                        }
                    }
                }
            }
        ]
    }
};
