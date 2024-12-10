import { TagsInput } from '@mantine/core';
import { widget, WidgetPlugin, ArrayNode, DefaultNodeOptions, WidgetField, getData } from '@sagold/react-json-editor';
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';

export type TagListOptions = {
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
} & DefaultNodeOptions;

export const TagListWidget = widget<ArrayNode<TagListOptions>, string[]>(({ node, options, setValue }) => {
    return (
        <WidgetField widgetType="array" node={node} options={options} showError={false} showDescription={false}>
            <TagsInput
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
