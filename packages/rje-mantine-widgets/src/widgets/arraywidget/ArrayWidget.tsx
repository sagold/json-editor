import { Button, Collapse, DividerProps, Flex, Group, Modal, Table, TitleOrder, TitleProps } from '@mantine/core';
import {
    widget,
    WidgetPlugin,
    ArrayNode,
    DefaultNodeOptions,
    Widget,
    WidgetField,
    Node,
    Editor
} from '@sagold/react-json-editor';
import { Icon } from '../../components/icon/Icon';
import { useDraggableItems, SortableOptions } from '../../features/dragndrop/useDraggableItems';
import { useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { WidgetInputWrapper } from '../../components/widgetinputwrapper/WidgetInputWrapper';
import { WidgetMenu, WidgetMenuItems } from '../../components/widgetmenu/WidgetMenu';
import { WidgetParentHeader } from '../../components/widgetheader/WidgetHeader';
import { ActionButton } from '../../components/actionbutton/ActionButton';
import { SchemaNode } from 'json-schema-library';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

const DRAG_HANDLE_COLUMN = (
    <Table.Td className="rje-drag__handle" style={{ color: 'var(--rje-action-color)' }}>
        <Icon>drag_indicator</Icon>
    </Table.Td>
);

export type ArrayOptions = DefaultNodeOptions<{
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
    /** set to { enabled: true } for dragndrop */
    sortable?: SortableOptions;

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

export const ArrayWidget = widget<ArrayNode<ArrayOptions>>(({ editor, node, options }) => {
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

    const ref = useRef<HTMLTableSectionElement>(null);
    const { sortableEnabled } = useDraggableItems(
        editor,
        {
            pointer: node.pointer,
            disabled: options.disabled,
            readOnly: options.readOnly,
            sortable: options.sortable
        },
        ref
    );

    const withActions = options.readOnly !== true && options.showItemControls !== false;

    const insertOptions = editor.getArrayAddOptions(node);
    const addAction =
        insertOptions.length === 1 ? (
            <ActionButton
                icon={'add'}
                disabled={options.readOnly || options.disabled}
                onClick={() => {
                    const insertOptions = editor.getArrayAddOptions(node);
                    if (insertOptions?.[0]?.schema) {
                        editor.appendItem(node, insertOptions[0].schema);
                    }
                }}
            />
        ) : (
            <WidgetMenu
                icon="add"
                position="top"
                disabled={options.disabled}
                readOnly={options.readOnly}
                items={insertOptions.map((snode) => ({
                    icon: 'add',
                    color: 'blue',
                    label: snode.schema.title,
                    onClick: () => editor.appendItem(node, snode.schema)
                }))}
            />
        );

    const [contentOpened, contentToggle] = useDisclosure(!(options.collapsed ?? false));
    const leftSection = options.collapsed != null && (
        <ActionButton
            icon={contentOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            aria-label="actions"
            onClick={() => contentToggle.toggle()}
        />
    );

    if (options.canAddItem == null) {
        throw new Error('canAddItem is null');
    }

    const canAddItem = options.canAddItem!;
    const widgetMenuItems = getArrayHeaderMenu(editor, node, options, insertOptions, jsonModal, canAddItem);
    // const rightSection = options.showHeaderMenu !== false
    const widgetHeader = WidgetParentHeader.isEmpty(options, widgetMenuItems) ? undefined : (
        <WidgetParentHeader
            isArrayItem={node.isArrayItem}
            title={options.title}
            order={order}
            titleProps={options.titleProps}
            showHeaderMenu={options.showHeaderMenu}
            description={options.descriptionInline ? options.description : undefined}
            dividerProps={options.dividerProps}
            required={options.required}
            disabled={options.disabled}
            readOnly={options.readOnly}
            leftSection={leftSection}
            showDivider={options.showTitleDivider}
            widgetMenuAriaLabel="array-menu"
            widgetMenuItems={widgetMenuItems}
        />
    );

    return (
        <WidgetField widgetType="array" node={node} options={options} showError={false} showDescription={false}>
            <WidgetInputWrapper errors={node.errors} header={widgetHeader} options={options}>
                <Collapse in={contentOpened}>
                    <Table
                        className="rje-array__items"
                        striped
                        withRowBorders={false}
                        classNames={{ table: 'rje-array__table' }}
                    >
                        <Table.Tbody ref={ref}>
                            {node.children
                                .filter((child) => !child.options.hidden)
                                .map((child) => (
                                    <Table.Tr key={child.id} role="array-listitem" aria-rowindextext={child.pointer}>
                                        {sortableEnabled && DRAG_HANDLE_COLUMN}
                                        <Table.Td width={'100%'} style={{ position: 'relative' }}>
                                            <Widget
                                                key={child.id}
                                                node={child}
                                                editor={editor}
                                                options={{
                                                    ...childOptions,
                                                    widgetMenuItems: withActions
                                                        ? getArrayItemMenu(editor, node, child, options)
                                                        : undefined
                                                }}
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Tbody>
                    </Table>
                </Collapse>
            </WidgetInputWrapper>

            {contentOpened && canAddItem && options.readOnly !== true && (
                <Flex className="rje-array__inline-add" justify={'center'} align={'center'}>
                    {options.showInlineAddAction !== false && addAction}
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
        </WidgetField>
    );
});

/**
 * @returns list of array actions to be placed in menu
 */
function getArrayHeaderMenu(
    editor: Editor,
    node: ArrayNode,
    options: ArrayOptions,
    insertOptions: SchemaNode[],
    jsonModal: { open: () => void },
    isAddEnabled: boolean
) {
    const widgetMenuItems: WidgetMenuItems = [];
    if (options.showEditJsonAction === true) {
        widgetMenuItems.push({
            icon: 'edit',
            onClick: jsonModal.open,
            label: 'Edit Json'
        });
    }
    if (insertOptions.length === 1) {
        if (widgetMenuItems.length > 0) {
            widgetMenuItems.push('-');
        }
        widgetMenuItems.push({
            icon: 'add',
            color: 'blue',
            disabled: !isAddEnabled,
            onClick: () => editor.appendItem(node, insertOptions[0].schema),
            label: 'Add Item'
        });
    }
    if (insertOptions.length > 1) {
        const items = insertOptions.map((snode) => ({
            disabled: !isAddEnabled,
            icon: 'add',
            color: 'blue',
            onClick: () => editor.appendItem(node, snode.schema),
            label: snode.schema.title ?? ''
        }));
        if (widgetMenuItems.length > 0) {
            widgetMenuItems.push('-');
        }
        widgetMenuItems.push(...items);
    }
    if (Array.isArray(options.widgetMenuItems) && options.widgetMenuItems.length > 0) {
        if (widgetMenuItems.length > 0) {
            widgetMenuItems.push('-');
        }
        widgetMenuItems.push(...options.widgetMenuItems);
    }
    return widgetMenuItems;
}

function getArrayItemMenu(editor: Editor, parentNode: ArrayNode, child: Node, options: ArrayOptions) {
    const schemaNode = parentNode.schemaNode;
    const isInfixedArray =
        Array.isArray(schemaNode.prefixItems) && schemaNode.prefixItems.length > parseInt(child.property);
    if (isInfixedArray) {
        return [];
    }

    if (options.canRemoveItem == null) {
        throw new Error('canRemoveItems is null');
    }

    const canRemoveItems = options.canRemoveItem;
    const menuItems: WidgetMenuItems = [
        {
            label: 'move up',
            icon: 'keyboard_arrow_up',
            closeMenuOnClick: false,
            disabled: options.readOnly || options.disabled || child.property === '0',
            onClick: () => editor.moveItem(child.pointer, parseInt(child.property) - 1)
        },
        {
            label: 'move down',
            icon: 'keyboard_arrow_down',
            closeMenuOnClick: false,
            disabled: options.readOnly || options.disabled || child.property === `${parentNode.children.length - 1}`,
            onClick: () => editor.moveItem(child.pointer, parseInt(child.property) + 1)
        },
        {
            label: 'delete item',
            icon: 'delete',
            color: 'red',
            disabled: !canRemoveItems || options.readOnly || options.disabled,
            onClick: () => editor.removeValue(child.pointer)
        }
    ];
    return menuItems;
}

export const ArrayWidgetPlugin: WidgetPlugin<ArrayNode> = {
    id: 'array-widget',
    use: (node) => node.type === 'array',
    Widget: ArrayWidget
};
