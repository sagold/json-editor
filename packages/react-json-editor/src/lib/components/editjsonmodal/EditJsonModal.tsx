import { json, get, Node, isJSONError } from 'headless-json-editor';
import { Form, Button, Modal, Message } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';
import { JsonEditor } from '../../JsonEditor';

export type EditJsonModalProps = {
    instance: JsonEditor;
    node: Node;
    isOpen: boolean;
    openEditModal;
    title?: string;
    liveUpdate?: boolean;
};

export function EditJsonModal({ instance, node, isOpen, openEditModal, title, liveUpdate }: EditJsonModalProps) {
    const currentNode = get(instance.getState(), node.pointer);
    const [value, update] = useState(isJSONError(currentNode) ? {} : json(currentNode));
    const [error, setError] = useState(false);

    if (isJSONError(currentNode)) {
        return null;
    }

    return (
        <Modal open={isOpen} onClose={() => openEditModal(false)}>
            {title && <Modal.Header>{title}</Modal.Header>}
            <Modal.Content>
                {error && (
                    <Message error>
                        <Message.Item>invalid json format</Message.Item>
                    </Message>
                )}
                <Form error>
                    <Form.Field error={error}>
                        <TextareaAutosize
                            style={{ width: '100%' }}
                            rows={1}
                            minRows={10}
                            maxRows={40}
                            cacheMeasurements
                            defaultValue={JSON.stringify(json(currentNode), null, 4)}
                            onChange={(e) => {
                                let value = e.target.value;
                                try {
                                    value = JSON.parse(value);
                                    update(value);
                                    setError(false);
                                    liveUpdate && instance.setValue(node.pointer, value);
                                } catch (e) {
                                    setError(true);
                                }
                            }}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            {liveUpdate ? (
                <Modal.Actions>
                    <Button basic onClick={() => openEditModal(false)}>
                        ok
                    </Button>
                </Modal.Actions>
            ) : (
                <Modal.Actions>
                    <Button basic onClick={() => openEditModal(false)}>
                        cancel
                    </Button>
                    <Button
                        disabled={error}
                        basic
                        onClick={() => {
                            instance.setValue(node.pointer, value);
                            openEditModal(false);
                        }}
                    >
                        save
                    </Button>
                </Modal.Actions>
            )}
        </Modal>
    );
}
