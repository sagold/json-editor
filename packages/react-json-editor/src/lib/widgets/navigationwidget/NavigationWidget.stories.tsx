import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { NavigationWidget } from './NavigationWidget';
import { RemoteEnumOptionsPlugin, ParentNode } from 'headless-json-editor';

const schema = {
    type: 'object',
    properties: {
        title: {
            title: 'Title',
            type: 'string'
        },
        contents: {
            title: 'Contents',
            type: 'array',
            options: {
                sortable: {
                    enabled: true
                }
            },
            items: {
                title: 'content item',
                type: 'string'
            }
        },
        details: {
            title: 'Details',
            type: 'object',
            properties: {
                editor: {
                    type: 'string'
                }
            }
        }
    }
};

const data = {
    title: 'content title',
    contents: ['1', 'four'],
    details: {
        editor: 'asdasd'
    }
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'packages/rje-widgets/NavigationWidget',
    component: NavigationWidget,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema, options }) => {
    console.log('COMP', options);
    const [node, editor] = useJsonEditor<ParentNode>({
        schema,
        widgets: defaultWidgets,
        plugins: [RemoteEnumOptionsPlugin],
        data,
        validate: true
    });
    return (
        <div style={{ width: '400px' }}>
            <NavigationWidget node={node} editor={editor} options={options} />
        </div>
    );
};

export const Default = Template.bind({ data, schema });

export const ShowProperties = Template.bind({});
ShowProperties.args = {
    options: {
        showProperties: true
    }
};
