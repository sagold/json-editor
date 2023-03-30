import { ComponentStory } from '@storybook/react';
import { SingleSelectOptions, Item } from './SelectOptions';
import theme from '../../theme';

export default {
    component: SingleSelectOptions,
    title: 'packages/rje-widgets/components/options/SingleSelectOptions',
    args: {
        label: {
            control: 'text'
        }
    }
};

const Template: ComponentStory<typeof SingleSelectOptions> = ({ ...options }) => {
    return (
        <div className="rje-form theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <SingleSelectOptions {...options}>
                        {options.children.map((value) => (
                            <Item key={value}>{value}</Item>
                        ))}
                    </SingleSelectOptions>
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <SingleSelectOptions {...options}>
                        {options.children.map((value) => (
                            <Item key={value}>{value}</Item>
                        ))}
                    </SingleSelectOptions>
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
