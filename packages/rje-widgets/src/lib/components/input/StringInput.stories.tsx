import { ComponentStory } from '@storybook/react';
import { StringInput } from './StringInput';
import theme from '../../theme';

export default {
    component: StringInput,
    title: 'packages/rje-widgets/components/StringInput'
};

const Template: ComponentStory<typeof StringInput> = ({ ...options }) => {
    return (
        <div className="rje-form theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <StringInput {...options} />
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <StringInput {...options} />
                </div>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    emitOnChange: false,
    disabled: false,
    iconPosition: 'left',
    defaultValue: 'Suchbegriff',
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
    defaultValue: 'Suchbegriff',
    icon: 'search',
    tag: 'Unit',
    title: 'Input with Error',
    onPress: (value) => console.log('value', value)
};
