import { ComponentStory } from '@storybook/react';
import { FileField } from './FileField';
import theme from '../../theme';

export default {
    component: FileField,
    title: 'packages/rje-widgets/components/FileField'
};

const Template: ComponentStory<typeof FileField> = ({ ...options }) => {
    return (
        <div className="rje-form theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <FileField {...options} />
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <FileField {...options} />
                </div>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {};
