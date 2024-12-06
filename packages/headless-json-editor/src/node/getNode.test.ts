import { createNode } from './createNode';
import { getNode } from './getNode';
import { Draft07 } from 'json-schema-library';
import { strict as assert } from 'assert';
import { Node } from '../types';

describe('getNode', () => {
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
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
                        },
                        {
                            type: 'paragraph',
                            id: 1,
                            content: 'Praetereo multos, in bis doctum hominem et suavem, Hieronymum'
                        }
                    ]
                }
            ))
    );

    it('should return target property for json-pointer', () => {
        const result = getNode(node, '/title');
        assert(result.type === 'string');
        assert(result.value === 'my-title');
    });

    it('should return not found error for not matching json-pointer', () => {
        const result = getNode(node, '/contents/3/notfound');
        assert(result.type === 'error');
    });

    it('should return target item for json-pointer', () => {
        const result = getNode(node, '/contents/1');
        assert(result.type === 'object');
        assert(result.children[0].type === 'string');
        assert.equal(result.children[0].value, 'paragraph');
    });

    it('should return nested property for json-pointer', () => {
        const result = getNode(node, '/contents/1/type');
        assert(result.type === 'string');
        assert.equal(result.value, 'paragraph');
    });
});
