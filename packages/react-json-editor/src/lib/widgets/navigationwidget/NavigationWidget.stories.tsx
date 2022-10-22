import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { NavigationWidget } from './NavigationWidget';
import { RemoteEnumOptionsPlugin } from 'headless-json-editor';
import '../../styles.scss';

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
    title: 'Widget/NavigationWidget',
    component: NavigationWidget,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, instance] = useJsonEditor({
        schema,
        widgets: defaultWidgets,
        plugins: [RemoteEnumOptionsPlugin],
        data,
        validate: true
    });
    return (
        <div style={{ width: '400px' }}>
            <NavigationWidget
                node={node}
                instance={instance}
                // options={{ withChildren: true }}
            />
        </div>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = Template.bind({ data, schema });
