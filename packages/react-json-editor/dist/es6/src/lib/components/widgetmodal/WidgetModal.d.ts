import { JsonEditor } from '../../JsonEditor';
import { Node } from 'headless-json-editor';
import { JSONError } from 'json-schema-library';
export declare type WidgetModalSize = 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen' | undefined;
export declare type WidgetModalProps = {
    editor: JsonEditor;
    node: Node | JSONError;
    isOpen: boolean;
    closeModal: () => void;
    options: Record<string, any> & {
        modalSize?: WidgetModalSize;
    };
};
export declare function WidgetModal({ isOpen, closeModal, editor, node, options }: WidgetModalProps): JSX.Element | null;
