import { ComponentStory } from '@storybook/react';
import { defaultEditors, useJsonEditor } from '../../../index';
import { NavigationEditor } from './NavigationEditor';
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
    title: 'Editor/NavigationEditor',
    component: NavigationEditor,
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
        editors: defaultEditors,
        plugins: [RemoteEnumOptionsPlugin],
        data
    });
    if (node == null) {
        return <></>;
    }
    // @ts-ignore
    window['node'] = node;

    return (
        <div style={{ width: '400px' }}>
            <NavigationEditor
                node={node}
                instance={instance}
                // options={{ withChildren: true }}
            />
        </div>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = Template.bind({ data, schema });
