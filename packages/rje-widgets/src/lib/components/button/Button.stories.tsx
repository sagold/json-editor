import { ComponentStory } from '@storybook/react';
import { Button } from './Button';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: Button,
    title: 'packages/rje-widgets/components/Button'
};

const Template: ComponentStory<typeof Button> = ({ children, ...options }) => {
    return (
        <>
            <Button {...options}>{children}</Button>
            <Button {...options} variant="secondary">
                {children}
            </Button>
            <Button {...options} variant="text">
                {children}
            </Button>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    children: 'Button Text',
    variant: 'primary',
    icon: null,
    disabled: false
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    children: 'Button Text',
    variant: 'primary',
    icon: 'search',
    disabled: false,
    iconPosition: 'left'
};

export const WithIconRight = Template.bind({});
WithIconRight.args = {
    children: 'Button Text',
    variant: 'primary',
    icon: 'search',
    disabled: false,
    iconPosition: 'right'
};

export const IconOnly = Template.bind({});
IconOnly.args = {
    variant: 'primary',
    icon: 'search',
    disabled: false,
    iconPosition: 'right'
};
