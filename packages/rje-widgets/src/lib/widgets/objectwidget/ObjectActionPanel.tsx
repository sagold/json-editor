import { ObjectNode } from 'headless-json-editor';
import { Button, Icon, Label, List, Popup } from 'semantic-ui-react';
import { useState } from 'react';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { JsonEditor } from '@sagold/react-json-editor';
import { ObjectOptions } from './ObjectWidget';

export function ObjectActionPanel({
    node,
    options,
    editor
}: {
    node: ObjectNode<ObjectOptions>;
    options: ObjectOptions;
    editor: JsonEditor;
}) {
    const { title, description, editJson = {}, layout, header, isOptional } = options;
    const inverted = header?.inverted ?? false;
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);

    if (isOptional !== true && editJson.enabled !== true && node.optionalProperties.length === 0) {
        return null;
    }

    return (
        <>
            <Popup
                className="rje-object__options"
                trigger={<Button basic inverted={inverted} icon="options" style={{ boxShadow: 'none' }} />}
                flowing
                hoverable
                disabled={false}
            >
                <List divided relaxed="very">
                    {isOptional && (
                        <List.Item className="clickable" onClick={() => editor.removeValue(node.pointer)}>
                            <List.Icon name="trash" />
                            <List.Content>Remove Object</List.Content>
                        </List.Item>
                    )}
                    {editJson.enabled && (
                        <List.Item className="clickable" onClick={() => openEditModal(true)}>
                            <List.Icon name="edit outline" />
                            <List.Content>Edit Json</List.Content>
                        </List.Item>
                    )}
                    {node.optionalProperties.length > 0 && (
                        <List.Item>
                            <em>Optional Properties</em>
                            <List.Content>
                                <List.List>
                                    {node.optionalProperties.map((property) =>
                                        node.missingProperties.includes(property) ? (
                                            <List.Item
                                                className="clickable"
                                                key={property}
                                                onClick={() => editor.addValue(`${node.pointer}/${property}`)}
                                            >
                                                <List.Icon name="add" />
                                                <List.Content>{property}</List.Content>
                                            </List.Item>
                                        ) : (
                                            <List.Item
                                                className="clickable"
                                                key={property}
                                                onClick={() => editor.removeValue(`${node.pointer}/${property}`)}
                                            >
                                                <List.Icon name="trash" />
                                                <List.Content>{property}</List.Content>
                                            </List.Item>
                                        )
                                    )}
                                </List.List>
                            </List.Content>
                        </List.Item>
                    )}
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
