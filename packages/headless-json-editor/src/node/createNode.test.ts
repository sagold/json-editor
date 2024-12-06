import { Draft07, Draft } from 'json-schema-library';
import { createNode } from './createNode';
import { getData } from './getData';
import { strict as assert } from 'assert';
import { ObjectNode, StringNode, isJsonError, JsonSchema } from '../types';

describe('createNode', () => {
    let draft: Draft;

    beforeEach(() => (draft = new Draft07()));

    it('should create a node', () => {
        draft.setSchema({ type: 'string' });
        const root = createNode(draft, '');
        assert(root.type === 'string');
    });

    it('should support null properties', () => {
        draft.setSchema({ type: 'null' });
        const root = createNode(draft, null);
        assert(root.type === 'null');
    });

    it('should create a node tree with additionalProperties set', () => {
        draft.setSchema({ type: 'object', additionalProperties: true });
        const root = createNode(draft, { list: ['test-item'] });

        assert(root.type === 'object');
        assert(root.children.length === 1);

        assert(root.children[0].type === 'array');
        const item = root.children[0].children[0];
        assert(item.type === 'string');
        assert(item.value === 'test-item');
    });

    it('should maintain property order of json-schema', () => {
        draft.setSchema({
            type: 'object',
            properties: {
                first: { type: 'string', default: 'first' },
                second: { type: 'string', default: 'second' }
            }
        });

        const root = createNode(draft, {
            second: 'second',
            first: 'first'
        }) as ObjectNode;

        assert(root.children[0].type === 'string');
        assert.equal(root.children[0].value, 'first', "'first' node should come first");
        assert(root.children[1].type === 'string');
        assert.equal(root.children[1].value, 'second', "'second' node should come last");
    });

    it('should add any node with `additionalProperty=true`', () => {
        draft.setSchema({ type: 'object', additionalProperties: true });
        const root = createNode(draft, { item: 'keep-me' });
        assert(root.type === 'object');
        assert.equal(root.children.length, 1);
    });

    it('should treat `additionalProperty=true` per default', () => {
        draft.setSchema({ type: 'object' });
        const root = createNode(draft, { item: 'keep-me' });
        assert(root.type === 'object');
        assert.equal(root.children.length, 1);
    });

    describe('object errors', () => {
        it.skip('should return an error node for undefined and invalid data', () => {
            draft.setSchema({
                type: 'object',
                properties: {},
                additionalProperties: false
            });

            const root = createNode(draft, {
                unknownInvalid: 'property'
            }) as ObjectNode;
            assert.equal(root.children[0].type, 'string');
            assert(isJsonError(root.children[0].schema));
            assert.deepEqual(getData(root), { unknownInvalid: 'property' });
        });

        it('should not return schema as error for undefined but valid data', () => {
            draft.setSchema({
                type: 'object',
                properties: {},
                additionalProperties: true
            });

            const root = createNode(draft, {
                unknownValid: 'property'
            }) as ObjectNode;
            assert.equal(root.children[0].type, 'string');
            assert(!isJsonError(root.children[0].schema));
            assert.equal((root.children[0] as StringNode).value, 'property');
            assert.deepEqual(getData(root), { unknownValid: 'property' });
        });
    });

    describe('optional properties', () => {
        it('should expose missing optional properties', () => {
            draft.setSchema({
                type: 'object',
                required: ['two'],
                properties: {
                    one: { type: 'string' },
                    two: { type: 'string' }
                }
            });

            const root = createNode(draft, {}) as ObjectNode;
            assert(root.type === 'object');
            assert.deepEqual(root.missingProperties, ['one']);
        });

        it('should not expose existing optional properties', () => {
            draft.setSchema({
                type: 'object',
                required: ['two'],
                properties: {
                    one: { type: 'string' },
                    two: { type: 'string' }
                }
            });

            const root = createNode(draft, { one: 'optional value added' }) as ObjectNode;
            assert(root.type === 'object');
            assert.deepEqual(root.missingProperties, []);
        });

        it('should remove matching dependencies from optional properties', () => {
            draft.setSchema({
                type: 'object',
                required: [],
                properties: {
                    one: { type: 'string' },
                    two: { type: 'string' }
                },
                dependencies: {
                    one: ['two']
                }
            });

            const root = createNode(draft, { one: 'optional value added' }) as ObjectNode;
            assert(root.type === 'object');
            assert.deepEqual(root.optionalProperties, ['one']);
            assert.deepEqual(root.missingProperties, []);
        });

        it('should keep non-matching dependencies in optional properties', () => {
            draft.setSchema({
                type: 'object',
                required: [],
                properties: {
                    one: { type: 'string' },
                    two: { type: 'string' }
                },
                dependencies: {
                    one: ['two']
                }
            });

            const root = createNode(draft, {}) as ObjectNode;
            assert(root.type === 'object');
            assert.deepEqual(root.optionalProperties, ['one', 'two']);
            assert.deepEqual(root.missingProperties, ['one', 'two']);
        });

        it('should sort unknown additional as last itms', () => {
            draft.setSchema({
                type: 'object',
                properties: {
                    one: { type: 'string' }
                }
            });
            const root = createNode(draft, { one: 'string', two: 'string' }) as ObjectNode;
            assert(root.type === 'object');
            assert.deepEqual(root.optionalProperties, ['one', 'two']);
            assert.deepEqual(root.children[0].property, 'one');
        });
    });

    describe('dynamic', () => {
        describe('dependencies', () => {
            it('should return value of dependency', () => {
                draft.setSchema({
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

                const root = createNode<ObjectNode>(draft, { test: 'with value', additionalValue: 'additional' });
                assert.equal(root.children.length, 2);
                assert.deepEqual(getData(root), { test: 'with value', additionalValue: 'additional' });
            });

            it('should add required missing dependency', () => {
                draft.setSchema({
                    type: 'object',
                    properties: {
                        test: { type: 'string' },
                        additionalValue: { type: 'string' }
                    },
                    dependencies: {
                        test: ['additionalValue']
                    }
                });
                const root = createNode<ObjectNode>(draft, { test: 'with value' });
                assert.equal(root.children.length, 2);
                assert.deepEqual(getData(root), { test: 'with value', additionalValue: '' });
            });
        });

        describe('if-then-else', () => {
            let conditionalSchema: JsonSchema;
            beforeEach(
                () =>
                    (conditionalSchema = {
                        type: 'object',
                        required: ['test'],
                        properties: {
                            test: { type: 'string' }
                        },
                        if: {
                            required: ['test'],
                            properties: {
                                test: {
                                    type: 'string',
                                    minLength: 10
                                }
                            }
                        },
                        then: {
                            required: ['additionalValue'],
                            properties: {
                                additionalValue: { description: 'then', type: 'string', default: 'dynamic then' }
                            }
                        },
                        else: {
                            required: ['additionalValue'],
                            properties: {
                                additionalValue: { description: 'else', type: 'string', default: 'dynamic else' }
                            }
                        }
                    })
            );

            it('should add then-schema for valid if-schema', () => {
                draft.setSchema(conditionalSchema);

                const root = createNode<ObjectNode>(draft, { test: 'with value' });
                assert.equal(root.children.length, 2);
                assert.deepEqual(getData(root), { test: 'with value', additionalValue: 'dynamic then' });
            });

            it('should add else-schema for invalid if-schema', () => {
                draft.setSchema(conditionalSchema);

                const root = createNode<ObjectNode>(draft, { test: '' });
                assert.equal(root.children.length, 2);
                assert.equal(root.children[1].schema.description, 'else');
                assert.deepEqual(getData(root), { test: '', additionalValue: 'dynamic else' });
            });

            it('should not add then-schema for invalid if-schema', () => {
                draft.setSchema({
                    type: 'object',
                    required: ['test'],
                    properties: {
                        test: { type: 'string', default: 'with-value' }
                    },
                    if: {
                        properties: {
                            test: {
                                type: 'string',
                                minLength: 100
                            }
                        }
                    },
                    then: {
                        required: ['additionalValue'],
                        properties: {
                            additionalValue: { description: 'then', type: 'string', default: 'dynamic then' }
                        }
                    }
                });

                const root = createNode<ObjectNode>(draft, { test: 'with-value' });
                assert.equal(root.children.length, 1);
                assert.deepEqual(getData(root), { test: 'with-value' });
            });

            it('should not create a node for non-matching else case', () => {
                draft.setSchema({
                    type: 'object',
                    required: ['test'],
                    properties: {
                        test: { type: 'string' }
                    },
                    if: {
                        properties: {
                            test: {
                                type: 'string',
                                minLength: 10
                            }
                        }
                    },
                    then: {
                        required: ['additionalValue'],
                        properties: {
                            thenValue: { description: 'then', type: 'string', default: 'dynamic then' }
                        }
                    },
                    else: {
                        required: ['additionalValue'],
                        properties: {
                            elseValue: { description: 'else', type: 'string', default: 'dynamic else' }
                        }
                    },
                    additionalProperties: false
                });

                const root = createNode<ObjectNode>(draft, {
                    test: 'triggers then',
                    thenValue: 'input then',
                    elseValue: 'input else'
                });
                assert.equal(root.children.length, 2);
                assert.deepEqual(getData(root), { test: 'triggers then', thenValue: 'input then' });
            });
        });
    });

    describe('oneOf', () => {
        it('should create root node with first schema', () => {
            draft.setSchema({
                type: 'object',
                oneOf: [
                    {
                        required: ['one'],
                        properties: {
                            one: { type: 'string', $id: 'one' }
                        }
                    },
                    {
                        required: ['two'],
                        properties: {
                            two: { type: 'number', $id: 'two' }
                        }
                    }
                ]
            });
            const root = createNode(draft, {});
            assert(root.type === 'object');
            assert.equal(root.children.length, 1);
            assert.equal(root.children[0].schema.$id, 'one');
        });

        it('should create root node with second schema', () => {
            draft.setSchema({
                type: 'object',
                oneOf: [
                    {
                        required: ['one'],
                        properties: {
                            one: { type: 'string', $id: 'one' }
                        }
                    },
                    {
                        required: ['two'],
                        properties: {
                            two: { type: 'number', $id: 'two' }
                        }
                    }
                ]
            });
            const root = createNode(draft, { two: 2 });
            assert(root.type === 'object');
            assert.equal(root.children.length, 1);
            assert.equal(root.children[0].schema.$id, 'two');
        });

        it('should create node from correct oneOf schema', () => {
            draft.setSchema({
                type: 'object',
                properties: {
                    switch: {
                        type: 'object',
                        oneOf: [
                            {
                                id: 'header',
                                required: ['type', 'text'],
                                properties: {
                                    type: { const: 'header' },
                                    text: { type: 'string' }
                                }
                            },
                            {
                                id: 'paragraph',
                                required: ['type', 'text'],
                                properties: {
                                    type: { const: 'paragraph' },
                                    text: { type: 'string' }
                                }
                            }
                        ]
                    }
                }
            });

            const root = createNode(draft, { switch: { type: 'header', text: 'test' } });
            assert(root.type === 'object');
            assert.deepEqual(getData(root), { switch: { type: 'header', text: 'test' } });
            const switchNode = root.children[0];
            assert.deepEqual(switchNode.schema, {
                __oneOfIndex: 0,
                id: 'header',
                // @todo check if this is a problem - schema is merged
                type: 'object',
                required: ['type', 'text'],
                properties: {
                    type: { const: 'header' },
                    text: { type: 'string' }
                }
            });
        });

        it('should expose oneOf origin from root node schema', () => {
            draft.setSchema({
                type: 'object',
                oneOfProperty: 'type',
                oneOf: [
                    {
                        type: 'object',
                        required: ['type', 'title'],
                        properties: {
                            type: { type: 'string', const: 'paragraph' },
                            title: { type: 'string', title: 'paragprah title' }
                        }
                    },
                    {
                        type: 'object',
                        required: ['type', 'title'],
                        properties: {
                            type: { type: 'string', const: 'section' },
                            title: { type: 'string', title: 'section title' }
                        }
                    }
                ]
            });
            const root = createNode(draft, { type: 'section', title: '' });
            assert(root.type === 'object');

            // console.log(JSON.stringify(root.sourceSchema, null, 2), JSON.stringify(root.schema, null, 2));

            // @todo 2: getOneOfOrigin is no longer exposed by jlib
            // assert.equal(root.schema.getOneOfOrigin?.().index, 1);
            assert.equal(root.schema.__oneOfIndex, 1);
        });

        /*+
         * In case of ambigious oneOf schema, return the first valid schema. In
         * documentation we encourage the use of `oneOfProperty` for this case.
         */
        it('should return first matching schema in case of one-of-error', () => {
            draft.setSchema({
                type: 'object',
                oneOf: [
                    {
                        type: 'object',
                        required: ['number'],
                        properties: {
                            number: { type: 'number', value: 12 }
                        }
                    },
                    {
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: { type: 'string', title: 'first' }
                        }
                    },
                    {
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: { type: 'string', title: 'second' }
                        }
                    }
                ]
            });
            const root = createNode(draft, { title: 'ambigious object' });
            assert(root.type === 'object');
            assert.deepEqual(root.schema, {
                __oneOfIndex: 1,
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', title: 'first' }
                }
            });
        });

        /*+
         * In case of ambigious oneOf schema, return the first valid schema. In
         * documentation we encourage the use of `oneOfProperty` for this case.
         */
        it('should return first schema in case of one-of-error', () => {
            draft.setSchema({
                type: 'object',
                oneOf: [
                    {
                        type: 'object',
                        required: ['number'],
                        properties: {
                            number: { type: 'number', value: 12 }
                        }
                    },
                    {
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: { type: 'string', title: 'first' }
                        }
                    }
                ]
            });
            const root = createNode(draft, { other: 'property' });
            assert(root.type === 'object');
            assert.deepEqual(root.schema, {
                __oneOfIndex: 0,
                type: 'object',
                required: ['number'],
                properties: {
                    number: { type: 'number', value: 12 }
                }
            });
        });

        /*+
         * In case of wrong input data
         *
         * @todo attention this modifies input data - we should give the use
         * the ability to fix the issue within the ui
         *
         * @note setValue has a feature where we can change the type by giving
         * another input value
         */
        it('should return schema for invalid data and an error', () => {
            draft.setSchema({
                type: 'object',
                oneOf: [
                    {
                        type: 'object',
                        required: ['number'],
                        properties: {
                            number: { type: 'number', default: 12 }
                        }
                    },
                    {
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: { type: 'string', title: 'first' }
                        }
                    }
                ]
            });
            const root = createNode(draft, 123);
            assert(root.type === 'object');
            assert.deepEqual(root.schema, {
                __oneOfIndex: 0,
                type: 'object',
                required: ['number'],
                properties: {
                    number: { type: 'number', default: 12 }
                }
            });
            assert.deepEqual(getData(root), { number: 12 });
        });
    });

    describe('allOf', () => {
        /** Note: json-schema spec states that allOf statements (as dependencies, if-then-else, ...)
         * should not merge schemas, but validate them individually. In case of an abstract tree,
         * we somehow need to merge those schemas */
        it('should create a node from schema in allOf', () => {
            draft.setSchema({
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', $id: 'title' }
                },
                allOf: [
                    {
                        required: ['date'],
                        properties: {
                            date: { type: 'number', $id: 'date' }
                        }
                    }
                ]
            });
            const root = createNode(draft, {});
            assert(root.type === 'object');
            assert(root.children.length === 2);
            assert(root.children[0].schema.$id === 'title');
            assert(root.children[1].schema.$id === 'date');
        });

        it('should merge schemas before creating nodes', () => {
            draft.setSchema({
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', $id: 'title' }
                },
                allOf: [
                    {
                        properties: {
                            title: { minLength: 1 },
                            date: { minimum: 2 }
                        }
                    },
                    {
                        required: ['date'],
                        properties: {
                            date: { type: 'number', $id: 'date' }
                        }
                    }
                ]
            });
            const root = createNode(draft, {});
            assert(root.type === 'object');
            assert(root.children.length === 2);
            assert(root.children[0].schema.$id === 'title');
            assert(root.children[0].schema.minLength === 1);
            assert(root.children[1].schema.$id === 'date');
            assert(root.children[1].schema.minimum === 2);
        });

        it('should add schema and create node if if-schema matches', () => {
            draft.setSchema({
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', $id: 'title' }
                },
                allOf: [
                    {
                        if: {
                            properties: {
                                title: { minLength: 1 }
                            }
                        },
                        then: {
                            required: ['date'],
                            properties: {
                                date: { type: 'number', $id: 'date' }
                            }
                        }
                    }
                ]
            });
            const root = createNode(draft, { title: 'main topic' });
            assert(root.type === 'object');
            assert(root.children.length === 2);
            assert(root.children[1].schema.$id === 'date');
        });

        it('should not create node for non-matching if-schema', () => {
            draft.setSchema({
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', $id: 'title' }
                },
                allOf: [
                    {
                        if: {
                            // required statement is necessary, else a missing property is valid schema
                            required: ['title'],
                            properties: {
                                title: { minLength: 1 }
                            }
                        },
                        then: {
                            required: ['date'],
                            properties: {
                                date: { type: 'number', $id: 'date' }
                            }
                        }
                    }
                ]
            });
            const root = createNode(draft, {});
            assert(root.type === 'object');
            assert(root.children.length === 1);
            assert(root.children[0].schema.$id === 'title');
        });
    });

    describe('file', () => {
        let draft: Draft;
        beforeEach(() => (draft = new Draft07()));

        it('should create a node', () => {
            const file = new File([], 'testfile.pdf');
            draft.setSchema({ type: ['string', 'object'], format: 'file' });
            const root = createNode(draft, file);
            assert.equal(root.type, 'file');
            assert.equal(root.value, file);
        });
    });
});
