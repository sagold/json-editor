import { get as getPointer } from '@sagold/json-pointer';
import { DefaultNodeOptions, ParentNode, Node, getData, widget, WidgetPlugin } from '@sagold/react-json-editor';
import { useRef } from 'react';
import { useModal, Modal } from '../../components/modal/Modal';
import { Button } from '../../components/button/Button';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { Theme } from '../../components/theme/Theme';
import { SectionHeader } from '../../components/sectionheader/SectionHeader';

function getPreviewText(node: Node) {
    if (typeof node.options.previewValue !== 'string') {
        return '';
    }

    if (node.options.previewValue === '.') {
        return getData(node) as string;
    }

    const previewText = getPointer(getData(node), node.options.previewValue);
    return `${previewText}`;
}

export type MasterDetailOptions = {
    /** header font size relative to 1 (em). Defaults to 1 */
    headerFontSize?: number;
    descriptionInline?: boolean;
    /** if true will add a separator line to the header */
    headerSeparator?: boolean;
} & DefaultNodeOptions;

/**
 * Master-Detail Editor for object or array values
 */
export const MasterDetailWidget = widget<ParentNode<MasterDetailOptions>>(({ editor, node, options }) => {
    const portalContainer = useRef<HTMLDivElement>(null);
    const { modalTriggerProps, modalProps } = useModal();
    return (
        <WidgetField
            widgetType="master-detail"
            node={node}
            options={options}
            showError={false}
            showDescription={false}
            ref={portalContainer}
        >
            <WidgetField.Header>
                <SectionHeader>
                    <Button.Controlled {...modalTriggerProps} variant="text" icon="edit_note" />
                    <SectionHeader.Label
                        title={options.title}
                        size={options.headerFontSize}
                        separator={options.headerSeparator === true}
                        description={options.descriptionInline ? undefined : options.description}
                    />
                </SectionHeader>
                <WidgetField.Description enabled={options.descriptionInline === true}>
                    {options.description}
                </WidgetField.Description>
                <WidgetField.Error errors={node.errors} />
            </WidgetField.Header>
            {/*{node.type === 'array' && (
                <div style={{ flexGrow: 1 }}>
                    <span>{options.title}</span>
                    <span>{getPreviewText(node)}</span>
                </div>
            )}*/}
            <Modal isDismissable={false} {...modalProps} portalContainer={portalContainer}>
                {(close) => (
                    <Theme>
                        <WidgetDialog editor={editor} node={node} options={options} closeModal={close} />
                    </Theme>
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
