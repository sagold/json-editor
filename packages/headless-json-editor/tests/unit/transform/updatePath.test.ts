import { updatePath } from '../../../src/transform/updatePath';
import { Node, ArrayNode } from '../../../src/types';
import { strict as assert } from 'assert';

describe('updatePath', () => {
    it('should update pointer of passed node', () => {
        const oldParent = { pointer: '#/parent/oldProp' } as unknown as Node;
        const newParent = updatePath(oldParent, '#/parent', 'newProp');

        assert.deepEqual(newParent, { pointer: '#/parent/newProp', property: 'newProp' });
        assert.deepEqual(oldParent, { pointer: '#/parent/oldProp' }, 'should not have modified input node');
    });

    it('should recursively update arrays', () => {
        const oldParent = {
            type: 'array',
            pointer: '#/parent/oldProp',
            children: [{ pointer: '#/parent/oldProp/0' }]
        } as unknown as ArrayNode;

        const newParent = updatePath(oldParent, '#/parent', 'newProp') as ArrayNode;

        assert.deepEqual(newParent, {
            type: 'array',
            pointer: '#/parent/newProp',
            property: 'newProp',
            children: [{ pointer: '#/parent/newProp/0', property: '0' }]
        });

        assert.deepEqual(
            oldParent,
            {
                type: 'array',
                pointer: '#/parent/oldProp',
                children: [{ pointer: '#/parent/oldProp/0' }]
            },
            'should not have modified input node'
        );
    });

    it('should recursively update objects', () => {
        const oldParent = {
            type: 'object',
            pointer: '#/parent/oldProp',
            children: [{ pointer: '#/parent/oldProp/child', property: 'child' }]
        } as unknown as ArrayNode;

        const newParent = updatePath(oldParent, '#/parent', 'newProp') as ArrayNode;

        assert.deepEqual(newParent, {
            type: 'object',
            pointer: '#/parent/newProp',
            property: 'newProp',
            children: [{ pointer: '#/parent/newProp/child', property: 'child' }]
        });

        assert.deepEqual(
            oldParent,
            {
                type: 'object',
                pointer: '#/parent/oldProp',
                children: [{ pointer: '#/parent/oldProp/child', property: 'child' }]
            },
            'should not have modified input node'
        );
    });
});
