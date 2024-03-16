import {
    widget,
    WidgetPlugin,
    ArrayNode,
    DefaultNodeOptions,
    json
} from '@sagold/react-json-editor';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { TagList } from '../../components/taglist/TagList';

export type SelectMultipleWidgetOptions = {} & DefaultNodeOptions;

export const SelectMultipleWidget = widget<ArrayNode<SelectMultipleWidgetOptions>, (string | number)[]>(
    ({ node, options, setValue }) => {
        const hasError = node.errors.length > 0;
        const selectedKeys = json(node) as (string | number)[];
        // @ts-expect-error
        const enumValues = (node.schema.items.enum || []) as (string | number)[];
        const titles = (options.enum as string[]) ?? [];
        const items = enumValues.map((id) => ({ id, name: titles[id] ?? id }));

        return (
            <WidgetField widgetType="select-multiple" node={node} options={options}>
                <TagList
                    id={node.id}
                    title={options.title}
                    required={options.required}
                    error={hasError}
                    disabled={options.disabled}
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    items={items}
                    displayValue={(item) => item.name}
                    onSelectionChange={(selection) => {
                        const selectedValues = Array.from(selection) as (string | number)[];
                        // console.log('selectedValues', selectedValues);
                        setValue(selectedValues);
                    }}
                />
            </WidgetField>
        );
    }
);

export const SelectMultipleWidgetPlugin: WidgetPlugin = {
    id: 'select-multiple-widget',
    // @ts-expect-error
    use: (node) => node.schema.items?.type === 'string' && Array.isArray(node.schema.items?.enum),
    Widget: SelectMultipleWidget
};
