import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@mantine/core';
import { Editor, getErrors } from '@sagold/react-json-editor';
import { JsonForm } from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';
import { useState } from 'react';

type Story = StoryObj<typeof LoginStory>;
const meta: Meta<typeof LoginStory> = {
    title: 'Cookbook/Login',
    component: LoginStory,
    decorators: [MantineThemeDecorator]
};
export default meta;

type FormData = {
    password: string;
    username: string;
    remember: boolean;
};

function LoginStory({ userData = { password: '', username: '', remember: false } }: { userData?: FormData }) {
    const [editor, setEditor] = useState<Editor>();
    const [disabled, setDisabled] = useState<boolean>(true);

    return (
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
                    const hasErrors = editor != null && getErrors(editor.getNode()).length > 1;
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
                <Button variant="primary" disabled={disabled} onClick={() => console.log(editor?.getData())}>
                    Login
                </Button>
            </div>
        </div>
    );
}

export const Login: Story = {};
