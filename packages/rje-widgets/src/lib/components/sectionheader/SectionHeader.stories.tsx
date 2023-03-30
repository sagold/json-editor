import { ComponentStory } from '@storybook/react';
import { SectionHeader } from './SectionHeader';
import theme from '../../theme';

export default {
    component: SectionHeader.Label,
    title: 'packages/rje-widgets/components/SectionHeader'
};

const Template: ComponentStory<typeof SectionHeader.Label> = ({ ...options }) => {
    return (
        <div className="rje-form theme" style={theme}>
            <div className="rje-theme--light">
                <div className="story-columns">
                    <SectionHeader>
                        <SectionHeader.Label {...options} />
                    </SectionHeader>
                </div>
            </div>
            <div className="rje-theme--dark">
                <div className="story-columns">
                    <SectionHeader>
                        <SectionHeader.Label {...options} />
                    </SectionHeader>
                </div>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: 'Addon investment details',
    separator: true,
    description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
};

export const Disabled = Template.bind({});
Disabled.args = {
    title: 'Addon investment details',
    separator: true,
    disabled: true,
    description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
};
