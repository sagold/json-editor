import { Draft07, Draft } from 'json-schema-library';
import { createNode } from '../node/createNode';
import { getData } from '../node/getData';
import { getNode } from '../node/getNode';
import { getNodeTrace } from '../node/getNodeTrace';
import { Node, ObjectNode } from '../types';
import { strict as assert } from 'assert';
import { removeNode } from './removeNode';

function assertUnlinkedNodes(before: Node, after: Node, path: string) {
    assert.notEqual(before, after, 'root reference should not be the same');
    const a = getNodeTrace(before, path);
    const b = getNodeTrace(after, path);
    assert.deepEqual(
        a.filter((node) => b.indexOf(node) >= 0),
        [],
        'no nodes should be reused'
    );
}

describe('removeNode', () => {
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
            const before = createNode(core, { list: ['1', '2', '3', '4'] });
            const beforeString = JSON.stringify(before);

            const [after] = removeNode(core, before, '/list/2');

            assert(after.type !== 'error');
            const data = getData(after);
            assert.deepEqual(data, { list: ['1', '2', '4'] });
            const lastNode = getNode(after, '/list/2');
            assert(lastNode.type === 'string', 'should have fetched last node with pointer to last item');
            assert.equal(lastNode.pointer, '#/list/2', 'should have updated pointer');
            assert.equal(lastNode.value, '4', 'last node should be 4');
            assert.equal(beforeString, JSON.stringify(before), 'should not have modified previous state');
            assertUnlinkedNodes(before, after, '/list/2');
        });
    });

    describe('object', () => {
        it('should remove property from object', () => {
            const before = createNode(core, { list: ['1', '2', '3', '4'] });
            const beforeString = JSON.stringify(before);

            const [after] = removeNode(core, before, '/list');

            assert(after.type !== 'error');
            const data = getData(after);
            assert.deepEqual(data, {});
            assert.equal(beforeString, JSON.stringify(before), 'should not have modified previous state');
            assertUnlinkedNodes(before, after, '/list');
        });
    });

    describe('object optional properties', () => {
        let core: Draft;
        beforeEach(() => {
            core = new Draft07({
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', default: 'initial title' },
                    size: {
                        type: 'object',
                        properties: {
                            width: { type: 'number', default: 480 }
                        }
                    },
                    list: { type: 'array', items: { type: 'string' } }
                },
                additionalProperties: true
            });
        });

        it('should reduce list of optional properties for added properties', () => {
            const before = createNode(
                core,
                core.getTemplate({ size: {} }, core.getSchema(), { addOptionalProps: false })
            ) as ObjectNode;
            // precondition: title is required, size is set, but list is optional
            assert.deepEqual(before.missingProperties, ['list']);

            const [after] = removeNode(core, before, '/size');

            assert(after.type !== 'error');
            assert.deepEqual(after.missingProperties, ['size', 'list']);
        });

        it('should set dependency as optional if it is no longer required', () => {
            const draft = new Draft07({
                type: 'object',
                properties: {
                    one: {
                        title: 'Property One',
                        type: 'string'
                    }
                },
                dependencies: {
                    one: {
                        required: ['two'],
                        properties: {
                            two: { type: 'string' }
                        }
                    }
                }
            });
            const before = createNode(
                draft,
                draft.getTemplate({ one: 'triggers two' }, draft.getSchema(), { addOptionalProps: false })
            ) as ObjectNode;

            const [after] = removeNode(draft, before, '/one');
            assert(after.type !== 'error');
            assert.deepEqual(after.missingProperties, ['one']);
            assert.deepEqual(after.optionalProperties, ['one', 'two']);
        });
    });
});
