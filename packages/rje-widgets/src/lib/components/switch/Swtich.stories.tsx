import { ComponentStory } from '@storybook/react';
import { Switch } from './Switch';
import theme from '../../theme';

export default {
    component: Switch,
    title: 'packages/rje-widgets/components/Switch'
};

const Template: ComponentStory<typeof Switch> = ({ children, ...options }) => {
    return (
        <div className="theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <Switch {...options} defaultSelected={false} />
                    <Switch {...options} defaultSelected={true} />
                    <Switch {...options}>todo</Switch>
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <Switch {...options} defaultSelected={false} />
                    <Switch {...options} defaultSelected={true} />
                    <Switch {...options}>todo</Switch>
                </div>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    'aria-label': 'todo'
};

export const Disabled = Template.bind({});
Disabled.args = {
    'aria-label': 'todo',
    disabled: true,
    error: false
};

export const WithError = Template.bind({});
WithError.args = {
    'aria-label': 'todo',
    error: true
};
