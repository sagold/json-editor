import { useState, forwardRef, useRef } from 'react';
import { widget, WidgetPlugin, ObjectNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { Button, ButtonControlled } from '../../components/button/Button';
import { Icon } from '../../components/icon/Icon';
import { ObjectLayout } from './buildObjectLayout';
import { ObjectProperties } from './ObjectProperties';
import { Popover, usePopover } from '../../components/popover/Popover';
import { SectionHeader } from '../../components/sectionheader/SectionHeader';
import { useModal, Modal } from '../../components/modal/Modal';
import { WidgetDescription } from '../../components/widgetdescription/WidgetDescription';
import { WidgetField } from '../../components/widgetfield/WidgetField';

export type ObjectOptions = {
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
} & DefaultNodeOptions;

import { DOMAttributes } from '@react-types/shared';

type TriggerProps = {
    children: React.ReactNode;
} & DOMAttributes;
const Trigger = forwardRef<HTMLSpanElement, TriggerProps>(({ children, ...props }, ref) => {
    return (
        <span {...props} ref={ref}>
            {children}
        </span>
    );
});

function WidgetDialog({ editor, node, options, closeModal }) {
    // @todo for some reason title is a boolean sometimes
    let title = options?.title ?? node.options.title;
    title = title === true ? false : title;

    const Widget = editor.getWidget(node, options);
    return (
        <>
            <div className="rje-form">
                <Widget node={node} editor={editor} options={{ ...options, title: undefined }} />
            </div>
            <div className="rje-modal--footer">
                <Button onPress={closeModal}>close</Button>
            </div>
        </>
    );
}

function WidgetActions({ editor, node, options }) {
    const { editJson = {}, layout, header, isOptional } = options;
    // const inverted = header?.inverted ?? false;
    // const [isEditModalOpen, openEditModal] = useState<boolean>(false);
    const hasActions = isOptional === true || editJson.enabled === true || node.optionalProperties.length > 0;
    const { modalTriggerProps, modalProps } = useModal<HTMLButtonElement>({
        onOpenChange(isOpen) {
            if (isOpen) {
                buttonRef.current?.click();
            }
        }
    });
    const { popoverTriggerProps, popoverProps } = usePopover<HTMLButtonElement>({
        placement: 'bottom end'
    });
    const portalContainer = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    if (!hasActions) {
        return null;
    }

    return (
        <div ref={portalContainer}>
            <ButtonControlled {...popoverTriggerProps} variant="text" className="rje-widget-action">
                <Icon>menu</Icon>
            </ButtonControlled>
            <Popover {...popoverProps} portalContainer={portalContainer} title="my modal">
                <div className="rje-widget-actions">
                    {editJson.enabled && (
                        <ButtonControlled variant="text" key="editJson" icon="edit_note" {...modalTriggerProps}>
                            Edit Json
                        </ButtonControlled>
                    )}
                    {node.optionalProperties.length > 0 && (
                        <div>
                            <WidgetDescription>Optional Properties</WidgetDescription>
                            {node.optionalProperties.map((property) =>
                                node.missingProperties.includes(property) ? (
                                    <Button
                                        className="clickable"
                                        key={property}
                                        icon="add"
                                        variant="text"
                                        onPress={() => editor.addValue(`${node.pointer}/${property}`)}
                                    >
                                        {property}
                                    </Button>
                                ) : (
                                    <Button
                                        className="clickable"
                                        key={property}
                                        icon="delete"
                                        variant="text"
                                        onPress={() => editor.removeValue(`${node.pointer}/${property}`)}
                                    >
                                        {property}
                                    </Button>
                                )
                            )}
                        </div>
                    )}
                </div>
            </Popover>
            <Modal isDismissable={false} {...modalProps} portalContainer={portalContainer}>
                {(close) => (
                    <WidgetDialog
                        editor={editor}
                        node={node}
                        options={{ modalSize: editJson.modalSize, ...options, widget: 'json' }}
                        closeModal={close}
                    />
                )}
            </Modal>
        </div>
    );
}

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor, setValue }) => {
    const [showContent, setShowContent] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const { title, description, editJson = {}, layout, header } = options;
    const showHeader = editJson.enabled || title || description || options.collapsed != null;
    const withInlineDelete = options.inlineDeletePropertyOption ?? !showHeader;
    const withInlineAdd = options.inlineAddPropertyOption ?? !showHeader;

    return (
        <WidgetField widgetType="object" node={node} options={options} showError={false} showDescription={false}>
            {showHeader && (
                <WidgetField.Header>
                    <SectionHeader>
                        {options.collapsed != null && (
                            <Button
                                variant="text"
                                className="rje-widget-action"
                                onPress={() => setShowContent(!showContent)}
                                icon={showContent ? 'expand_more' : 'expand_less'}
                            />
                        )}
                        <SectionHeader.Label
                            title={options.title}
                            size={options.headerFontSize}
                            separator={options.headerSeparator === true}
                            description={options.descriptionInline ? undefined : description}
                        />
                        <WidgetActions editor={editor} node={node} options={options} />
                    </SectionHeader>
                    <WidgetField.Description enabled={options.descriptionInline === true}>
                        {description}
                    </WidgetField.Description>
                    <WidgetField.Error errors={node.errors} />
                </WidgetField.Header>
            )}
            {showContent && (
                <ObjectProperties editor={editor} node={node} options={options} withInlineDelete={withInlineDelete} />
            )}
            {withInlineAdd && node.missingProperties.length > 0 && (
                <>
                    <div className="rje-object__missing-properties" style={{ alignItems: 'center' }}>
                        <div className="rje-description" style={{ paddingTop: 0, fontSize: '0.8em' }}>
                            add property:
                        </div>
                        {node.missingProperties.map((name) => (
                            <Button
                                key={name}
                                variant="secondary"
                                onPress={() => editor.addValue(`${node.pointer}/${name}`)}
                                icon="add"
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
