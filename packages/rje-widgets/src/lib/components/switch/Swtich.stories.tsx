import { ComponentStory } from '@storybook/react';
import { Switch } from './Switch';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: Switch,
    title: 'packages/rje-widgets/components/Switch'
};

const Template: ComponentStory<typeof Switch> = ({ children, ...options }) => {
    return (
        <>
            <Switch {...options} defaultSelected={false} />
            <Switch {...options} defaultSelected={true} />
            <Switch {...options}>todo</Switch>
        </>
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
