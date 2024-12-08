import { ComponentStory } from '@storybook/react';
import { Select } from './Select';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: Select,
    title: 'packages/rje-aria-widgets/components/Select'
};

const Template: ComponentStory<typeof Select> = ({ ...options }) => {
    return (
        <div style={{ height: 200 }}>
            <Select {...options} setValue={console.log}>
                {options.options.map((o) => (
                    <Select.Option key={o.key}>{o.label}</Select.Option>
                ))}
            </Select>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    defaultSelectedKey: 'inp',
    title: 'Label',
    options: [
        { key: 'inp', label: 'Input' },
        { key: 'app', label: 'Apple' },
        { key: 'ban', label: 'Banana' },
        { key: 'ora', label: 'Orange Cucumber' }
    ],
    onPress: (value) => console.log('value', value)
};

export const Placeholder = Template.bind({});
Placeholder.args = {
    disabled: false,
    placeholder: 'Placeholder',
    required: true,
    loading: false,
    title: 'A required select',
    options: [
        { key: 'app', label: 'Apple' },
        { key: 'ban', label: 'Banana' },
        { key: 'pau', label: 'Pink Cucumber Apple Banana' },
        { key: 'ora', label: 'Orange' }
    ],
    onPress: (value) => console.log('value', value)
};

export const Error = Template.bind({});
Error.args = {
    defaultSelectedKey: 'inp',
    title: 'Label',
    error: true,
    options: [
        { key: 'inp', label: 'Input' },
        { key: 'app', label: 'Apple' },
        { key: 'ban', label: 'Banana' },
        { key: 'ora', label: 'Orange Cucumber' }
    ],
    onPress: (value) => console.log('value', value)
};

export const Disabled = Template.bind({});
Disabled.args = {
    defaultSelectedKey: 'inp',
    title: 'Label',
    disabled: true,
    options: [
        { key: 'inp', label: 'Input' },
        { key: 'app', label: 'Apple' },
        { key: 'ban', label: 'Banana' },
        { key: 'ora', label: 'Orange Cucumber' }
    ],
    onPress: (value) => console.log('value', value)
};
