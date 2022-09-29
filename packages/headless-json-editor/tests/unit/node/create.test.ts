import { Draft07, Draft } from 'json-schema-library';
import { create } from '../../../src/node/create';
import { json } from '../../../src/node/json';
import { strict as assert } from 'assert';
import { ObjectNode, StringNode, isJSONError } from '../../../src/types';

describe('create', () => {
    let core: Draft;

    beforeEach(() => (core = new Draft07()));

    it('should create a node', () => {
        core.setSchema({ type: 'string' });
        const root = create(core, '');
        assert(root.type === 'string');
    });

    it('should support null properties', () => {
        core.setSchema({ type: 'null' });
        const root = create(core, null);
        assert(root.type === 'null');
    });

    it('should create a node tree with empty schema', () => {
        core.setSchema({});
        const root = create(core, { list: ['test-item'] });

        assert(root.type === 'object');
        assert(root.children.length === 1);

        assert(root.children[0].type === 'array');
        const item = root.children[0].children[0];
        assert(item.type === 'string');
        assert(item.value === 'test-item');
    });

    it('should maintain property order of json-schema', () => {
        core.setSchema({
            type: 'object',
            properties: {
                first: { type: 'string', default: 'first' },
                second: { type: 'string', default: 'second' }
            }
        });

        const root = create(core, {
            second: 'second',
            first: 'first'
        }) as ObjectNode;

        assert(root.children[0].type === 'string');
        assert.equal(root.children[0].value, 'first', "'first' node should come first");
        assert(root.children[1].type === 'string');
        assert.equal(root.children[1].value, 'second', "'second' node should come last");
    });

    describe('object errors', () => {
        it('should return an error node for undefined and invalid data', () => {
            core.setSchema({
                type: 'object',
                properties: {},
                additionalProperties: false
            });

            const root = create(core, {
                unknownInvalid: 'property'
            }) as ObjectNode;
            assert.equal(root.children[0].type, 'string');
            assert(isJSONError(root.children[0].schema));
            assert.deepEqual(json(root), { unknownInvalid: 'property' });
        });

        it('should not return schema as error for undefined but valid data', () => {
            core.setSchema({
                type: 'object',
                properties: {},
                additionalProperties: true
            });

            const root = create(core, {
                unknownValid: 'property'
            }) as ObjectNode;
            assert.equal(root.children[0].type, 'string');
            assert(!isJSONError(root.children[0].schema));
            assert.equal((root.children[0] as StringNode).value, 'property');
            assert.deepEqual(json(root), { unknownValid: 'property' });
        });
    });

    describe('dependencies', () => {
        it('should return inactive dynamic schema for missing dependency', () => {
            core.setSchema({
                type: 'object',
                properties: {},
                dependencies: {
                    test: {
                        properties: {
                            additionalValue: { description: 'added', type: 'string' }
                        }
                    }
                }
            });

            const root = create(core, {}) as ObjectNode;
            assert.equal(root.children.length, 1);
            assert.equal(root.children[0].schema.description, 'added');
            assert.equal(root.children[0].schema.isDynamic, true);
            assert.equal(root.children[0].schema.isActive, false);
        });

        it('should return active dynamic schema if dependency has value', () => {
            core.setSchema({
                type: 'object',
                properties: {
                    test: { type: 'string' }
                },
                dependencies: {
                    test: {
                        properties: {
                            additionalValue: { description: 'added', type: 'string' }
                        }
                    }
                }
            });

            const root = create(core, { test: 'with value' }) as ObjectNode;
            assert.equal(root.children.length, 2);
            assert.equal(root.children[1].schema.description, 'added');
            assert.equal(root.children[1].schema.isDynamic, true);
            assert.equal(root.children[1].schema.isActive, true);
        });

        it('should return value of dependency', () => {
            core.setSchema({
                type: 'object',
                properties: {
                    test: { type: 'string' }
                },
                dependencies: {
                    test: {
                        properties: {
                            additionalValue: { description: 'added', type: 'string' }
                        }
                    }
                }
            });

            const root = create(core, { test: 'with value', additionalValue: 'additional' }) as ObjectNode;
            assert.equal(root.children.length, 2);
            assert.deepEqual(json(root), { test: 'with value', additionalValue: 'additional' });
        });
    });

    describe('if-else-then', () => {});
});
