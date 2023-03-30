import { ComponentStory } from '@storybook/react';
import { Button } from './Button';
import theme from '../../theme';

export default {
    component: Button,
    title: 'packages/rje-widgets/components/Button'
};

const Template: ComponentStory<typeof Button> = ({ children, ...options }) => {
    return (
        <div className="theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <Button {...options}>{children}</Button>
                    <Button {...options} variant="secondary">
                        {children}
                    </Button>
                    <Button {...options} variant="text">
                        {children}
                    </Button>
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <Button {...options}>{children}</Button>
                    <Button {...options} variant="secondary">
                        {children}
                    </Button>
                    <Button {...options} variant="text">
                        {children}
                    </Button>
                </div>
            </div>
        </div>
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
