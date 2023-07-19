import { ComponentStory } from '@storybook/react';
import { ThemeDecorator } from '../ThemeDecorator';
import { RadioGroup } from './RadioGroup';

export default {
    decorators: [ThemeDecorator],
    component: RadioGroup,
    title: 'packages/rje-widgets/components/RadioGroup',
    args: {
        title: 'Favorite Pet',
        disabled: false,
        required: false,
        defaultValue: ''
    }
};

const Template: ComponentStory<typeof RadioGroup> = ({ ...options }) => {
    return (
        <RadioGroup {...options}>
            <RadioGroup.Radio value="dogs">Dogs</RadioGroup.Radio>
            <RadioGroup.Radio value="cats">Cats</RadioGroup.Radio>
        </RadioGroup>
    );
};

export const Default = Template.bind({});
Default.args = {};

export const Selected = Template.bind({});
Selected.args = {
    defaultValue: 'cats'
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true
};
