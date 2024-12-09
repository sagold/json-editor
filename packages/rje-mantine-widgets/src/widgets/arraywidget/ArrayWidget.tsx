import styles from './array-widget.module.scss';
import { ActionIcon, Button, Collapse, DividerProps, Group, Menu, Modal, Table, TitleProps } from '@mantine/core';
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
import { useDraggableItems, SortableOptions } from '../../useDraggableItems';
import { CSSProperties, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { WidgetInputWrapper } from '../../components/widgetinputwrapper/WidgetInputWrapper';
import { Description } from '../../components/Description';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

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
}>;

// copy of rje-aria-widgets -- maybe rje utility?
function getActionStates(node: ArrayNode) {
    const minItems = node.schema.minItems || 0;
    let isAddEnabled = node.schema.maxItems == null ? true : node.children.length < node.schema.maxItems;
    if (
        Array.isArray(node.schema.items) &&
        (node.schema.additionalItems === false || node.schema.additionalItems == null)
    ) {
        isAddEnabled = node.children.length < node.schema.items.length;
    }
    return { isAddEnabled, isDeleteEnabled: minItems < node.children.length };
}

export const ArrayWidget = widget<ArrayNode<ArrayOptions>>(({ editor, node, options }) => {
    const depth = node.pointer.split('/').length;
    const order = depth === 1 ? 1 : 2;
    const childOptions = {
        titleProps: {
            order: Math.min(6, order + 1)
        },
        disabled: options.disabled,
        readOnly: options.readOnly
    };
    const { isAddEnabled } = getActionStates(node);
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
    const [contentOpened, contentToggle] = useDisclosure(!(options.collapsed ?? false));
    const [isJsonModalOpen, jsonModal] = useDisclosure(false);

    const insertOptions = editor.getArrayAddOptions(node);
    const addAction =
        insertOptions.length === 1 ? (
            <ActionIcon
                variant="subtle"
                disabled={options.readOnly || options.disabled}
                onClick={() => {
                    const insertOptions = editor.getArrayAddOptions(node);
                    if (insertOptions[0]) {
                        editor.appendItem(node, insertOptions[0]);
                    }
                }}
            >
                <Icon>add</Icon>
            </ActionIcon>
        ) : (
            <Menu position="top">
                <Menu.Target>
                    <ActionIcon variant="subtle" disabled={options.readOnly || options.disabled}>
                        <Icon>add</Icon>
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    {insertOptions.map((option, index) => (
                        <Menu.Item
                            key={index}
                            onClick={() => editor.appendItem(node, option)}
                            leftSection={<Icon>add</Icon>}
                        >
                            {option.title}
                            <Menu.Label>
                                <Description text={option.description} />
                            </Menu.Label>
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        );

    const items = node.children.map((child) => (
        <Table.Tr key={child.id}>
            {sortableEnabled && (
                <Table.Td className="rje-drag__handle">
                    <Icon>drag_indicator</Icon>
                </Table.Td>
            )}
            {hasTitle(child) ? (
                <Table.Td width={'100%'} style={{ position: 'relative' }}>
                    <Widget
                        key={child.id}
                        node={child}
                        editor={editor}
                        options={{
                            ...childOptions
                        }}
                    />
                    {options.readOnly === true || options.showItemControls === false ? null : (
                        <ArrayItemMenu editor={editor} parentNode={node} child={child} options={options} absolute />
                    )}
                </Table.Td>
            ) : (
                <>
                    <Table.Td width={'100%'}>
                        <Widget
                            key={child.id}
                            node={child}
                            editor={editor}
                            options={{
                                ...childOptions
                            }}
                        />
                    </Table.Td>
                    {options.readOnly == true || options.showItemControls === false ? null : (
                        <Table.Td>
                            <ArrayItemMenu editor={editor} parentNode={node} child={child} options={options} />
                        </Table.Td>
                    )}
                </>
            )}
        </Table.Tr>
    ));

    let columnCount = options.readOnly === true ? 1 : 2;
    if (sortableEnabled) {
        columnCount += 1;
    }

    return (
        <WidgetField widgetType="array" node={node} options={options} showError={false} showDescription={false}>
            <WidgetInputWrapper
                errors={node.errors}
                order={order}
                options={options}
                leftSection={
                    options.collapsed != null && (
                        <ActionIcon
                            variant="transparent"
                            aria-label="actions"
                            color={'gray'}
                            onClick={() => contentToggle.toggle()}
                        >
                            <Icon>{contentOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
                        </ActionIcon>
                    )
                }
                rightSection={
                    options.showHeaderMenu !== false && (
                        <Menu>
                            <Menu.Target>
                                <ActionIcon
                                    variant="transparent"
                                    aria-label="actions"
                                    // @todo option
                                    color={'gray'}
                                    disabled={options.readOnly || options.disabled}
                                >
                                    <Icon>menu</Icon>
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {options.showEditJsonAction === true ? (
                                    <>
                                        <Menu.Item
                                            leftSection={<Icon>edit</Icon>}
                                            // closeMenuOnClick={false}
                                            onClick={jsonModal.open}
                                        >
                                            edit Json
                                        </Menu.Item>
                                        <Menu.Divider />
                                    </>
                                ) : null}
                                {insertOptions.length === 1 ? (
                                    <Menu.Item
                                        leftSection={<Icon>add</Icon>}
                                        closeMenuOnClick={false}
                                        disabled={!isAddEnabled}
                                        onClick={() => editor.appendItem(node, insertOptions[0])}
                                    >
                                        add item
                                    </Menu.Item>
                                ) : (
                                    insertOptions.map((item, index) => (
                                        <Menu.Item
                                            key={index}
                                            disabled={!isAddEnabled}
                                            leftSection={<Icon>add</Icon>}
                                            // @todo option
                                            closeMenuOnClick={false}
                                            onClick={() => editor.appendItem(node, item)}
                                        >
                                            {item.title}
                                        </Menu.Item>
                                    ))
                                )}
                            </Menu.Dropdown>
                        </Menu>
                    )
                }
            >
                <Collapse in={contentOpened}>
                    <Table
                        className="rje-array__items"
                        striped
                        withRowBorders={false}
                        classNames={{ table: styles['table'] }}
                    >
                        <Table.Tbody ref={ref}>{items}</Table.Tbody>
                        {isAddEnabled && options.readOnly !== true && (
                            <Table.Tfoot>
                                <Table.Tr>
                                    <Table.Td colSpan={columnCount} valign="middle" align="center">
                                        {options.showInlineAddAction !== false && addAction}
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tfoot>
                        )}
                    </Table>
                </Collapse>

                <Modal title={options.title} opened={isJsonModalOpen} onClose={jsonModal.close} size={'xl'}>
                    <Widget node={node} editor={editor} options={{ ...options, widget: 'json', title: '' }} />
                    <Group justify="flex-end" mt={'md'}>
                        <Button variant="transparent" onClick={jsonModal.close}>
                            close
                        </Button>
                    </Group>
                </Modal>
            </WidgetInputWrapper>
        </WidgetField>
    );
});

function hasTitle(child: Node) {
    return (child.options.title?.length ?? 0) > 0;
}

function ArrayItemMenu({
    editor,
    parentNode,
    child,
    options,
    absolute
}: {
    editor: Editor;
    parentNode: ArrayNode;
    child: Node;
    options: ArrayOptions;
    absolute?: boolean;
}) {
    const menuStyle: CSSProperties = absolute
        ? {
              position: 'absolute',
              // mantine td padding:
              top: 'var(--table-vertical-spacing)',
              right: 'var(--table-horizontal-spacing, var(--mantine-spacing-xs))'
          }
        : {};
    const { isDeleteEnabled } = getActionStates(parentNode);
    return (
        <Menu position="left" offset={0} transitionProps={{ transition: 'slide-left', duration: 150 }}>
            <Menu.Target>
                <ActionIcon variant="transparent" color="gray" style={menuStyle}>
                    <Icon>more_horiz</Icon>
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Group>
                    <ActionIcon
                        size={'xl'}
                        variant="transparent"
                        aria-label="delete"
                        disabled={!isDeleteEnabled || options.readOnly || options.disabled}
                        onClick={() => editor.removeValue(child.pointer)}
                    >
                        <Icon>delete</Icon>
                    </ActionIcon>
                    <ActionIcon
                        size={'xl'}
                        variant="transparent"
                        aria-label="insert"
                        disabled={!isDeleteEnabled || options.readOnly || options.disabled}
                        // onClick={() => editor.removeValue(child.pointer)}
                    >
                        <Icon>add</Icon>
                    </ActionIcon>
                    <ActionIcon.Group>
                        <ActionIcon
                            size={'xl'}
                            variant="transparent"
                            aria-label="move-up"
                            disabled={options.readOnly || options.disabled || child.property === '0'}
                            onClick={() => editor.moveItem(child.pointer, parseInt(child.property) - 1)}
                        >
                            <Icon>keyboard_arrow_up</Icon>
                        </ActionIcon>
                        <ActionIcon
                            size={'xl'}
                            variant="transparent"
                            aria-label="move-down"
                            disabled={
                                options.readOnly ||
                                options.disabled ||
                                child.property === `${parentNode.children.length - 1}`
                            }
                            onClick={() => editor.moveItem(child.pointer, parseInt(child.property) + 1)}
                        >
                            <Icon>keyboard_arrow_down</Icon>
                        </ActionIcon>
                    </ActionIcon.Group>
                </Group>
            </Menu.Dropdown>
        </Menu>
    );
}

export const ArrayWidgetPlugin: WidgetPlugin<ArrayNode> = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array',
    Widget: ArrayWidget
};
