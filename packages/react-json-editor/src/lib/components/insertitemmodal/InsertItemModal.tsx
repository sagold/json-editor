import { ArrayNode } from 'headless-json-editor';
import { Button, Modal, Dropdown, DropdownProps } from 'semantic-ui-react';
import { JsonEditor } from '../../JsonEditor';
import { JSONSchema, isJSONError } from 'json-schema-library';
import { useState } from 'react';

export type InsertItemModalProps = {
    instance: JsonEditor;
    node: ArrayNode;
    isModalOpen: boolean;
    setModalOpen: (isModalOpen: boolean) => void;
};

export function InsertItemModal({ instance, node, isModalOpen, setModalOpen }: InsertItemModalProps) {
    const insertOptions = instance.getArrayAddOptions(node);
    const [modal, setModal] = useState<{ options: JSONSchema[]; selected: number }>({
        options: isJSONError(insertOptions) ? [] : insertOptions,
        selected: 0
    });

    if (isJSONError(insertOptions)) {
        console.log(insertOptions, node);
        return null;
    }

    const closeModal = () => setModalOpen(false);
    if (insertOptions.length === 1 && isModalOpen) {
        instance.appendItem(node, insertOptions[0]);
        closeModal();
    }

    if (insertOptions.length === 1) {
        return null;
    }

    const handleSelection = (event, { value }: DropdownProps) => setModal({ ...modal, selected: parseInt(`${value}`) });
    function addSelectedItem() {
        instance.appendItem(node, modal.options[modal.selected]);
        closeModal();
    }

    return (
        <Modal open={isModalOpen} onClose={closeModal}>
            <Modal.Header>Select new array item</Modal.Header>
            <Modal.Content>
                <Dropdown
                    onChange={handleSelection}
                    defaultValue={0}
                    options={modal.options.map((o, index) => ({
                        key: o.id,
                        value: index,
                        text: o.title
                    }))}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={closeModal}>
                    cancel
                </Button>
                <Button color="black" onClick={addSelectedItem}>
                    create
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
