// import Ref from '@semantic-ui-react/component-ref';
// import Sortable from 'sortablejs';
import { widget, WidgetPlugin } from '../decorators';
import { get as getPointer } from 'gson-pointer';
import { Button } from 'semantic-ui-react';
import { ParentNode, isParentNode, Node, json, get } from 'headless-json-editor';
import { useState } from 'react';
import { EditModal } from '../../components/editmodal/EditModal';
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

/**
 * Master-Detail Editor for object or array values
 */
export const MasterDetailWidget = widget<ParentNode>(({ instance, node, options }) => {
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
                    inverted
                    icon="edit outline"
                    className="clickable"
                    onClick={() => {
                        console.log('open edit modal', node.pointer);
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
                <EditModal
                    instance={instance}
                    node={get(instance.state, editModal.pointer)}
                    options={{ skipMaster: true }}
                    isOpen={editModal.open}
                    closeModal={() => setEditModal({ open: false })}
                />
            )}
        </div>
    );
});

export const MasterDetailWidgetPlugin: WidgetPlugin = {
    id: 'master-detail-widget',
    use: (node, options) =>
        options?.skipMaster !== true &&
        (node.schema.type === 'object' || node.schema.type === 'array') &&
        node.options.editor === 'MasterDetail',
    Widget: MasterDetailWidget
};
