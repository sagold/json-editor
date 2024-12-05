import { TagsInput } from '@mantine/core';
import { widget, WidgetPlugin, ArrayNode, DefaultNodeOptions, WidgetField, getData } from '@sagold/react-json-editor';
import { Description } from '../components/Description';

export type TagListOptions = DefaultNodeOptions;

export const TagListWidget = widget<ArrayNode<TagListOptions>, string[]>(({ node, options, setValue }) => {
    return (
        <WidgetField widgetType="array" node={node} options={options} showError={false} showDescription={false}>
            <TagsInput
                id={node.id}
                description={<Description text={options.description} />}
                disabled={options.disabled}
                error={node.errors.map((e) => e.message).join('\n')}
                label={options.title}
                onChange={setValue}
                placeholder={options.placeholder}
                readOnly={options.readOnly}
                required={options.required}
                value={getData(node) as string[]}
                allowDuplicates={node.schema.uniqueItems !== true}
                maxTags={node.schema.maxItems}
                withAsterisk={options.required}
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
