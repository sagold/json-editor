import { createNode } from '../../../src/node/createNode';
import { trace } from '../../../src/node/trace';
import { Draft07 } from 'json-schema-library';
import { strict as assert } from 'assert';
import { Node } from '../../../src/types';

describe('trace', () => {
    let node: Node;
    beforeEach(
        () =>
        (node = createNode(
            new Draft07({
                type: 'object',
                additionalProperties: true
            }),
            {
                title: 'my-title',
                main: true,
                description: null,
                contents: [
                    {
                        type: 'intro',
                        id: 0,
                        content: 'Lorem ipsum dolor sit amet'
                    },
                    {
                        type: 'paragraph',
                        id: 1,
                        content: 'Praetereo multos'
                    }
                ]
            }
        ))
    );

    it('should return all nodes along the path', () => {
        const result = trace(node, '#/contents/1/content');

        assert.equal(result.length, 4);
        assert.equal(result[0].pointer, '#');
        assert.equal(result[1].pointer, '#/contents');
        assert.equal(result[2].pointer, '#/contents/1');
        assert.equal(result[3].pointer, '#/contents/1/content');

        const stringNode = result[result.length - 1];
        assert(stringNode.type === 'string');
        assert.equal(stringNode.value, 'Praetereo multos');
    });

    it.skip('should throw if the path is invalid', () => {
        assert.throws(() => trace(node, '#/contents/9a/content'));
    });
});
