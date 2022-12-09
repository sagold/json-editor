import { Draft07, Draft } from 'json-schema-library';
import { create } from '../../../src/node/create';
import { json } from '../../../src/node/json';
import { errors } from '../../../src/node/errors';
import { strict as assert } from 'assert';
import { ObjectNode, StringNode, isJSONError, JSONSchema } from '../../../src/types';

/**
 * conditional forms should
 * 1. not create validation errors
 * 2. keep data when inactive (and possible)
 * 3. optionally be hidden
 * 4. validated when active
 */
describe('feature: toggle form', () => {
    let draft: Draft;
    beforeEach(
        () =>
            (draft = new Draft07({
                type: 'object',
                required: ['trigger'],
                properties: {
                    trigger: { type: 'boolean', $id: 'trigger', default: false },
                    addition: {
                        options: {
                            hidden: true
                        },
                        type: 'object'
                    }
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
                                addition: {
                                    options: {
                                        hidden: false
                                    },
                                    type: 'object',
                                    required: ['title'],
                                    properties: {
                                        title: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                ]
            }))
    );

    it('should not show inactive node', () => {
        const root = create(draft, { trigger: false });

        assert(root.type === 'object');
        assert.equal(root.children.length, 2);
        assert.equal(root.children[0].schema.$id, 'trigger');
        assert.equal(root.children[1].options.hidden, true);
    });

    it('should not return errors for invalid hidden property', () => {
        const data = { trigger: false, addition: { title: 4 } };
        const root = create(draft, data);

        const errs = draft.validate(data);
        assert.equal(errs.length, 0);
    });

    it('should return errors for invalid property', () => {
        const data = { trigger: true, addition: { title: 4 } };
        const root = create(draft, data);

        const errs = draft.validate(data);
        // @todo error is duplicated - check in json-schema-library
        assert(errs.length > 0);
    });

    it('should show active node', () => {
        const root = create(draft, { trigger: true });

        assert(root.type === 'object');
        assert.equal(root.children.length, 2);
        assert.equal(root.children[0].schema.$id, 'trigger');
        assert.equal(root.children[1].options.hidden, false);
    });
});