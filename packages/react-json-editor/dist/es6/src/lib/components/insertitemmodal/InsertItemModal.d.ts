import { ArrayNode } from 'headless-json-editor';
import { JsonEditor } from '../../JsonEditor';
export declare type InsertItemModalProps = {
    editor: JsonEditor;
    node: ArrayNode;
    isOpen: boolean;
    onClose: () => void;
};
export declare function InsertItemModal({ editor, node, isOpen, onClose }: InsertItemModalProps): JSX.Element;
