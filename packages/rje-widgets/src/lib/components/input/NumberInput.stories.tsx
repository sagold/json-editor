import { ComponentStory } from '@storybook/react';
import { NumberInput } from './NumberInput';
import theme from '../../theme';

export default {
    component: NumberInput,
    title: 'packages/rje-widgets/components/NumberInput'
};

const Template: ComponentStory<typeof NumberInput> = ({ ...options }) => {
    return (
        <div className="rje-form theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <NumberInput {...options} />
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <NumberInput {...options} />
                </div>
            </div>
        </div>
    );
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
