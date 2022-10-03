// import Ref from '@semantic-ui-react/component-ref';
// import Sortable from 'sortablejs';
import { editor, EditorPlugin } from '../decorators';
import { get as getPointer } from 'gson-pointer';
import { Icon, Button, Grid, Popup, Header, Segment } from 'semantic-ui-react';
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
    const { title } = options;
    return (
        <Segment basic inverted data-type={node.schema.type} data-id={node.pointer}>
            <Grid columns="equal">
                <Grid.Column width="15">
                    <Header as={`h${getNodeDepth(node)}`} inverted>
                        <Header.Content floated="left">
                            {errors(node).length > 0 && (
                                <Popup
                                    content={errors(node)
                                        .map((e) => e.message)
                                        .join(',\n')}
                                    trigger={<Icon name="warning sign" color="red" />}
                                />
                            )}
                        </Header.Content>
                        <Header.Content>{title}</Header.Content>
                    </Header>
                </Grid.Column>
                <Grid.Column width="1" textAlign="right">
                    <Button
                        basic
                        inverted
                        icon="edit"
                        className="clickable"
                        onClick={() => {
                            console.log('open edit modal', node.pointer);
                            setEditModal({ open: true, pointer: node.pointer });
                        }}
                    />
                </Grid.Column>
            </Grid>

            {node.type === 'array' && (
                <div style={{ flexGrow: 1 }}>
                    <span>{options.title}</span>
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
        </Segment>
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
