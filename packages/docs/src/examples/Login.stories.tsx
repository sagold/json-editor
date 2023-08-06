import type { Meta, StoryObj } from '@storybook/react';
import { Theme, JsonForm, Button } from '@sagold/rje-widgets';
import { JsonEditor, JsonSchema, errors } from '@sagold/react-json-editor';
import { useState } from 'react';

const meta: Meta<typeof JsonForm> = {
    title: 'Examples/Login',
    component: JsonForm
};

export default meta;
type Story = StoryObj<typeof JsonForm>;

export const Login = () => {
    const [editor, setEditor] = useState<JsonEditor | null>(null);
    const [disabled, setDisabled] = useState<boolean>(true);

    console.log('editor', editor);

    return (
        <Theme>
            <div
                className="login"
                style={{ border: '1px solid #eee', borderRadius: '4px', background: '#fafafa', maxWidth: 480 }}
            >
                <div
                    className="login__header"
                    style={{
                        borderBottom: '1px solid #ccc',
                        fontSize: '1.5em',
                        fontWeight: 600,
                        padding: '1rem ',
                        marginBottom: '0.5em'
                    }}
                >
                    Login
                </div>

                <JsonForm
                    ref={setEditor}
                    // @todo set type of onChange data via form?
                    onChange={(data: { username: string; password: string }) => {
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

                <div
                    className="login__footer"
                    style={{ padding: '1rem', fontSize: '1.1em', display: 'flex', justifyContent: 'flex-end' }}
                >
                    <Button disabled={disabled}>Login</Button>
                </div>
            </div>
        </Theme>
    );
};
