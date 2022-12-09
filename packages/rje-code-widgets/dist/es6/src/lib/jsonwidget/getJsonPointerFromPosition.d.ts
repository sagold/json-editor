import { TreeCursor } from '@lezer/common';
import { EditorState } from '@codemirror/state';
export declare type CursorLocationType = 'property' | 'value' | 'object' | 'array' | 'outside';
export declare type JsonPointerLocation = {
    /** json-pointer of current cursor position */
    pointer: string;
    /** cursor on current position */
    cursor: TreeCursor;
    /** syntax type of current cursor location */
    location: CursorLocationType;
};
export declare function getJsonPointerFromPosition(state: EditorState, position: number): JsonPointerLocation;
