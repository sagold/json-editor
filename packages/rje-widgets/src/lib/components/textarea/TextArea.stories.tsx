import { ComponentStory } from '@storybook/react';
import { TextArea } from './TextArea';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: TextArea,
    title: 'packages/rje-widgets/components/TextArea'
};

const Template: ComponentStory<typeof TextArea> = ({ ...options }) => {
    return <TextArea {...options} />;
};

export const Default = Template.bind({});
Default.args = {
    emitOnChange: false,
    disabled: false,
    defaultValue: 'Suchbegriff',
    title: 'Input as String',
    onPress: (value) => console.log('value', value)
};

export const Placeholder = Template.bind({});
Placeholder.args = {
    emitOnChange: false,
    disabled: false,
    placeholder: 'Placeholder',
    title: 'A required input',
    required: true,
    onPress: (value) => console.log('value', value)
};

export const Error = Template.bind({});
Error.args = {
    emitOnChange: false,
    disabled: false,
    error: true,
    defaultValue: 'Suchbegriff',
    title: 'Input with Error',
    onPress: (value) => console.log('value', value)
};
