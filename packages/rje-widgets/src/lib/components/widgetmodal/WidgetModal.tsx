import { Button, Modal, Form } from 'semantic-ui-react';
import { JsonEditor, Node } from '@sagold/react-json-editor';
import { JsonError, isJsonError } from '@sagold/react-json-editor';

export type WidgetModalSize = 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen' | undefined;

export type WidgetModalProps = {
    editor: JsonEditor;
    node: Node | JsonError;
    isOpen: boolean;
    closeModal: () => void;
    options: Record<string, any> & {
        modalSize?: WidgetModalSize;
    };
};

export function WidgetModal({ isOpen, closeModal, editor, node, options }: WidgetModalProps) {
    if (isJsonError(node)) {
        console.log(node);
        return null;
    }
    const Widget = editor.getWidget(node, options);
    return (
        <Modal open={isOpen} onClose={closeModal} size={options.modalSize}>
            <Modal.Header>{options?.title ?? node.options.title}</Modal.Header>
            <Modal.Content scrolling>
                <Form error style={{ maxWidth: 'none' }}>
                    <Widget node={node} editor={editor} options={{ ...options, title: undefined }} />
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
