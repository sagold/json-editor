import { Draft07, Draft, isJsonError } from 'json-schema-library';
import { update } from '../../../src/transform/update';
import { get } from "../../../src/node/get";
import { Node, NumberNode, } from '../../../src/types';
import { strict as assert } from 'assert';
import { createNode } from '../../../src/node/createNode';
import { trace } from "../../../src/node/trace";

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

describe('update', () => {
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
                        width: { $ref: "/$defs/width" },
                        height: { $ref: "/$defs/height" }
                    }
                },
                list: { type: 'array', items: { type: 'string' } }
            },
            $defs: {
                width: { type: 'number', default: 480 },
                height: { type: 'number', default: 360 }
            }
        });
        ast = createNode(core, core.getTemplate({ size: { width: 11, height: 22 }, list: ["item"] }));
    });

    it('should recreate node at pointer location', () => {
        const before = get<NumberNode>(ast, "/size/width");

        const [newAst] = update(core, ast, "/size/width");
        assert(!isJsonError(newAst));
        const after = get<NumberNode>(newAst, "/size/width");

        assert(!isJsonError(before) && !isJsonError(after));
        assertUnlinkedNodes(before, after, "/size/width");
        assert.notEqual(before, after, "expected different object references");
        assert.notEqual(before.id, after.id, "expected id to be recreated");
        assert.equal(before.value, after.value);
        assert.equal(after.schema.default, 480);
    });

    it("should recreate node from source json-schema", () => {
        const before = get<NumberNode>(ast, "/size/width");
        assert(!isJsonError(before));
        assert.equal(before.schema.default, 480);

        core.getSchema()!.$defs.width = { type: 'number', default: 800 };
        const [newAst] = update(core, ast, "/size/width");
        assert(!isJsonError(newAst));
        const after = get<NumberNode>(newAst, "/size/width");

        assert(!isJsonError(before) && !isJsonError(after));
        assert.equal(before.value, after.value);
        assert.equal(before.schema.default, 480);
        assert.equal(after.schema.default, 800);
    });

    it('should return a list of changes', () => {
        const before = get<NumberNode>(ast, "/size/width");

        const [newAst, changes] = update(core, ast, "/size/width");
        assert(!isJsonError(newAst) && !isJsonError(before));
        const after = get<NumberNode>(newAst, "/size/width");
        assert(!isJsonError(after));

        assert.deepEqual(changes, [{ type: "delete", node: before }, { type: "create", node: after }]);
    });

    it('should return a json-error if the target does not exist', () => {
        const [newAst] = update(core, ast, "/size/unknown");
        assert(isJsonError(newAst));
    });
});
