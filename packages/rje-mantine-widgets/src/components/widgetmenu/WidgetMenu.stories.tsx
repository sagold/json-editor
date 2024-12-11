import { StoryObj } from '@storybook/react';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';
import { WidgetMenu, WidgetMenuProps } from './WidgetMenu';

type Story = StoryObj<WidgetMenuProps>;
export default {
    title: 'packages/rje-mantine-widgets/components/WidgetMenu',
    component: WidgetMenu,
    decorators: [MantineThemeDecorator]
};

export const Default: Story = {
    args: {
        icon: 'menu',
        items: [
            {
                icon: 'pin',
                label: 'console log',
                onClick: console.log
            },
            {
                icon: 'error',
                label: 'console error',
                onClick: console.error
            },
            '-',
            'Array Item Options',
            {
                icon: 'add',
                label: 'add item',
                onClick: console.log
            },
            {
                icon: 'delete',
                color: 'red',
                disabled: true,
                label: 'delete item',
                onClick: console.error
            }
        ]
    }
};

export const AllItemsDisabled: Story = {
    args: {
        icon: 'menu',
        items: [
            {
                icon: 'pin',
                label: 'console log',
                disabled: true,
                onClick: console.log
            },
            {
                icon: 'error',
                label: 'console error',
                disabled: true,
                onClick: console.error
            }
        ]
    }
};
