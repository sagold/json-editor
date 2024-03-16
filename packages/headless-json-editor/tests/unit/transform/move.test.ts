import { Draft07, Draft } from 'json-schema-library';
import { createNode } from '../../../src/node/createNode';
import { getData } from '../../../src/node/getData';
import { get } from '../../../src/node/get';
import { trace } from '../../../src/node/trace';
import { Node, ArrayNode } from '../../../src/types';
import { strict as assert } from 'assert';
import { move } from '../../../src/transform/move';

function assertUnlinkedNodes(before: Node, after: Node, path: string) {
    assert.notEqual(before, after, 'root reference should not be the same');
    const a = trace(before, path);
    const b = trace(after, path);
    assert.deepEqual(
        a.filter((node) => b.indexOf(node) >= 0),
        [],
        'no nodes should be reused'
    );
}

describe('move', () => {
    let core: Draft;

    beforeEach(() => {
        core = new Draft07({
            type: 'object',
            properties: {
                list: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        });
    });

    it('should move item to given array index', () => {
        const before = createNode(core, { list: ['1', '2', '3', '4', '5'] });
        const beforeString = JSON.stringify(before);

        const [after] = move(core, before, '/list', 3, 1);

        assert(after.type !== 'error');
        const data = getData(after);
        assert.deepEqual(data, { list: ['1', '4', '2', '3', '5'] });

        const list = get(after, '#/list') as ArrayNode;
        assert.equal(list.children[1].pointer, '#/list/1');
        assert.equal(list.children[1].property, '1');
        assert.equal(list.children[2].pointer, '#/list/2');
        assert.equal(list.children[2].property, '2');
        assert.equal(list.children[3].pointer, '#/list/3');
        assert.equal(list.children[3].property, '3');

        // check linking
        assert.equal(beforeString, JSON.stringify(before), 'should not have modified previous state');
        assertUnlinkedNodes(before, after, '/list/1');
        assertUnlinkedNodes(before, after, '/list/2');
        assertUnlinkedNodes(before, after, '/list/3');
        assert.equal(get(before, '#/list/0'), get(after, '#/list/0'));
        assert.equal(get(before, '#/list/4'), get(after, '#/list/4'));
    });

    it('should move item in root array', () => {
        core.setSchema({ type: 'array', items: { type: 'string' } });
        const before = createNode(core, ['1', '2', '3', '4', '5']);

        const [after] = move(core, before, '#', 3, 1);

        assert(after.type !== 'error');
        assert.deepEqual(getData(after), ['1', '4', '2', '3', '5']);
    });

    it('should append item if target index is too large', () => {
        const before = createNode(core, { list: ['1', '2', '3', '4', '5'] });

        const [after] = move(core, before, '/list', 1, 90);
        assert(after.type !== 'error');
        assert.deepEqual(getData(after), { list: ['1', '3', '4', '5', '2'] });
    });
});
