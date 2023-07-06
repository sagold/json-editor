import { ComponentStory } from '@storybook/react';
import { FileField } from './FileField';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
    decorators: [ThemeDecorator],
    component: FileField,
    title: 'packages/rje-widgets/components/FileField'
};

const Template: ComponentStory<typeof FileField> = ({ ...options }) => {
    return <FileField {...options} />;
};

export const Default = Template.bind({});
Default.args = {};
