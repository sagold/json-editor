import { HeadlessJsonEditor, PluginInstance, PluginEvent } from '../HeadlessJsonEditor';
import { Node } from '../types';
export declare const historyPluginId: "history";
export interface HistoryPluginInstance extends PluginInstance {
    undo(): void;
    redo(): void;
    getUndoCount(): number;
    getRedoCount(): number;
}
export declare type Commit = {
    root: Node;
    changes: PluginEvent[];
    updateCount: number;
};
/**
 *
 */
export declare function HistoryPlugin(he: HeadlessJsonEditor): HistoryPluginInstance;
