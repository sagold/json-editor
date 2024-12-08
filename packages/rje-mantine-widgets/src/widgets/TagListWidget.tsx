import { TagsInput } from '@mantine/core';
import { widget, WidgetPlugin, ArrayNode, DefaultNodeOptions, WidgetField, getData } from '@sagold/react-json-editor';
import { widgetInputProps } from '../components/widgetInputProps';

export type TagListOptions = DefaultNodeOptions;

export const TagListWidget = widget<ArrayNode<TagListOptions>, string[]>(({ node, options, setValue }) => {
    return (
        <WidgetField widgetType="array" node={node} options={options} showError={false} showDescription={false}>
            <TagsInput
                id={node.id}
                {...widgetInputProps(node, options)}
                onChange={setValue}
                value={getData(node) as string[]}
                allowDuplicates={node.schema.uniqueItems !== true}
                maxTags={node.schema.maxItems}
            />
        </WidgetField>
    );
});

export const TagListWidgetPlugin: WidgetPlugin<ArrayNode> = {
    id: 'taglist-widget',
    use: (node) =>
        // @ts-expect-error test json-schema
        node.schema.type === 'array' && node.schema.format === 'taglist' && node.schema.items?.type === 'string',
    Widget: TagListWidget
};
