import { ComponentStory } from '@storybook/react';
import { StringInput } from './StringInput';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: StringInput,
    title: 'packages/rje-widgets/components/StringInput',
    args: {
        type: {
            control: { type: 'select' },
            options: ['text', 'password']
        }
    }
};

const Template: ComponentStory<typeof StringInput> = ({ ...options }) => {
    return <StringInput {...options} />;
};

export const Default = Template.bind({});
Default.args = {
    emitOnChange: false,
    disabled: false,
    iconPosition: 'left',
    defaultValue: 'Firefox',
    icon: 'search',
    tag: 'Unit',
    title: 'Input as String',
    onPress: (value) => console.log('value', value)
};

export const Placeholder = Template.bind({});
Placeholder.args = {
    emitOnChange: false,
    disabled: false,
    iconPosition: 'left',
    placeholder: 'Placeholder',
    icon: 'search',
    tag: 'Unit',
    title: 'A required input',
    required: true,
    onPress: (value) => console.log('value', value)
};

export const Error = Template.bind({});
Error.args = {
    emitOnChange: false,
    disabled: false,
    iconPosition: 'left',
    error: true,
    defaultValue: 'Firefox',
    icon: 'search',
    tag: 'Unit',
    title: 'Input with Error',
    onPress: (value) => console.log('value', value)
};
