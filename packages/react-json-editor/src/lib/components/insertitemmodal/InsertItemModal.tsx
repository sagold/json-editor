import { ArrayNode } from 'headless-json-editor';
import { Button, Modal, Dropdown, DropdownProps } from 'semantic-ui-react';
import { JsonEditor } from '../../JsonEditor';
import { useState } from 'react';

export type InsertItemModalProps = {
    editor: JsonEditor;
    node: ArrayNode;
    isOpen: boolean;
    onClose: () => void;
};

export function InsertItemModal({ editor, node, isOpen, onClose }: InsertItemModalProps) {
    const options = editor.getArrayAddOptions(node);
    const [modal, setModal] = useState<{ selected: number }>({
        selected: 0
    });

    const handleSelection = (event, { value }: DropdownProps) => setModal({ ...modal, selected: parseInt(`${value}`) });
    function addSelectedItem() {
        editor.appendItem(node, options[modal.selected]);
        onClose();
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Modal.Header>Select new array item</Modal.Header>
            <Modal.Content>
                <Dropdown
                    onChange={handleSelection}
                    defaultValue={modal.selected}
                    options={options.map((o, index) => ({
                        key: o.id,
                        value: index,
                        text: o.title
                    }))}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={onClose}>
                    cancel
                </Button>
                <Button color="black" onClick={addSelectedItem}>
                    create
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
