import { ArrayNode } from 'headless-json-editor';
import { Button, Popup, List } from 'semantic-ui-react';
import { JsonEditor } from '../../JsonEditor';
import { useState } from 'react';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { ArrayOptions } from './ArrayWidget';

export type ArrayActionPanelProps = {
    editor: JsonEditor;
    node: ArrayNode<ArrayOptions>;
    options: ArrayOptions;
    isAddEnabled: boolean;
    insertItem: () => void;
};

export function ArrayActionPanel({ editor, node, options, isAddEnabled, insertItem }: ArrayActionPanelProps) {
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);
    const { isOptional, header = {}, editJson = {} } = options;

    return (
        <>
            <Popup
                className="rje-object__options"
                trigger={
                    <Button
                        basic
                        inverted={options.header?.inverted ?? false}
                        icon="options"
                        style={{ boxShadow: 'none' }}
                    />
                }
                flowing
                hoverable
                disabled={false}
            >
                <List relaxed="very" divided>
                    {isOptional && (
                        <List.Item className="clickable" onClick={() => editor.removeValue(node.pointer)}>
                            <List.Icon name="trash" />
                            <List.Content>Remove Array</List.Content>
                        </List.Item>
                    )}
                    {editJson.enabled && (
                        <List.Item className="clickable" onClick={() => openEditModal(true)}>
                            <List.Icon name="edit outline" />
                            <List.Content>Edit Json</List.Content>
                        </List.Item>
                    )}
                    <List.Item disabled={!isAddEnabled} className="clickable" onClick={insertItem}>
                        <List.Icon name="add" />
                        <List.Content>Add Item</List.Content>
                    </List.Item>
                </List>
            </Popup>
            <WidgetModal
                editor={editor}
                node={node}
                options={{ modalSize: editJson.modalSize, ...options, widget: 'json' }}
                isOpen={isEditModalOpen}
                closeModal={() => openEditModal(false)}
            />
        </>
    );
}
