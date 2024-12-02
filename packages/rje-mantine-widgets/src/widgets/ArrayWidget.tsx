import { widget, WidgetPlugin, ArrayNode, DefaultNodeOptions, Widget, WidgetField } from '@sagold/react-json-editor';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

export type ArrayOptions = DefaultNodeOptions<{
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    // sortable?: SortableOptions;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        enabled?: boolean;
        // modalSize?: WidgetModalSize;
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
    /** Is set internally to true to add a delete option for this object. */
    isOptional?: boolean;
    /** set to true to show inline button at the end of the array to add another item */
    inlineAddItemOption?: boolean;
    /** if true will add a separator line to the header */
    headerSeparator?: boolean;
    /** header font size relative to 1 (em). Defaults to 1 */
    headerFontSize?: number;
    /** set to false to deactivate any array-controls */
    controls?: boolean;
    /** set to true to inline description */
    descriptionInline?: boolean;
}>;

export const ArrayWidget = widget<ArrayNode<ArrayOptions>>(({ editor, node, options }) => {
    const childOptions = {};
    return (
        <WidgetField widgetType="object" node={node} options={options} showError={false} showDescription={false}>
            <WidgetField.Header>{options.title}</WidgetField.Header>
            <WidgetField.Description enabled={options.descriptionInline === true}>
                {options.description}
            </WidgetField.Description>
            <WidgetField.Error errors={node.errors} />

            <div className="rje-array__items">
                {node.children.map((child) => (
                    <div key={child.id} className="rje-array__item">
                        <Widget
                            key={child.id}
                            node={child}
                            editor={editor}
                            options={{
                                ...childOptions
                            }}
                        />
                    </div>
                ))}
            </div>
        </WidgetField>
    );
});

export const ArrayWidgetPlugin: WidgetPlugin<ArrayNode> = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array',
    Widget: ArrayWidget
};
