import { JsonEditor } from '../../JsonEditor';
import { Button, Modal, Form } from 'semantic-ui-react';
import { Node } from 'headless-json-editor';
import { JSONError, isJSONError } from 'json-schema-library';

export type EditModalProps = {
    isOpen: boolean;
    instance: JsonEditor;
    node: Node | JSONError;
    closeModal: () => void;
    options: Record<string, any>;
};

export function EditModal({ isOpen, closeModal, instance, node, options }: EditModalProps) {
    if (isJSONError(node)) {
        console.log(node);
        return null;
    }
    const Editor = instance.getEditor(node, options);
    return (
        <Modal open={isOpen} onClose={closeModal}>
            <Modal.Header>{options?.title ?? node.options.title}</Modal.Header>
            <Modal.Content>
                <Form error>
                    <Editor node={node} instance={instance} options={{ ...options, title: undefined }} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={closeModal}>
                    close
                </Button>
            </Modal.Actions>
        </Modal>
    );
}