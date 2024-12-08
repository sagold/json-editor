import { ComponentStory } from '@storybook/react';
import { NumberInput } from './NumberInput';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: NumberInput,
    title: 'packages/rje-aria-widgets/components/NumberInput'
};

const Template: ComponentStory<typeof NumberInput> = ({ ...options }) => {
    return <NumberInput {...options} />;
};

export const Default = Template.bind({});
Default.args = {
    disabled: false,
    iconPosition: 'left',
    defaultValue: 14082,
    icon: 'search',
    tag: 'Unit',
    title: 'Input as Number',
    onPress: (value) => console.log('value', value)
};

export const Placeholder = Template.bind({});
Placeholder.args = {
    disabled: false,
    iconPosition: 'left',
    placeholder: 'Placeholder',
    icon: 'search',
    tag: 'Unit',
    required: true,
    title: 'A required input',
    onPress: (value) => console.log('value', value)
};

export const Error = Template.bind({});
Error.args = {
    disabled: false,
    iconPosition: 'left',
    error: true,
    value: 14082,
    icon: 'search',
    tag: 'Unit',
    title: 'Input with Error',
    onPress: (value) => console.log('value', value)
};

export const FormatSeparators = Template.bind({});
FormatSeparators.args = {
    disabled: false,
    iconPosition: 'left',
    format: {
        useGrouping: true
    },
    defaultValue: 14082.02,
    icon: 'search',
    tag: 'Unit',
    onPress: (value) => console.log('value', value)
};

export const FormatCurrency = Template.bind({});
FormatCurrency.args = {
    disabled: false,
    iconPosition: 'left',
    format: {
        style: 'currency',
        currency: 'EUR'
    },
    defaultValue: 14082.02,
    icon: 'search',
    tag: 'Unit',
    onPress: (value) => console.log('value', value)
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    disabled: false,
    readOnly: true,
    iconPosition: 'left',
    title: 'read only',
    format: {
        style: 'currency',
        currency: 'EUR'
    },
    defaultValue: 14082.02,
    icon: 'search',
    tag: 'Unit',
    onPress: (value) => console.log('value', value)
};
