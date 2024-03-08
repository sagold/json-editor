import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Theme, JsonForm, Button } from '@sagold/rje-widgets';
import { JsonEditor, errors } from '@sagold/react-json-editor';

type Story = StoryObj<typeof LoginStory>;
const meta: Meta<typeof LoginStory> = {
    title: 'Examples/Login',
    component: LoginStory
};
export default meta;

type FormData = {
    password: string;
    username: string;
    remember: boolean;
};

function LoginStory({ userData = { password: '', username: '', remember: false } }) {
    const [editor, setEditor] = useState<JsonEditor>();
    const [disabled, setDisabled] = useState<boolean>(true);

    return (
        <Theme>
            <div
                className="login"
                style={{ border: '1px solid #eee', borderRadius: '4px', background: '#fafafa', maxWidth: 480 }}
            >
                <div
                    className="login__header"
                    style={{
                        borderBottom: '1px solid #eee',
                        fontSize: '1.5em',
                        fontWeight: 600,
                        padding: '1rem ',
                        marginBottom: '0.5em'
                    }}
                >
                    Login
                </div>

                <JsonForm
                    editor={setEditor}
                    data={userData}
                    // @todo set type of onChange data via form?
                    onChange={(data: FormData) => {
                        const hasErrors = editor != null && errors(editor.getNode()).length > 1;
                        const requiredInput = data.password?.length > 0 && data.username?.length > 0;
                        setDisabled(hasErrors || !requiredInput);
                    }}
                    // @todo option to pass error
                    style={{ padding: '0.5rem 1rem 0 1rem' }}
                    schema={{
                        type: 'object',
                        required: ['username', 'password', 'remember'],
                        properties: {
                            username: {
                                title: 'Username',
                                type: 'string'
                            },
                            password: {
                                title: 'Password',
                                type: 'string',
                                format: 'password'
                            },
                            remember: {
                                title: 'Remember credentials',
                                type: 'boolean',
                                format: 'checkbox'
                            }
                        }
                    }}
                />

                <div className="login__footer" style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" disabled={disabled} onPress={() => console.log(editor?.getValue())}>
                        Login
                    </Button>
                </div>
            </div>
        </Theme>
    );
}

export const Login: Story = {};
