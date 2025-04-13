import { SchemaNode } from 'json-schema-library';
import { compileSchema } from 'headless-json-editor';
import { createNode } from '../../../src/node/createNode';
import { setValue } from '../../../src/transform/setValue';
import { strict as assert } from 'assert';

/**
 * conditional forms should
 * 1. not create validation errors
 * 2. keep data when inactive (and possible)
 * 3. optionally be hidden
 * 4. validated when active
 */
describe('feature: toggle form', () => {
    let schemaNode: SchemaNode;
    beforeEach(
        () =>
            (schemaNode = compileSchema({
                type: 'object',
                required: ['trigger'],
                properties: {
                    trigger: { type: 'boolean', $id: 'trigger', default: false },
                    addition: {
                        options: { hidden: true },
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
                                    options: { hidden: false },
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
        const root = createNode(schemaNode, { trigger: false });

        assert(root.type === 'object');
        assert.equal(root.children.length, 1);
        assert.equal(root.children[0].schema.$id, 'trigger');
    });

    it('should not return errors for invalid hidden property', () => {
        const data = { trigger: false, addition: { title: 4 } };
        const root = createNode(schemaNode, data);

        const errs = root.schemaNode.validate(data).errors;
        assert.equal(errs.length, 0);
    });

    it('should return errors for invalid property', () => {
        const data = { trigger: true, addition: { title: 4 } };
        const root = createNode(schemaNode, data);

        const errs = root.schemaNode.validate(data).errors;
        // @todo error is duplicated - check in json-schema-library
        assert(errs.length > 0);
    });

    it('should show active node', () => {
        const root = createNode(schemaNode, { trigger: true });

        assert(root.type === 'object');
        assert.equal(root.children.length, 2);
        assert.equal(root.children[0].schema.$id, 'trigger');
        assert.equal(root.children[1].options.hidden, false);
    });

    it('should switch node to active', () => {
        const root = createNode(schemaNode, { trigger: false });

        const [update] = setValue(root, '/trigger', true);

        assert(update.type === 'object');
        assert.equal(update.children.length, 2);
        assert.equal(update.children[0].schema.$id, 'trigger');
        assert.equal(update.children[1].options.hidden, false);
    });

    it('should switch node to inactive', () => {
        const root = createNode(schemaNode, { trigger: true });

        const [update] = setValue(root, '/trigger', false);

        assert(update.type === 'object');
        assert.equal(update.children.length, 2);
        assert.equal(update.children[0].schema.$id, 'trigger');
        assert.equal(update.children[1].options.hidden, true);
    });
});
