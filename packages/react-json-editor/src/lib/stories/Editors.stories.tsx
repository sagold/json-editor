import { ComponentStory } from '@storybook/react';
import { JsonForm } from '../../index';
import { data, schema } from './data/features';
import '../styles.scss';

export default {
    title: 'Example',
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

const Template: ComponentStory<any> = ({ data, schema }) => {
    return <JsonForm data={data} schema={schema} />;
};

export const DefaultEditors = Template.bind({});
