const UPDATES_TO_COLLECT = 12;
export const historyPluginId = 'history';
function isSameNodeUpdated(commit, changes) {
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
export function HistoryPlugin(he) {
    const past = [{ root: he.getState(), changes: [], updateCount: 0 }];
    const future = [];
    function getCurrentState() {
        return past[past.length - 1];
    }
    const plugin = {
        id: historyPluginId,
        onEvent(root, event) {
            const currentState = getCurrentState();
            if (event.type === 'done' && root !== (currentState === null || currentState === void 0 ? void 0 : currentState.root)) {
                const changes = event.changes;
                if (past.length > 0 &&
                    isSameNodeUpdated(getCurrentState(), changes) &&
                    currentState.updateCount <= UPDATES_TO_COLLECT) {
                    currentState.root = root;
                    currentState.changes = event.changes;
                    currentState.updateCount++;
                }
                else {
                    past.push({ root, changes, updateCount: 0 });
                }
                future.length = 0;
            }
        },
        undo() {
            if (past.length > 1) {
                const current = past.pop();
                future.unshift(current);
                const nextState = getCurrentState();
                he.setState(nextState.root, [{ type: 'undo', previous: current.root, next: nextState.root }]);
            }
        },
        redo() {
            if (future.length > 0) {
                const previous = getCurrentState();
                const nextState = future.shift();
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
//# sourceMappingURL=HistoryPlugin.js.map