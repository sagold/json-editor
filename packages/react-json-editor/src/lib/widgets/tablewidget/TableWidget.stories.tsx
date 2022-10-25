import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { TableWidget } from './TableWidget';
import { RemoteEnumOptionsPlugin } from 'headless-json-editor';
import '../../styles.scss';

export default {
    title: 'Widget/TableWidget',
    component: TableWidget,
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } }
    }
};

const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, editor] = useJsonEditor({
        schema,
        widgets: defaultWidgets,
        plugins: [RemoteEnumOptionsPlugin],
        data,
        validate: true
    });
    return (
        <div style={{ width: '400px' }}>
            <TableWidget node={node} editor={editor} />
        </div>
    );
};

export const List = Template.bind({});
List.args = {
    data: [
        { title: 'first value', value: 1 },
        { title: 'wrong value type', value: 'four' },
        { title: 'large number', value: 10009919291923 },
        { title: 'empty' }
    ],
    schema: {
        title: 'Contents',
        type: 'array',
        options: {
            sortable: {
                enabled: true
            }
        },
        items: {
            title: 'content item',
            type: 'object',
            options: {
                previewValue: 'title'
            },
            properties: {
                title: { type: 'string' },
                value: { type: 'number', minimum: 1 }
            }
        }
    }
};
