import { ComponentStory } from '@storybook/react';
import { MultiSelectOptions, Item } from './SelectOptions';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: MultiSelectOptions,
    title: 'packages/rje-widgets/components/options/MultiSelectOptions',
    args: {
        label: {
            control: 'text'
        }
    }
};

const Template: ComponentStory<typeof MultiSelectOptions> = ({ ...options }) => {
    return (
        <MultiSelectOptions {...options}>
            {options.children.map((value) => (
                <Item key={value}>{value}</Item>
            ))}
        </MultiSelectOptions>
    );
};

export const Default = Template.bind({});
Default.args = {
    label: '',
    children: ['apple', 'orange', 'kiwi', 'mango', 'raspberry'],
    onPress: (value) => console.log('value', value)
};
