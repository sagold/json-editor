import { PluginEvent, PluginInstance, HeadlessJsonEditorInterface } from './Plugin';
import { Node } from '../types';

const UPDATES_TO_COLLECT: number = 12 as const;
export const historyPluginId = 'history' as const;

export interface HistoryPluginInstance extends PluginInstance {
    undo(): void;
    redo(): void;
    getUndoCount(): number;
    getRedoCount(): number;
}

export type Commit = {
    root: Node;
    changes: PluginEvent[];
    updateCount: number;
};

function isSameNodeUpdated(commit: Commit, changes: PluginEvent[]) {
    if (commit == null || commit.changes.length !== 1 || changes.length !== 1) {
        return false;
    }

    const a = commit.changes[0];
    const b = changes[0];

    if (a.type !== 'update' || b.type !== 'update') {
        return false;
    }

    return a.node.pointer === b.node.pointer && (a.node.type === 'string' || a.node.type === 'number');
}

/**
 *
 */
export function HistoryPlugin(he: HeadlessJsonEditorInterface): HistoryPluginInstance {
    const past: Commit[] = [{ root: he.getState(), changes: [], updateCount: 0 }];
    const future: Commit[] = [];

    function getCurrentState() {
        return past[past.length - 1];
    }

    const plugin: HistoryPluginInstance = {
        id: historyPluginId,

        onEvent(root, event) {
            const currentState = getCurrentState();
            if (event.type === 'done' && root !== currentState?.root) {
                const changes = event.changes;

                if (
                    past.length > 0 &&
                    isSameNodeUpdated(getCurrentState(), changes) &&
                    currentState.updateCount <= UPDATES_TO_COLLECT
                ) {
                    currentState.root = root;
                    currentState.changes = event.changes;
                    currentState.updateCount++;
                } else {
                    past.push({ root, changes, updateCount: 0 });
                }
                future.length = 0;
            }
        },

        undo() {
            if (past.length > 1) {
                const current = past.pop() as Commit;
                future.unshift(current);
                const nextState = getCurrentState();
                he.setState(nextState.root, [{ type: 'undo', previous: current.root, next: nextState.root }]);
            }
        },

        redo() {
            if (future.length > 0) {
                const previous = getCurrentState();
                const nextState = future.shift() as Commit;
                past.push(nextState);
                he.setState(nextState.root, [{ type: 'redo', previous: previous.root, next: nextState.root }]);
            }
        },

        getUndoCount() {
            return past.length - 1;
        },

        getRedoCount() {
            return future.length;
        }
    };

    return plugin;
}
