import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeDecorator } from '../../components/ThemeDecorator';
import { ArrayNode, JsonSchema, useEditor } from '@sagold/react-json-editor';
import { TagListWidget, TagListWidgetOptions } from './TagListWidget';
import { widgets } from '../index';

type TagListWidgetProps = {
    data: string[];
    schema: JsonSchema;
} & TagListWidgetOptions;
function TagListWidgetStory({ data, schema, ...options }: TagListWidgetProps) {
    const [node, editor] = useEditor<string[], ArrayNode>({
        schema,
        widgets,
        data,
        validate: true,
        onChange(data) {
            console.log('editor value', data);
        }
    });
    return <TagListWidget node={node} editor={editor} options={options} />;
}
type Story = StoryObj<TagListWidgetProps>;
const meta: Meta<TagListWidgetProps> = {
    title: 'packages/rje-widgets/TagListWidget',
    decorators: [ThemeDecorator],
    component: TagListWidgetStory,
    argTypes: {
        // data: {
        //     control: { type: 'text' }
        // },
        // liveUpdate: {
        //     control: { type: 'boolean' }
        // },
        // disabled: {
        //     control: { type: 'boolean' }
        // },
        // readOnly: {
        //     control: { type: 'boolean' }
        // },
        // required: {
        //     control: { type: 'boolean' }
        // }
    }
};
export default meta;

export const Default: Story = {
    args: {
        data: ['Gray alder'],
        schema: {
            title: 'Multi-selection demo',
            type: 'array',
            format: 'taglist',
            options: {
                values: [
                    { value: 'Gray alder', label: '[label] Gray alder' },
                    { value: 'Tall ambrosia', label: '[label] Tall ambrosia' },
                    { value: 'Arrowwood', label: '[label] Arrowwood' },
                    { value: 'Baobab', label: '[label] Baobab' },
                    { value: 'Wild cherry', label: '[label] Wild cherry' },
                    { value: 'Columbine', label: '[label] Columbine' },
                    { value: 'Dogwood', label: '[label] Dogwood' },
                    { value: 'Foxglove', label: '[label] Foxglove' },
                    { value: 'Kittentail', label: "[label] Kittentail'" }
                ]
            },
            items: {
                type: 'string'
            }
        }
    }
};

// export const ErrorState: Story = {
//     args: {
//         data: 'some input string',
//         liveUpdate: true,
//         schema: {
//             type: 'array',
//             format: 'search',
//             items: {
//                 type: 'string'
//             }
//         }
//     }
// };
