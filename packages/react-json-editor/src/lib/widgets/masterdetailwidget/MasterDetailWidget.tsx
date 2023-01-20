// import Ref from '@semantic-ui-react/component-ref';
// import Sortable from 'sortablejs';
import { widget, WidgetPlugin } from '../decorators';
import { get as getPointer } from '@sagold/json-pointer';
import { Button, SemanticCOLORS } from 'semantic-ui-react';
import { DefaultNodeOptions, ParentNode, isParentNode, Node, json, get } from 'headless-json-editor';
import { useState } from 'react';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';

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
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;

/**
 * Master-Detail Editor for object or array values
 */
export const MasterDetailWidget = widget<ParentNode<MasterDetailOptions>>(({ editor, node, options }) => {
    const [editModal, setEditModal] = useState<{ open: boolean; pointer?: string }>({ open: false });
    const { title } = options;
    return (
        <div
            className={`ed-form ${isParentNode(node) ? 'ed-parent' : 'ed-value'}`}
            data-type={node.schema.type}
            data-id={node.pointer}
        >
            <ParentHeader node={node} options={options}>
                <Button
                    basic
                    inverted={options.header?.inverted === true}
                    icon="edit outline"
                    className="clickable"
                    onClick={() => {
                        setEditModal({ open: true, pointer: node.pointer });
                    }}
                />
            </ParentHeader>

            {node.type === 'array' && (
                <div style={{ flexGrow: 1 }}>
                    <span>{title}</span>
                    <span>{getPreviewText(node)}</span>
                </div>
            )}

            {editModal.open && editModal.pointer && (
                <WidgetModal
                    editor={editor}
                    node={get(editor.state, editModal.pointer)}
                    options={{ ...options, skipMaster: true }}
                    isOpen={editModal.open}
                    closeModal={() => setEditModal({ open: false })}
                />
            )}
        </div>
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
