import { ActionIcon, Button, Flex, InputWrapper, Title, TitleProps } from '@mantine/core';
import {
    DefaultNodeOptions,
    ObjectNode,
    Widget,
    WidgetField,
    WidgetPlugin,
    Node,
    widget
} from '@sagold/react-json-editor';
import { Icon } from '../components/icon/Icon';
import { Description } from '../components/Description';

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

    /** Mantine Title Props */
    titleProps?: TitleProps;
}>;

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor }) => {
    const withInlineAdd = options.inlineAddPropertyOption ?? true;
    const withInlineDelete = options.inlineDeletePropertyOption ?? true;
    // const [showContent, setShowContent] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    // const showHeader = editJson.enabled || title || description || options.collapsed != null;
    // const withInlineDelete = options.inlineDeletePropertyOption ?? !showHeader;

    const childOptions = {
        disabled: options.disabled,
        readOnly: options.readOnly
    };
    const properties = node.children.map((child) => (
        <Flex key={child.id} className="rje-object__property" style={{ position: 'relative' }}>
            <Widget
                key={child.id}
                node={child}
                editor={editor}
                options={{
                    ...childOptions,
                    isOptional: node.optionalProperties.includes(child.property)
                }}
            />
            {withInlineDelete && editor.optionalProperties && node.optionalProperties.includes(child.property) && (
                <div
                    className="rje-object__actions"
                    style={
                        hasTitle(child)
                            ? {
                                  position: 'absolute',
                                  // mantine td padding:
                                  top: 'var(--table-vertical-spacing)',
                                  right: 0
                              }
                            : {}
                    }
                >
                    <ActionIcon variant="transparent" onClick={() => editor.removeValue(child.pointer)}>
                        <Icon>close</Icon>
                    </ActionIcon>
                </div>
            )}
        </Flex>
    ));

    const order = Math.min(node.pointer.split('/').length + 1, 6) as TitleOrder;

    return (
        <WidgetField widgetType="object" node={node} options={options} showError={false} showDescription={false}>
            <InputWrapper
                description={<Description text={options.description} />}
                label={
                    <Title style={{ flexGrow: 1 }} order={order} {...(options.titleProps ?? {})}>
                        {options.title}
                        {options.required && (
                            <sup className={styles['asterisk']} aria-hidden>
                                {' *'}
                            </sup>
                        )}
                    </Title>
                }
                error={node.errors.map((e) => e.message).join('\n')}
                withAsterisk={options.required}
            >
                <div className="rje-object__properties">{properties}</div>
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

function hasTitle(child: Node) {
    return (child.options.title?.length ?? 0) > 0;
}

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
