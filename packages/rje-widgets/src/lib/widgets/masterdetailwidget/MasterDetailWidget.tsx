import { get as getPointer } from '@sagold/json-pointer';
import { DefaultNodeOptions, ParentNode, Node, json, widget, WidgetPlugin } from '@sagold/react-json-editor';
import { useState } from 'react';
import { useModal, Modal } from '../../components/modal/Modal';
import { Button } from '../../components/button/Button';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { Label } from '../../components/label/Label';
import { Icon } from '../../components/icon/Icon';

function getPreviewText(node: Node) {
    if (typeof node.options.previewValue !== 'string') {
        return '';
    }

    if (node.options.previewValue === '.') {
        return json(node) as string;
    }

    const previewText = getPointer(json(node), node.options.previewValue);
    return `${previewText}`;
}

export type MasterDetailOptions = {
    header?: {
        inverted?: boolean;
        color?: string;
    };
} & DefaultNodeOptions;

/**
 * Master-Detail Editor for object or array values
 */
export const MasterDetailWidget = widget<ParentNode<MasterDetailOptions>>(({ editor, node, options }) => {
    const { modalTriggerProps, modalProps } = useModal();
    return (
        <WidgetField widgetType="master-detail" node={node} options={options} showError={false} showDescription={false}>
            <WidgetField.Header>
                <WidgetField.Bar>
                    <Label>{options.title}</Label>
                    <button className="clickable" {...modalTriggerProps}>
                        <Icon>edit_note</Icon>
                    </button>
                </WidgetField.Bar>
                <WidgetField.Description>{options.description}</WidgetField.Description>
                <WidgetField.Error errors={node.errors} />
            </WidgetField.Header>
            {node.type === 'array' && (
                <div style={{ flexGrow: 1 }}>
                    <span>{options.title}</span>
                    <span>{getPreviewText(node)}</span>
                </div>
            )}
            <Modal isDismissable={false} {...modalProps}>
                {(close) => (
                    <div style={{ background: '#fff' }}>
                        <WidgetDialog editor={editor} node={node} options={options} closeModal={close} />
                    </div>
                )}
            </Modal>
        </WidgetField>
    );
});

export const MasterDetailWidgetPlugin: WidgetPlugin = {
    id: 'master-detail-widget',
    use: (node, options = {}) =>
        options.skipMaster !== true &&
        (node.schema.type === 'object' || node.schema.type === 'array') &&
        options.widget === 'MasterDetail',
    Widget: MasterDetailWidget
};

function WidgetDialog({ editor, node, options, closeModal }) {
    // @todo for some reason title is a boolean sometimes
    let title = options?.title ?? node.options.title;
    title = title === true ? false : title;

    const Widget = editor.getWidget(node, options);
    return (
        <div className="rje-form">
            <Widget node={node} editor={editor} options={{ ...options, title: undefined }} />
            <Button onPress={closeModal}>close</Button>
        </div>
    );
}
