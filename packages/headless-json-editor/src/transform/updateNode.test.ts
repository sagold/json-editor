import { Draft07, Draft, isJsonError } from 'json-schema-library';
import { updateNode } from './updateNode';
import { getNode } from '../node/getNode';
import { Node, NumberNode } from '../types';
import { strict as assert } from 'assert';
import { createNode } from '../node/createNode';
import { getNodeTrace } from '../node/getNodeTrace';

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

describe('updateNode', () => {
    let core: Draft;
    let ast: Node;

    beforeEach(() => {
        core = new Draft07({
            type: 'object',
            additionalProperties: false,
            required: ['title', 'size', 'list'],
            properties: {
                title: { type: 'string', default: 'initial title' },
                size: {
                    type: 'object',
                    properties: {
                        width: { $ref: '/$defs/width' },
                        height: { $ref: '/$defs/height' }
                    }
                },
                list: { type: 'array', items: { type: 'string' } }
            },
            $defs: {
                width: { type: 'number', default: 480 },
                height: { type: 'number', default: 360 }
            }
        });
        ast = createNode(core, core.getTemplate({ size: { width: 11, height: 22 }, list: ['item'] }));
    });

    it('should recreate node at pointer location', () => {
        const before = getNode<NumberNode>(ast, '/size/width');

        const [newAst] = updateNode(core, ast, '/size/width');
        assert(!isJsonError(newAst));
        const after = getNode<NumberNode>(newAst, '/size/width');

        assert(!isJsonError(before) && !isJsonError(after));
        assertUnlinkedNodes(before, after, '/size/width');
        assert.notEqual(before, after, 'expected different object references');
        assert.notEqual(before.id, after.id, 'expected id to be recreated');
        assert.equal(before.value, after.value);
        assert.equal(after.schema.default, 480);
    });

    it('should recreate node from source json-schema', () => {
        const before = getNode<NumberNode>(ast, '/size/width');
        assert(!isJsonError(before));
        assert.equal(before.schema.default, 480);

        core.getSchema()!.$defs.width = { type: 'number', default: 800 };
        const [newAst] = updateNode(core, ast, '/size/width');
        assert(!isJsonError(newAst));
        const after = getNode<NumberNode>(newAst, '/size/width');

        assert(!isJsonError(before) && !isJsonError(after));
        assert.equal(before.value, after.value);
        assert.equal(before.schema.default, 480);
        assert.equal(after.schema.default, 800);
    });

    it('should return a list of changes', () => {
        const before = getNode<NumberNode>(ast, '/size/width');

        const [newAst, changes] = updateNode(core, ast, '/size/width');
        assert(!isJsonError(newAst) && !isJsonError(before));
        const after = getNode<NumberNode>(newAst, '/size/width');
        assert(!isJsonError(after));

        assert.deepEqual(changes, [
            { type: 'delete', node: before },
            { type: 'create', node: after }
        ]);
    });

    it('should return a json-error if the target does not exist', () => {
        const [newAst] = updateNode(core, ast, '/size/unknown');
        assert(isJsonError(newAst));
    });
});
