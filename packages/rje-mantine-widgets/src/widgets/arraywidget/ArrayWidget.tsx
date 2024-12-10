import styles from './array-widget.module.scss';
import {
    ActionIcon,
    Button,
    Collapse,
    DividerProps,
    Flex,
    Group,
    Menu,
    Modal,
    Table,
    TitleOrder,
    TitleProps
} from '@mantine/core';
import {
    widget,
    WidgetPlugin,
    ArrayNode,
    DefaultNodeOptions,
    Widget,
    WidgetField,
    Node,
    Editor,
    JsonSchema
} from '@sagold/react-json-editor';
import { Icon } from '../../components/icon/Icon';
import { useDraggableItems, SortableOptions } from '../../useDraggableItems';
import { useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { WidgetInputWrapper } from '../../components/widgetinputwrapper/WidgetInputWrapper';
import { WidgetMenu, WidgetMenuItems } from '../../components/widgetmenu/WidgetMenu';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

const DRAG_HANDLE_COLUMN = (
    <Table.Td className="rje-drag__handle">
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
    const depth = Math.min(6, node.pointer.split('/').length);
    const order = options.titleProps?.order ?? ((depth === 1 ? 1 : 2) as TitleOrder);
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
                            {/*<Menu.Label>{option.description}</Menu.Label>*/}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        );

    const widgetMenuItems = getArrayHeaderMenu(editor, node, options, insertOptions, jsonModal, isAddEnabled);
    const withActions = options.readOnly !== true && options.showItemControls !== false;

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
                        <WidgetMenu
                            offset={0}
                            position={'left-start'}
                            transitionProps={{ transition: 'slide-left', duration: 100 }}
                            icon={node.isArrayItem ? 'more_horiz' : 'menu'}
                            disabled={options.disabled}
                            readOnly={options.readOnly}
                            items={widgetMenuItems}
                        />
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
                        <Table.Tbody ref={ref}>
                            {node.children.map((child) => (
                                <Table.Tr key={child.id}>
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

            {contentOpened && isAddEnabled && options.readOnly !== true && (
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

function getArrayHeaderMenu(
    editor: Editor,
    node: ArrayNode,
    options: ArrayOptions,
    insertOptions: JsonSchema[],
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
            disabled: !isAddEnabled,
            onClick: () => editor.appendItem(node, insertOptions[0]),
            label: 'Add Item'
        });
    }
    if (insertOptions.length > 1) {
        const items = insertOptions.map((item) => ({
            disabled: !isAddEnabled,
            icon: 'add',
            onClick: () => editor.appendItem(node, item),
            label: item.title ?? ''
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

function getArrayItemMenu(editor: Editor, parentNode: ArrayNode, child: Node, options: ArrayOptions): WidgetMenuItems {
    const { isDeleteEnabled } = getActionStates(parentNode);
    return [
        {
            label: 'move up',
            icon: 'keyboard_arrow_up',
            disabled: options.readOnly || options.disabled || child.property === '0',
            onClick: () => editor.moveItem(child.pointer, parseInt(child.property) - 1)
        },
        {
            label: 'move down',
            icon: 'keyboard_arrow_down',
            disabled: options.readOnly || options.disabled || child.property === `${parentNode.children.length - 1}`,
            onClick: () => editor.moveItem(child.pointer, parseInt(child.property) + 1)
        },
        {
            label: 'delete item',
            icon: 'delete',
            color: 'red',
            disabled: !isDeleteEnabled || options.readOnly || options.disabled,
            onClick: () => editor.removeValue(child.pointer)
        }
    ];
}

export const ArrayWidgetPlugin: WidgetPlugin<ArrayNode> = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array',
    Widget: ArrayWidget
};
