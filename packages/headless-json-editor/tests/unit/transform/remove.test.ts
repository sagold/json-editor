import { Draft07, Draft } from 'json-schema-library';
import { create } from '../../../src/node/create';
import { json } from '../../../src/node/json';
import { get } from '../../../src/node/get';
import { trace } from '../../../src/node/trace';
import { Node } from '../../../src/node/types';
import { strict as assert } from 'assert';
import { remove } from '../../../src/transform/remove';

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

describe('remove', () => {
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

    describe('array', () => {
        it('should remove item in list', () => {
            const before = create(core, { list: ['1', '2', '3', '4'] });
            const beforeString = JSON.stringify(before);

            const [after] = remove(before, '/list/2');

            assert(after.type !== 'error');
            const data = json(after);
            assert.deepEqual(data, { list: ['1', '2', '4'] });
            const lastNode = get(after, '/list/2');
            assert(lastNode.type === 'string', 'should have fetched last node with pointer to last item');
            assert.equal(lastNode.pointer, '#/list/2', 'should have updated pointer');
            assert.equal(lastNode.value, '4', 'last node should be 4');
            assert.equal(beforeString, JSON.stringify(before), 'should not have modified previous state');
            assertUnlinkedNodes(before, after, '/list/2');
        });
    });

    describe('object', () => {
        it('should remove property from object', () => {
            const before = create(core, { list: ['1', '2', '3', '4'] });
            const beforeString = JSON.stringify(before);

            const [after] = remove(before, '/list');

            assert(after.type !== 'error');
            const data = json(after);
            assert.deepEqual(data, {});
            assert.equal(beforeString, JSON.stringify(before), 'should not have modified previous state');
            assertUnlinkedNodes(before, after, '/list');
        });
    });
});
