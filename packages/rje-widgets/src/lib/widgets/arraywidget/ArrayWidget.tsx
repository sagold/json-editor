import classnames from 'classnames';
import { ArrayItemDefault } from './ArrayItem';
import { ArrayWidgetActions } from './ArrayWidgetActions';
import { Button, ButtonControlled } from '../../components/button/Button';
import {
    widget,
    WidgetPlugin,
    ArrayNode,
    DefaultNodeOptions,
    Editor,
    JsonSchema,
} from '@sagold/react-json-editor';
import { Modal, useModal } from '../../components/modal/Modal';
import { SectionHeader } from '../../components/sectionheader/SectionHeader';
import { Select } from '../../components/select/Select';
import { useState, useRef, useCallback } from 'react';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { useDraggableItems, SortableOptions } from './useDraggableItems';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

export type ArrayOptions = {
    /** additional classnames for array editor */
    classNames?: string[];
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    sortable?: SortableOptions;
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
} & DefaultNodeOptions;

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
    const portalContainer = useRef<HTMLDivElement>(null);
    const [showContent, setShowContent] = useState<boolean>(options.collapsed != null ? !options.collapsed : true);
    const { modalTriggerProps: insertModalTriggerProps, modalProps: insertModalProps } = useModal<HTMLButtonElement>();
    const showControls = options.controls !== false;

    const childOptions: Record<string, any> = {};
    options.disabled && (childOptions.disabled = true);
    options.readOnly && (childOptions.readOnly = true);

    const ref = useRef<HTMLDivElement>(null);
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

    const { isAddEnabled, isDeleteEnabled } = getActionStates(node);
    const { description, editJson = { enabled: false } } = options;
    const showHeader = editJson.enabled || options.title || description || options.collapsed != null;

    const insertOptions = editor.getArrayAddOptions(node);
    const insertItem = useCallback(() => {
        editor.appendItem(node, insertOptions[0]);
        setShowContent(true);
    }, [node, editor, insertOptions]);

    const addItemButton =
        insertOptions.length > 1 ? (
            <ButtonControlled
                key="add"
                variant="text"
                disabled={!isAddEnabled || options.disabled}
                icon="add"
                {...insertModalTriggerProps}
            >
                add item
            </ButtonControlled>
        ) : (
            <Button
                key="add"
                disabled={!isAddEnabled || options.disabled}
                variant="text"
                icon="add"
                onPress={insertItem}
            >
                add item
            </Button>
        );

    return (
        <WidgetField
            widgetType="array"
            node={node}
            options={options}
            showError={false}
            showDescription={false}
            className={classnames(options.classNames)}
            ref={portalContainer}
        >
            {showHeader && (
                <WidgetField.Header>
                    <SectionHeader>
                        {options.collapsed != null && (
                            <Button
                                variant="text"
                                className={classnames(
                                    'rje-widget-action',
                                    showContent ? 'rje-widget-action--uncollapsed' : 'rje-widget-action--collapsed'
                                )}
                                onPress={() => setShowContent(!showContent)}
                                icon={showContent ? 'expand_more' : 'expand_less'}
                            />
                        )}
                        <SectionHeader.Label
                            title={options.title}
                            size={options.headerFontSize}
                            separator={options.headerSeparator || true}
                            description={options.descrptionInline ? undefined : description}
                        />
                        {showControls && <ArrayWidgetActions
                            editor={editor}
                            node={node}
                            options={options}
                            actions={options.readOnly ? [] : [addItemButton]}
                            portalContainer={portalContainer}
                        />}
                    </SectionHeader>
                    <WidgetField.Description enabled={options.descriptionInline === true}>
                        {description}
                    </WidgetField.Description>
                    <WidgetField.Error errors={node.errors} />
                </WidgetField.Header>
            )}

            <div className="rje-array__items" ref={ref}>
                {showContent &&
                    node.children.map((child) => (
                        <ArrayItemDefault
                            disabled={options.disabled || options.readOnly}
                            editor={editor}
                            key={child.id}
                            node={child}
                            controls={showControls && options.readOnly !== true}
                            portalContainer={portalContainer}
                            size={node.children.length}
                            withDragHandle={sortableEnabled}
                            options={childOptions}
                            optional={isDeleteEnabled}
                        />
                    ))}
            </div>
            {showContent && options.inlineAddItemOption !== false && options.readOnly !== true && (
                <div className={`rje-array__actions ${node.children.length % 2 ? 'even' : 'odd'}`}>
                    {insertOptions.length > 1 ? (
                        <ButtonControlled
                            variant="text"
                            disabled={!isAddEnabled || options.disabled}
                            icon="add"
                            {...insertModalTriggerProps}
                        />
                    ) : (
                        <Button
                            variant="text"
                            disabled={!isAddEnabled || options.disabled}
                            icon="add"
                            onPress={insertItem}
                        />
                    )}
                </div>
            )}
            <Modal {...insertModalProps} portalContainer={portalContainer} isDismissable={true}>
                {(close) => (
                    <ModalContentSelectItem
                        editor={editor}
                        node={node}
                        close={close}
                        items={insertOptions}
                        onInsertItem={() => setShowContent(true)}
                    />
                )}
            </Modal>
        </WidgetField>
    );
});

export type ModalContentSelectItemProps = {
    close: () => void;
    editor: Editor;
    node: ArrayNode;
    items: JsonSchema[];
    onInsertItem?: () => void;
};

export function ModalContentSelectItem({ close, editor, node, items, onInsertItem }: ModalContentSelectItemProps) {
    const [selected, setSelected] = useState<string | number>(0);
    return (
        <>
            <Select defaultSelectedKey={`${selected}`} setValue={setSelected}>
                {items.map((o, index) => (
                    <Select.Option key={index}>{o.title}</Select.Option>
                ))}
            </Select>
            <div className="rje-modal__footer">
                <Button variant="text" onPress={close}>
                    cancel
                </Button>
                <Button
                    variant="primary"
                    onPress={() => {
                        editor.appendItem(node, items[selected]);
                        onInsertItem && onInsertItem();
                        close();
                    }}
                >
                    insert item
                </Button>
            </div>
        </>
    );
}

export const ArrayWidgetPlugin: WidgetPlugin = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array',
    Widget: ArrayWidget
};
