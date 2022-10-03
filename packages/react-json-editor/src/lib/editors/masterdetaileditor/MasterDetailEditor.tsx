// import Ref from '@semantic-ui-react/component-ref';
// import Sortable from 'sortablejs';
import { editor, EditorPlugin } from '../decorators';
import { get as getPointer } from 'gson-pointer';
import { Icon, Button, Popup, Header } from 'semantic-ui-react';
import { ParentNode, Node, json, errors, get } from 'headless-json-editor';
import { useState } from 'react';
import { EditModal } from '../../components/editmodal/EditModal';

import { split } from 'gson-pointer';
function getNodeDepth(node: Node, max = 6) {
    const depth = split(node.pointer).length;
    return Math.min(max, depth + 1);
}

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
export const MasterDetailEditor = editor<ParentNode>(({ instance, node, options }) => {
    const [editModal, setEditModal] = useState<{ open: boolean; pointer?: string }>({ open: false });

    return (
        <div data-type={node.schema.type} data-id={node.pointer}>
            <Header as={`h${getNodeDepth(node)}`} style={{ display: 'flex' }}>
                {errors(node).length > 0 && (
                    <Popup
                        content={errors(node)
                            .map((e) => e.message)
                            .join(',\n')}
                        trigger={<Icon name="warning sign" color="red" />}
                    />
                )}
                {node.type === 'array' && (
                    <div style={{ flexGrow: 1 }}>
                        <span>{options.title}</span>
                        <span>{getPreviewText(node)}</span>
                    </div>
                )}
                <Button
                    basic
                    icon="edit"
                    className="clickable"
                    onClick={() => {
                        console.log('open edit modal', node.pointer);
                        setEditModal({ open: true, pointer: node.pointer });
                    }}
                />
            </Header>
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

export const MasterDetailEditorPlugin: EditorPlugin = {
    id: 'master-detail-editor',
    use: (node, options) =>
        options?.skipMaster !== true &&
        (node.schema.type === 'object' || node.schema.type === 'array') &&
        node.options.editor === 'MasterDetail',
    Editor: MasterDetailEditor
};
