import { ComponentStory } from '@storybook/react';
import { JsonForm, JsonEditor } from '../../index';
import { useEffect, useRef, useState } from 'react';
import { errors } from 'headless-json-editor';

export default {
    title: 'JsonSchemaSupport',
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
            onChange={(data) => {}}
        />
    );
};

export const AllOfWithConditions = Template.bind({});
AllOfWithConditions.args = {
    data: {},
    schema: {
        type: 'object',
        title: 'allOf with multiple if-then-else statements',
        description:
            '**allOf** statement can combined multiple **if-then-else** statements. In this case, we want to add additional properties to the schema based on the presence of a specfic value. In case the schema is toggled, we do not want to lose its data in case the initial value is restored',
        properties: {
            addSchema: {
                title: 'add schema?',
                type: 'boolean',
                default: false
            }
        },
        allOf: [
            {
                if: {
                    properties: {
                        addSchema: {
                            type: 'boolean',
                            const: true
                        }
                    }
                },
                then: {
                    properties: {
                        additionalSchema: {
                            title: 'initial schema',
                            description: 'trigger next schema by adding some text',
                            type: 'string'
                        }
                    }
                }
            },
            {
                if: {
                    required: ['additionalSchema'],
                    properties: {
                        additionalSchema: {
                            type: 'string',
                            minLength: 1
                        }
                    }
                },
                then: {
                    properties: {
                        secondSchema: {
                            title: 'second schema, based on additionalSchema having at least 1 character',
                            type: 'string'
                        }
                    }
                }
            }
        ]
    }
};
