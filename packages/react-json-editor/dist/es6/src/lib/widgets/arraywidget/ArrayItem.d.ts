import { Node } from 'headless-json-editor';
import { JsonEditor } from '../../JsonEditor';
export declare type ArrayItemProps = {
    editor: JsonEditor;
    /** child node */
    node: Node;
    size: number;
    withDragHandle?: boolean;
    disabled?: boolean;
    options?: Record<string, any>;
};
export declare function ArrayItemDefault({ editor, node, withDragHandle, disabled, size, options }: ArrayItemProps): JSX.Element;
export declare function ArrayItemCard({ editor, node, withDragHandle, disabled, size, options }: ArrayItemProps): JSX.Element;
export declare type ArrayItemActionProps = {
    node: Node;
    editor: JsonEditor;
    size: number;
};
export declare function ArrayItemActions({ node, editor, size }: ArrayItemActionProps): JSX.Element;
