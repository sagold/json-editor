import { type Key } from 'react';
import { TagListInput } from '../../components/taglistinput/TagListInput';
import { widget, WidgetPlugin, ArrayNode, DefaultNodeOptions, getData } from '@sagold/react-json-editor';
import { WidgetField } from '../../components/widgetfield/WidgetField';
// import { TextArea } from '../../components/textarea/TextArea';
// import { useFocus } from 'react-aria';

type TagListWidgetItem = {
    /* unique identifier for a tag in browser session. Not part of data  */
    id: Key;
    /* actual value that will be stored in data */
    value: string;
    /* display value to user for value  */
    label?: string;
};

export type TagListOptions = DefaultNodeOptions<{
    values?: TagListWidgetItem[];
}>;

export const TagListWidget = widget<ArrayNode<TagListOptions>, string[]>(({ node, options, setValue }) => {
    const allowDuplicates = node.schema.uniqueItems === true;

    // actual list data
    const data = getData(node) as string[];

    // a) we can have labels for values
    // const labels = options.values ?? [];
    // ... const labeledItem = labels.find((l) => l.value === value);

    // convert current list to be compatible with multi-select-component
    const currentSelection: TagListWidgetItem[] = data.map((value) => {
        if (allowDuplicates) {
            return { id: value + Math.random(), value };
        } else {
            return { id: value, value };
        }
    });

    // build available select / autosuggest options
    const availableSelections = options.values?.map((o) => ({ ...o, id: o.value + Math.random() })) ?? [];

    return (
        <WidgetField widgetType="tag-list" node={node} options={options}>
            <TagListInput
                items={currentSelection}
                options={availableSelections.filter((a) => !currentSelection.find((b) => a.value === b.value))}
                // disabled={options.disabled || isValidConst}
                // placeholder={options.placeholder}
                // error={hasError}
                // readOnly={options.readOnly === true}
                // required={options.required === true}
                displayValue={(item) => item.label ?? item.value}
                onCreate={(id) => {
                    let item = availableSelections.find((l) => l.id === id);
                    if (!item) {
                        if (allowDuplicates) {
                            item = { id: id + Math.random(), value: id };
                        } else if (currentSelection.find((a) => a.value === id)) {
                            console.log('duplicate item', id, '-- abort');
                            return false;
                        } else {
                            item = { id, value: id };
                        }
                    }
                    console.log('create item', item);
                    setValue([...data, item.value]);
                    return item;
                }}
                onRemove={(items) => {
                    setValue(data.filter((item) => !items.has(item)));
                }}
                onChange={(items) => setValue(items.map((t) => t.value as string))}
                title={options.title}
            />
        </WidgetField>
    );
});

export const TagListWidgetPlugin: WidgetPlugin = {
    id: 'multi-select-widget',
    use: (node) =>
        // @ts-expect-error
        node.schema.type === 'array' && node.schema.items?.type === 'string' && node.schema.format === 'taglist',
    Widget: TagListWidget
};
