import type { Meta, StoryObj } from '@storybook/react-vite';
import widgets from '@sagold/rje-mantine-widgets';
import { useEditor, Widget } from '@sagold/react-json-editor';
import { MantineProvider } from '@mantine/core';

type MyData = {
    name?: string;
    pass?: string;
};

function GettingStarted() {
    const editor = useEditor<MyData>({
        widgets,
        schema: {
            title: 'Login',
            type: 'object',
            required: ['name', 'pass'],
            properties: {
                name: { type: 'string', options: { icon: 'person', swapIconPosition: true } },
                pass: { type: 'string', 'x-widget': 'password' }
            }
        },
        data: { name: 'user123' },
        onChange: console.log
    });

    return (
        <MantineProvider>
            <Widget editor={editor} node={editor?.getNode()} />
        </MantineProvider>
    );
}

const meta: Meta<typeof GettingStarted> = {
    title: 'docs/Introduction',
    component: GettingStarted
};
export default meta;
type Story = StoryObj<typeof GettingStarted>;
export const Login: Story = {};
