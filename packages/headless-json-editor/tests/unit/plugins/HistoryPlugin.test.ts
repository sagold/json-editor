import { HeadlessEditor } from '../../../src/HeadlessEditor';
import { strict as assert } from 'assert';
import { HistoryPlugin } from '../../../src/plugins/HistoryPlugin';

describe('HistoryPlugin', () => {
    describe('integration', () => {
        let he: HeadlessEditor;
        let history: ReturnType<typeof HistoryPlugin>;
        beforeEach(() => {
            he = new HeadlessEditor({
                data: {
                    a: "initial input"
                },
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
            history = he.addPlugin(HistoryPlugin);
        });

        it('should initialize with undoCount 0', () => {
            assert.equal(history?.getUndoCount(), 0);
        });

        it('should update undoCount on state change', () => {
            he.setValue('/a', 'one');
            assert.equal(history?.getUndoCount(), 1);

            he.setValue('/c', true);
            assert.equal(history.getUndoCount(), 2);
        });

        it('should revert first change', () => {
            const before = he.getData();
            he.setValue('#', { a: 'update', b: 2, c: true });
            assert.equal(history?.getUndoCount(), 1);
            assert.deepEqual(he.getData(), { a: 'update', b: 2, c: true });

            history.undo();

            assert.equal(history.getUndoCount(), 0);
            assert.deepEqual(before, he.getData());
            assert.deepEqual(history.getRedoCount(), 1);
        });

        it('should revert undo', () => {
            const value = { a: 'update', b: 2, c: true };
            he.setValue('#', value);
            assert.equal(history?.getUndoCount(), 1);
            assert.deepEqual(history.getRedoCount(), 0);

            history.undo();

            assert.equal(history.getUndoCount(), 0);
            assert.deepEqual(history.getRedoCount(), 1);

            history.redo();

            assert.equal(history.getUndoCount(), 1);
            assert.deepEqual(history.getRedoCount(), 0);
            assert.deepEqual(he.getData(), value);
        });
    });
});
