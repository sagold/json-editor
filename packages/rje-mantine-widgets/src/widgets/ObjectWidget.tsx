import { DefaultNodeOptions, ObjectNode, Widget, WidgetField, WidgetPlugin, widget } from '@sagold/react-json-editor';

export type ObjectOptions = DefaultNodeOptions<{
    /** additional classnames for object editor */
    classNames?: string[];
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        enabled?: boolean;
        modalSize?: string;
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
    /** if true will add a separator line to the header */
    headerSeparator?: boolean;
    /** header font size relative to 1 (em). Defaults to 1 */
    headerFontSize?: number;
    descriptionInline?: boolean;
    /** Is set internally to true to add a delete option for this object. */
    isOptional?: boolean;
    /** set to true to show inline buttons at the end of the object to add optional missing properties */
    inlineAddPropertyOption?: boolean;
    /** set to true to show a delete button after each optional property */
    inlineDeletePropertyOption?: boolean;
    /* optional list of action components to add to object actions menu */
    menuActions?: React.ReactNode[];
}>;

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor }) => {
    // const [showContent, setShowContent] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const { title, description, editJson = {} /*, layout, header*/ } = options;
    // const showHeader = editJson.enabled || title || description || options.collapsed != null;
    // const withInlineDelete = options.inlineDeletePropertyOption ?? !showHeader;
    // const withInlineAdd = options.inlineAddPropertyOption ?? !showHeader;

    const childOptions = {};
    return (
        <WidgetField widgetType="object" node={node} options={options} showError={false} showDescription={false}>
            <WidgetField.Header>{title}</WidgetField.Header>
            <WidgetField.Description enabled={options.descriptionInline === true}>
                {description}
            </WidgetField.Description>
            <WidgetField.Error errors={node.errors} />

            <div className="rje-object__properties">
                {node.children.map((child) => (
                    <div key={child.id} className="rje-object__property">
                        <Widget
                            key={child.id}
                            node={child}
                            editor={editor}
                            options={{
                                ...childOptions,
                                isOptional: node.optionalProperties.includes(child.property)
                            }}
                        />
                    </div>
                ))}
            </div>
        </WidgetField>
    );
});

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};