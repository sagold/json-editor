import { ActionIcon, Button, Flex, InputWrapper } from '@mantine/core';
import { DefaultNodeOptions, ObjectNode, Widget, WidgetField, WidgetPlugin, widget } from '@sagold/react-json-editor';
import { Icon } from '../components/icon/Icon';

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
    const withInlineAdd = options.inlineAddPropertyOption ?? true;
    const withInlineDelete = options.inlineDeletePropertyOption ?? true;
    // const [showContent, setShowContent] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    // const showHeader = editJson.enabled || title || description || options.collapsed != null;
    // const withInlineDelete = options.inlineDeletePropertyOption ?? !showHeader;

    const childOptions = {};
    return (
        <WidgetField widgetType="object" node={node} options={options} showError={false} showDescription={false}>
            <InputWrapper
                description={options.description}
                label={options.title}
                error={node.errors.map((e) => e.message).join('\n')}
            >
                <div className="rje-object__properties">
                    {node.children.map((child) => (
                        <Flex key={child.id} className="rje-object__property">
                            <Widget
                                key={child.id}
                                node={child}
                                editor={editor}
                                options={{
                                    ...childOptions,
                                    isOptional: node.optionalProperties.includes(child.property)
                                }}
                            />
                            {withInlineDelete &&
                                editor.optionalProperties &&
                                node.optionalProperties.includes(child.property) && (
                                    <div className="rje-object__actions">
                                        <ActionIcon
                                            variant="transparent"
                                            onClick={() => editor.removeValue(child.pointer)}
                                        >
                                            <Icon>close</Icon>
                                        </ActionIcon>
                                    </div>
                                )}
                        </Flex>
                    ))}
                </div>
            </InputWrapper>
            {withInlineAdd && node.missingProperties.length > 0 && (
                <>
                    <div className="rje-object__missing-properties" style={{ alignItems: 'center' }}>
                        {node.missingProperties.map((name) => (
                            <Button
                                key={name}
                                variant="subtle"
                                // color="gray"
                                leftSection={<Icon>add</Icon>}
                                onClick={() => editor.addValue(`${node.pointer}/${name}`)}
                            >
                                {name}
                            </Button>
                        ))}
                    </div>
                </>
            )}
        </WidgetField>
    );
});

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
