import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
    title: 'docs/components/header',
    component: (props) => <Header {...props} />
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
    args: {
        yellow: <Header.Title label="react-json-editor" />,
        orange: <Header.Title>@sagold/rje-mantine-widgets</Header.Title>
    }
};

export const HeadlessJsonEditor: Story = {
    args: {
        green: <Header.Title>headless-json-editor</Header.Title>
    }
};

export const ReactJsonEditor: Story = {
    args: {
        yellow: <Header.Title label="@sagold">react-json-editor</Header.Title>
    }
};

export const RjeMantineWidgets: Story = {
    args: {
        yellow: <Header.Title label="react-json-editor" />,
        orange: <Header.Title>@sagold/rje-mantine-widgets</Header.Title>
    }
};

export const RjeCodeWidgets: Story = {
    args: {
        yellow: <Header.Title label="react-json-editor" />,
        orange: <Header.Title>@sagold/rje-code-widgets</Header.Title>
    }
};
