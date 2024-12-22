import {
    ActionIcon,
    Button,
    Collapse,
    DividerProps,
    Flex,
    Group,
    Modal,
    Stack,
    TitleOrder,
    TitleProps
} from '@mantine/core';
import {
    DefaultNodeOptions,
    ObjectNode,
    Widget,
    WidgetField,
    WidgetPlugin,
    Node,
    widget,
    Editor
} from '@sagold/react-json-editor';
import { Icon } from '../../components/icon/Icon';
import { WidgetInputWrapper } from '../../components/widgetinputwrapper/WidgetInputWrapper';
import { useDisclosure } from '@mantine/hooks';
import { WidgetMenu, WidgetMenuItems } from '../../components/widgetmenu/WidgetMenu';
import { ArrayOptions } from '../arraywidget/ArrayWidget';
import { WidgetParentHeader } from '../../components/widgetheader/WidgetHeader';
import classNames from 'classnames';

export type ObjectOptions = DefaultNodeOptions<{
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    showEditJsonAction?: boolean;
    /** Is set internally to true to add a delete option for this object. */
    isOptional?: boolean;
    /** set to true to show inline button at the end of the array to add another item */
    showInlineAddAction?: boolean;
    /** set to false to deactivate array menu */
    showHeaderMenu?: boolean;
    /** set to false to deactivate any array item-controls */
    showItemControls?: boolean;
    /** set to true to inline description */
    descriptionInline?: boolean;
    /** if true will add a separator line to the header */
    showTitleDivider?: boolean;
    /** placement of title within the separator */
    dividerProps?: Pick<DividerProps, 'labelPosition' | 'color'>;
    /** Mantine Title Props */
    titleProps?: TitleProps;

    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
}>;

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor }) => {
    const [isJsonModalOpen, jsonModal] = useDisclosure(false);
    const depth = Math.min(6, node.pointer.split('/').length);
    const order = options.titleProps?.order ?? ((depth === 1 ? 1 : 2) as TitleOrder);
    const childOptions = {
        titleProps: {
            order: Math.min(6, order + 1)
        },
        disabled: options.disabled,
        readOnly: options.readOnly
    };

    const [contentOpened, contentToggle] = useDisclosure(!(options.collapsed ?? false));
    const leftSection = options.collapsed != null && node.children.length > 0 && (
        <ActionIcon variant="transparent" aria-label="actions" color={'gray'} onClick={() => contentToggle.toggle()}>
            <Icon>{contentOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
        </ActionIcon>
    );

    const widgetMenuItems = getHeaderMenu(editor, node, options, jsonModal);
    const widgetHeader = WidgetParentHeader.isEmpty(options, widgetMenuItems) ? undefined : (
        <WidgetParentHeader
            isArrayItem={node.isArrayItem}
            title={options.title}
            order={order}
            titleProps={options.titleProps}
            description={options.descriptionInline ? options.description : undefined}
            dividerProps={options.dividerProps}
            showHeaderMenu={options.showHeaderMenu}
            required={options.required}
            disabled={options.disabled}
            readOnly={options.readOnly}
            leftSection={leftSection}
            showDivider={options.showTitleDivider}
            widgetMenuItems={widgetMenuItems}
        />
    );

    // evaluate menu actions
    const withHeaderMenu = options.readOnly !== true && widgetMenuItems.length > 0 && options.showHeaderMenu !== false;
    const withOptionalPropertiesInline =
        options.showInlineAddAction ??
        (!withHeaderMenu && options.readOnly !== true && node.missingProperties.length > 0);

    return (
        <WidgetField widgetType="object" node={node} options={options} showError={false} showDescription={false}>
            <WidgetInputWrapper options={options} errors={node.errors} header={widgetHeader}>
                <Collapse
                    in={contentOpened}
                    className={classNames('rje-content--object', widgetHeader && 'rje-content--with-header')}
                >
                    <Stack className="rje-object__properties">
                        {node.children
                            .filter((child) => !child.options.hidden)
                            .map((child) => (
                                <ObjectProperty
                                    key={child.id}
                                    editor={editor}
                                    node={child}
                                    options={childOptions}
                                    optionalProperties={node.optionalProperties}
                                    showItemControls={options.showItemControls}
                                />
                            ))}
                    </Stack>
                    {withOptionalPropertiesInline && (
                        <Flex
                            className="rje-object__missing-properties"
                            style={{ alignItems: 'center', paddingTop: 'var(--rje-property-spacing, 0.5em)' }}
                            wrap={'wrap'}
                        >
                            {node.missingProperties.map((name) => (
                                <Button
                                    key={name}
                                    variant="subtle"
                                    disabled={options.readOnly || options.disabled}
                                    // color="gray"
                                    leftSection={<Icon>add</Icon>}
                                    onClick={() => editor.addValue(`${node.pointer}/${name}`)}
                                >
                                    {name}
                                </Button>
                            ))}
                        </Flex>
                    )}
                    <Modal title={options.title} opened={isJsonModalOpen} onClose={jsonModal.close} size={'xl'}>
                        <Widget node={node} editor={editor} options={{ ...options, widget: 'json', title: '' }} />
                        <Group justify="flex-end" mt={'md'}>
                            <Button variant="transparent" onClick={jsonModal.close}>
                                close
                            </Button>
                        </Group>
                    </Modal>
                </Collapse>
            </WidgetInputWrapper>
        </WidgetField>
    );
});

function getHeaderMenu(editor: Editor, node: ObjectNode, options: ArrayOptions, jsonModal: { open: () => void }) {
    const widgetMenuItems: WidgetMenuItems = [];
    if (options.showEditJsonAction == true) {
        widgetMenuItems.push({
            icon: 'edit',
            onClick: jsonModal.open,
            label: 'Edit Json'
        });
    }
    if (editor.optionalProperties && node.optionalProperties.length > 0) {
        const actions = node.optionalProperties.map((property) => {
            const isMissing = node.missingProperties.includes(property);
            return {
                disabled: options.disabled || options.readOnly,
                icon: isMissing ? 'add' : 'delete',
                label: property,
                color: isMissing ? 'blue' : 'red',
                onClick: () => {
                    if (isMissing) {
                        editor.addValue(`${node.pointer}/${property}`);
                    } else {
                        editor.removeValue(`${node.pointer}/${property}`);
                    }
                }
            };
        });
        if (widgetMenuItems.length > 0 && actions.length > 0) {
            widgetMenuItems.push('-');
        }
        widgetMenuItems.push(...actions);
    }
    if (Array.isArray(options.widgetMenuItems)) {
        if (widgetMenuItems.length > 0) {
            widgetMenuItems.push('-');
        }
        widgetMenuItems.push(...options.widgetMenuItems);
    }
    return widgetMenuItems;
}

type ObjectPropertyProps = {
    editor: Editor;
    node: Node;
    options: Record<string, any>;
    optionalProperties: string[];
    showItemControls?: boolean;
};
function ObjectProperty({ editor, node, options, optionalProperties, showItemControls = true }: ObjectPropertyProps) {
    return (
        <div key={node.id} className="rje-object__property">
            <Widget
                key={node.id}
                node={node}
                editor={editor}
                options={{
                    ...options,
                    isOptional: optionalProperties.includes(node.property),
                    widgetMenuItems:
                        showItemControls !== false &&
                        editor.optionalProperties &&
                        optionalProperties.includes(node.property)
                            ? [
                                  {
                                      icon: 'delete',
                                      label: 'delete property',
                                      color: 'red',
                                      onClick: () => editor.removeValue(node.pointer)
                                  }
                              ]
                            : []
                }}
            />
        </div>
    );
}

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
