import { ComponentStory } from '@storybook/react';
import { MultiSelectOptions, Item } from './SelectOptions';
import theme from '../../theme';

export default {
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
        <div className="rje-form theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <MultiSelectOptions {...options}>
                        {options.children.map((value) => (
                            <Item key={value}>{value}</Item>
                        ))}
                    </MultiSelectOptions>
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <MultiSelectOptions {...options}>
                        {options.children.map((value) => (
                            <Item key={value}>{value}</Item>
                        ))}
                    </MultiSelectOptions>
                </div>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    label: '',
    children: ['apple', 'orange', 'kiwi', 'mango', 'raspberry'],
    onPress: (value) => console.log('value', value)
};
