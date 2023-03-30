import { ComponentStory } from '@storybook/react';
import { Checkbox } from './Checkbox';
import theme from '../../theme';

export default {
    component: Checkbox,
    title: 'packages/rje-widgets/components/Checkbox'
};

const Template: ComponentStory<typeof Checkbox> = ({ children, ...options }) => {
    return (
        <div className="theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <Checkbox {...options} defaultSelected={false} />
                    <Checkbox {...options} defaultSelected={true} />
                    <Checkbox {...options}>todo</Checkbox>
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <Checkbox {...options} defaultSelected={false} />
                    <Checkbox {...options} defaultSelected={true} />
                    <Checkbox {...options}>todo</Checkbox>
                </div>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    'aria-label': 'todo'
    // children: 'Button Text',
    // variant: 'primary',
    // icon: null,
    // disabled: false,
    // iconPosition: 'left'
};

// export const WithIcon = Template.bind({});
// WithIcon.args = {
//     children: 'Button Text',
//     variant: 'primary',
//     icon: 'search',
//     disabled: false,
//     iconPosition: 'left'
// };

// export const WithIconRight = Template.bind({});
// WithIconRight.args = {
//     children: 'Button Text',
//     variant: 'primary',
//     icon: 'search',
//     disabled: false,
//     iconPosition: 'right'
// };

// export const IconOnly = Template.bind({});
// IconOnly.args = {
//     variant: 'primary',
//     icon: 'search',
//     disabled: false,
//     iconPosition: 'right'
// };
