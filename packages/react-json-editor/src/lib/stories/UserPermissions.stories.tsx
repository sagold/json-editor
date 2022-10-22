import { ComponentStory } from '@storybook/react';
import { JsonForm } from '../../index';
import { data, schema } from './data/layout';
// import '../styles.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example',
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    return <JsonForm data={data} schema={schema} />;
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const ObjectLayout = Template.bind({});
