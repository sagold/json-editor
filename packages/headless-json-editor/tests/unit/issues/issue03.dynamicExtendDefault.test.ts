import { HeadlessEditor } from 'headless-json-editor';
import { strict as assert } from 'assert';
import { isArrayNode } from '../../../src/types';
import { JsonSchema } from 'json-schema-library';

describe('issue #03 - extendDefaults on dynamic schema', () => {
    let editor: HeadlessEditor;

    beforeEach(() => {
        editor = new HeadlessEditor({
            extendDefaults: false,
            schema: {
                type: 'object',
                required: ['prop_a', 'prop_b'],
                properties: {
                    prop_a: {
                        type: 'array',
                        default: [],
                        items: {
                            type: 'string',
                            enum: ['a', 'b']
                        },
                        minItems: 1,
                        maxItems: 1
                    },
                    prop_b: {
                        type: 'array',
                        default: [],
                        items: {
                            type: 'string',
                            enum: ['a', 'b']
                        },
                        minItems: 1,
                        maxItems: 1
                    }
                },
                allOf: [
                    {
                        if: {
                            properties: {
                                prop_a: {
                                    minItems: 1,
                                    items: {
                                        enum: ['b']
                                    }
                                }
                            }
                        },
                        then: {
                            properties: {
                                prop_b: {
                                    minItems: 1
                                }
                            }
                        }
                    }
                ]
            }
        });
    });

    describe('extendDefaults: false', () => {
        it('should have initialized empty lists', () => {
            const data = editor.getData();

            assert.deepEqual(data, { prop_a: [], prop_b: [] });
        });

        it('should not modify second list when setting as empty list', () => {
            editor.setData({ prop_a: ['a'], prop_b: [] });

            assert.deepEqual(editor.getData(), { prop_a: ['a'], prop_b: [] });
        });

        it('should not modify second list when appending to first', () => {
            const propA = editor.getNode('/prop_a');
            assert(isArrayNode(propA));
            editor.appendItem(propA, {
                type: 'string',
                enum: ['a', 'b']
            });

            assert.deepEqual(editor.getData(), { prop_a: ['a'], prop_b: [] });
        });

        it('should not modify second list when setting value of first list', () => {
            editor.setValue('/prop_a/0', 'a');

            assert.deepEqual(editor.getData(), { prop_a: ['a'], prop_b: [] });
        });
    });

    describe('extendDefaults: true', () => {
        beforeEach(() => {
            editor = new HeadlessEditor({
                extendDefaults: true,
                schema: editor.getSchema() as JsonSchema
            });
        });

        it('should have initialized with one value', () => {
            const data = editor.getData();

            assert.deepEqual(data, { prop_a: ['a'], prop_b: ['a'] });
        });

        it('should add missing value in second list', () => {
            editor.setData({ prop_a: ['a'], prop_b: [] });

            assert.deepEqual({ prop_a: ['a'], prop_b: ['a'] }, editor.getData());
        });
    });
});
