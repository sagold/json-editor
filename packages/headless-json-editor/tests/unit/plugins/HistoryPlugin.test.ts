import { HeadlessJsonEditor } from '../../../src/HeadlessJsonEditor';
import { strict as assert } from 'assert';
import { HistoryPlugin, HistoryPluginInstance, historyPluginId } from '../../../src/plugins/HistoryPlugin';

describe('HistoryPlugin', () => {
    describe('integration', () => {
        let he: HeadlessJsonEditor;
        let history: HistoryPluginInstance;
        beforeEach(() => {
            he = new HeadlessJsonEditor({
                schema: {
                    type: 'object',
                    required: ['a', 'b', 'c'],
                    properties: {
                        a: { type: 'string', default: '' },
                        b: { type: 'number', default: 0 },
                        c: { type: 'boolean', default: false }
                    }
                },
                plugins: [HistoryPlugin]
            });
            history = he.plugin(historyPluginId) as HistoryPluginInstance;
        });

        it('should initialize with undoCount 0', () => {
            assert.equal(history.getUndoCount(), 0);
        });

        it('should update undoCount on state change', () => {
            he.setValue('/a', 'one');
            assert.equal(history.getUndoCount(), 1);

            he.setValue('/c', true);
            assert.equal(history.getUndoCount(), 2);
        });

        it('should revert first change', () => {
            const before = he.getValue();
            he.setValue('#', { a: 'update', b: 2, c: true });
            assert.equal(history.getUndoCount(), 1);
            assert.deepEqual(he.getValue(), { a: 'update', b: 2, c: true });

            history.undo();

            assert.equal(history.getUndoCount(), 0);
            assert.deepEqual(before, he.getValue());
            assert.deepEqual(history.getRedoCount(), 1);
        });

        it('should revert undo', () => {
            const value = { a: 'update', b: 2, c: true };
            he.setValue('#', value);
            assert.equal(history.getUndoCount(), 1);
            assert.deepEqual(history.getRedoCount(), 0);

            history.undo();

            assert.equal(history.getUndoCount(), 0);
            assert.deepEqual(history.getRedoCount(), 1);

            history.redo();

            assert.equal(history.getUndoCount(), 1);
            assert.deepEqual(history.getRedoCount(), 0);
            assert.deepEqual(he.getValue(), value);
        });
    });
});
