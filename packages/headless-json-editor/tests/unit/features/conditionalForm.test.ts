import { Draft07, Draft } from 'json-schema-library';
import { create } from '../../../src/node/create';
import { json } from '../../../src/node/json';
import { strict as assert } from 'assert';
import { ObjectNode, StringNode, isJSONError, JSONSchema } from '../../../src/types';

/**
 * conditional forms should
 * 1. not create validation errors
 * 2. keep data when inactive (and possible)
 * 3. optionally be hidden
 * 4. validated when active
 */
describe('feature: conditional form', () => {
    let draft: Draft;
    beforeEach(
        () =>
            (draft = new Draft07({
                type: 'object',
                required: ['trigger'],
                properties: {
                    trigger: { type: 'boolean', $id: 'trigger', default: false }
                },
                allOf: [
                    {
                        if: {
                            required: ['trigger'],
                            properties: {
                                trigger: { const: true }
                            }
                        },
                        then: {
                            required: ['addition'],
                            properties: {
                                addition: { type: 'string', $id: 'addition' }
                            }
                        }
                    }
                ],
                additionalProperties: true
            }))
    );

    // Either property is removed or property order changes...

    it('should not create node when condition does not match', () => {
        const root = create(draft, { trigger: false });

        assert(root.type === 'object');
        assert.equal(root.children.length, 1);
        assert.equal(root.children[0].schema.$id, 'trigger');
    });

    it('should create node when condition does match', () => {
        const root = create(draft, { trigger: true });

        assert(root.type === 'object');
        assert.equal(root.children.length, 2);
        assert.equal(root.children[0].schema.$id, 'trigger');
        assert.equal(root.children[1].schema.$id, 'addition');
    });

    it.skip('should not remove node when condition no longer matches', () => {
        const root = create(draft, { trigger: false, addition: '' });

        assert(root.type === 'object');
        assert.equal(root.children.length, 2);
        assert.equal(root.children[0].schema.$id, 'trigger');
        assert.equal(root.children[1].schema.$id, 'fallback');
    });
});
