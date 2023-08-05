import { Draft07, Draft, isJsonError } from 'json-schema-library';
import { create } from '../../../src/node/create';
import { set } from '../../../src/transform/set';
import { json } from '../../../src/node/json';
import { trace } from '../../../src/node/trace';
import { get } from '../../../src/node/get';
import { strict as assert } from 'assert';
import { Node, ArrayNode, ObjectNode, StringNode } from '../../../src/types';

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

describe('set', () => {
    let core: Draft;
    let template: Record<string, unknown>;

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
                        width: { type: 'number', default: 480 },
                        height: { type: 'number', default: 360 }
                    }
                },
                list: { type: 'array', items: { type: 'string' } }
            }
        });
        template = core.getTemplate({});
    });

    it('should update string value defined on root', () => {
        const before = create(core, core.getTemplate({})) as ObjectNode;
        const beforeString = JSON.stringify(before);
        const titleBefore = get(before, '#/title');

        const [after, changes] = set(core, before, '#/title', 'changed');

        assert(after.type !== 'error');
        const titleAfter = get(after, '#/title');
        assert(titleAfter.type === 'string');
        assert.equal(titleAfter.value, 'changed');
        assert.equal(titleBefore.id, titleAfter.id, 'node id should not have changed');
        // check linking
        assert(beforeString === JSON.stringify(before), 'original data should not have changed');
        assertUnlinkedNodes(before, after, '#/title');
        // check changeset
        assert.deepEqual(changes, [{ type: 'update', node: titleAfter }]);
    });

    it('should update existing object', () => {
        const before = create(core, core.getTemplate({ size: { width: 99, height: 333 } })) as ObjectNode;
        const beforeString = JSON.stringify(before);

        const [after, changes] = set(core, before, '#/size', { width: 4, height: 1 });

        assert(after.type !== 'error');
        const size = get(after, '#/size');
        assert(size.type === 'object');
        assert.deepEqual(json(size), { width: 4, height: 1 });
        // check linking
        assert(beforeString === JSON.stringify(before), 'original data should not have changed');
        assertUnlinkedNodes(before, after, '#/size');
        // check changeset
        assert.deepEqual(changes, [
            { type: 'update', node: get(after, '#/size') },
            { type: 'delete', node: get(before, '#/size/width') },
            { type: 'delete', node: get(before, '#/size/height') },
            { type: 'create', node: get(after, '#/size/width') },
            { type: 'create', node: get(after, '#/size/height') }
        ]);
    });

    it('should update existing object on root', () => {
        const before = create(core, core.getTemplate({})) as ObjectNode;
        const [after, changes] = set(core, before, '#', { title: 'new', size: {}, list: ['99'] });

        assert(after.type !== 'error');
        assert.deepEqual(json(after), { title: 'new', size: {}, list: ['99'] });
        assert.equal(before.id, after.id, 'should not have changed id of updated object');
    });

    it('should add new property to existing parent object', () => {
        const before = create(core, {}) as ObjectNode;
        const beforeString = JSON.stringify(before);

        const [after, changes] = set(core, before, '/title', 'latest headline');

        assert(after.type !== 'error');
        assert.deepEqual(json(after), { title: 'latest headline', list: [], size: {} });
        const titleNode = get(after, '/title') as StringNode;
        assert.equal(titleNode.schema.default, 'initial title');
        // check linking
        assert(beforeString === JSON.stringify(before), 'original data should not have changed');
        assertUnlinkedNodes(before, after, '#/title');

        // @todo check changeset
    });

    it('should add unknown property to existing parent object', () => {
        const before = create(core, {}) as ObjectNode;

        const [after] = set(core, before, '/unknown', 'unknown property');
        assert(after.type !== 'error');

        assert.deepEqual(json(after), { unknown: 'unknown property', title: 'initial title', list: [], size: {} });
        const unknownNode = get(after, '/unknown') as StringNode;
        assert.equal(unknownNode.schema.type, 'string');
    });

    it('should return error if target parent was not found', () => {
        const before = create(core, core.getTemplate({})) as ObjectNode;
        // also testing undefined changes destructuring
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [after, changes] = set(core, before, '/parent/child', 'testpaths value');

        assert(after.type === 'error');
        assert.equal(after.code, 'invalid-path-error');
        assert.deepEqual(json(before), template, 'should not have modified data');
    });

    it('should be able to replace object on root property by different type', () => {
        const before = create(core, core.getTemplate({})) as ObjectNode;
        const idsBefore = [get(before, '/size').id];

        const [after] = set(core, before, '/size', '1024x768');

        assert(after.type !== 'error');
        assert.deepEqual(json(after), { ...template, size: '1024x768' });
        const sizeNode = get(after, '/size');
        assert.equal(sizeNode.type, 'string', 'root type should have changed to datatype string');

        const idsAfter = [get(after, '/size').id];
        assert.notDeepEqual(idsBefore, idsAfter, 'node.ids should have changed');
    });

    describe('object optional properties', () => {
        let core: Draft;
        beforeEach(() => {
            core = new Draft07({
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', default: 'initial title' },
                    size: {
                        type: 'object',
                        properties: {
                            width: { type: 'number', default: 480 }
                        }
                    },
                    list: { type: 'array', items: { type: 'string' } }
                },
                additionalProperties: false
            });
        });

        it('should reduce list of optional properties for added properties', () => {
            const before = create(
                core,
                core.getTemplate({}, core.getSchema(), { addOptionalProps: false })
            ) as ObjectNode;
            // precondition: title is required, but size and list are optional
            assert.deepEqual(before.missingProperties, ['size', 'list']);

            const [after, changes] = set(core, before, '/size', {});

            assert(after.type !== 'error');
            assert.deepEqual(after.missingProperties, ['list']);
        });

        it('should add optional properties in the correct order', () => {
            core.setSchema({
                type: 'object',
                properties: {
                    a: { type: 'string' },
                    b: { type: 'string' },
                    c: { type: 'string' }
                }
            });
            const before = create(
                core,
                core.getTemplate({ a: '1', c: '3' }, core.getSchema(), { addOptionalProps: false })
            ) as ObjectNode;
            // precondition
            assert.deepEqual(before.missingProperties, ['b']);

            const [after, changes] = set(core, before, '/b', '2');

            assert(after.type !== 'error');
            assert.deepEqual(after.children.length, 3);
            assert.deepEqual(after.children[1].property, 'b');
        });
    });

    describe('array', () => {
        it('should be able to replace array string item', () => {
            const before = create(core, core.getTemplate({ list: ['a'] })) as ObjectNode;

            const [after, changes] = set(core, before, '/list/0', 'b');

            assert(after.type !== 'error');
            assert.deepEqual(json(after), { ...template, list: ['b'] });
            // check linking
            assertUnlinkedNodes(after, before, '/list/0');
            // check changeset
            assert.deepEqual(changes, [{ type: 'update', node: get(after, '/list/0') }]);
        });

        it('should be able to append string item to array', () => {
            const before = create(core, core.getTemplate({ list: ['a'] })) as ObjectNode;

            const [after, changes] = set(core, before, '/list/1', 'b');

            assert(after.type !== 'error');
            assert.deepEqual(json(after), { ...template, list: ['a', 'b'] });
            // check linking
            assertUnlinkedNodes(after, before, '/list/1');
            // check changeset
            assert.deepEqual(changes, [{ type: 'create', node: get(after, '/list/1') }]);
        });

        it('should have new item flagged by isArrayItem', () => {
            const before = create(core, core.getTemplate({ list: ['a'] })) as ObjectNode;

            const [after, changes] = set(core, before, '/list/1', 'b');

            assert(after.type !== 'error');
            const arrayItem = get(after, '/list/1');
            assert.equal(arrayItem.isArrayItem, true);
        });

        it('should be able to add string item to specific array index', () => {
            const before = create(core, core.getTemplate({ list: ['a'] })) as ObjectNode;

            const [after] = set(core, before, '/list/2', 'b');

            assert(after.type !== 'error');
            // eslint-disable-next-line no-sparse-arrays
            assert.deepEqual(json(after), { ...template, list: ['a', , 'b'] });
        });

        it('should return error if array index is not a number', () => {
            const before = create(core, core.getTemplate({ list: ['a'] })) as ObjectNode;

            const [after] = set(core, before, '/list/2f', 'b');

            assert(after.type === 'error');
            assert.equal(after.code, 'invalid-path-error');
            assert.deepEqual(json(before), { ...template, list: ['a'] }, 'should not have modified data');
        });

        it('should return update change of array when being replaced', () => {
            const before = create(core, core.getTemplate({ list: ['a', 'b'] })) as ObjectNode;

            const [after, changes] = set(core, before, '/list', ['a', 'b', 'c']);

            assert(after.type !== 'error');
            // check linking
            assertUnlinkedNodes(after, before, '/list/0');
            assertUnlinkedNodes(after, before, '/list/1');
            assertUnlinkedNodes(after, before, '/list/2');
            // check changeset
            assert(changes);
            assert.deepEqual(changes[0], { type: 'update', node: get(after, '/list') });
        });
    });

    describe('unknown data', () => {
        it('should add correct schema', () => {
            const draft = new Draft07({ type: 'object' });
            const before = create(draft, draft.getTemplate({ switch: ['first', 2] })) as ObjectNode;

            assert.equal(get(before, '/switch/0').type, 'string');
            assert.equal(get(before, '/switch/1').type, 'number');
        });
    });

    describe('value oneOf', () => {
        let oneOf: Draft;
        beforeEach(() => {
            oneOf = new Draft07({
                type: 'object',
                properties: {
                    switch: {
                        oneOf: [{ type: 'string' }, { type: 'number' }]
                    }
                }
            });
        });

        it('should switch between string and number', () => {
            const before = create(oneOf, { switch: 'as-string' }) as ObjectNode;
            const beforeSwitch = get(before, '/switch');
            assert.equal(beforeSwitch.type, 'string');

            const [after] = set(oneOf, before, '/switch', 23);

            assert(after.type !== 'error');
            assert.deepEqual(json(after), { switch: 23 });
            assertUnlinkedNodes(after, before, '/switch');
        });
    });

    describe('object allOf', () => {
        it('should update allOf property', () => {
            const allOf = new Draft07({
                type: 'object',
                required: ['switch'],
                properties: {
                    switch: { type: 'boolean', default: false }
                },
                allOf: [
                    {
                        required: ['title'],
                        properties: {
                            title: { type: 'string', default: 'standard title' }
                        }
                    }
                ]
            });
            const before = create(allOf, { switch: true }) as ObjectNode;
            // test precondition: did allOf create missing node
            assert.equal(before.children.length, 2, 'should have created missing node from allOf');
            assert(before.children[1].type === 'string');
            assert.equal(before.children[1].value, 'standard title');

            const [after] = set(allOf, before, '/title', 'custom title');
            assert(after.type === 'object');

            // test update result
            assert.equal(after.children.length, 2);
            assert(after.children[1].type === 'string');
            assert.equal(after.children[1].value, 'custom title');

            // test node updates
            assert(before.id === after.id, 'allOf node should not have been replaced');
        });

        it('should update allOf location', () => {
            const allOf = new Draft07({
                type: 'object',
                required: ['switch'],
                properties: {
                    switch: { type: 'boolean', default: false }
                },
                allOf: [
                    {
                        required: ['title'],
                        properties: {
                            title: { type: 'string', default: 'standard title' }
                        }
                    }
                ]
            });
            const before = create(allOf, { switch: true }) as ObjectNode;

            const [after] = set(allOf, before, '#', { title: 'custom title' });
            assert(after.type === 'object');

            // test update result
            assert.equal(after.children.length, 2);
            assert(after.children[1].type === 'string');
            assert.equal(after.children[1].value, 'custom title');

            // test node updates
            assert(before.id === after.id, 'allOf node should not have been replaced');
        });

        // @todo - this might get complex. Simple diff is no longer sufficient here
        it.skip('should update modified node', () => {
            const allOf = new Draft07({
                type: 'object',
                properties: {
                    title: { type: 'string' }
                },
                allOf: [
                    {
                        if: {
                            type: 'object',
                            required: ['title'],
                            properties: {
                                title: {
                                    minLength: 4
                                }
                            }
                        },
                        then: {
                            properties: {
                                title: {
                                    pattern: '^[0-9]+$',
                                    patternExample: 'a string with a length of 4+ should contain only numbers'
                                }
                            }
                        }
                    }
                ]
            });
            const before = create(allOf, { title: 'ok' }) as ObjectNode;

            const [after] = set(allOf, before, '/title', 'triggers an error');

            assert(after.type === 'object');
            assert.equal(get(before, '/title').id, get(after, '/title').id, 'should not have replaced node');
        });
    });

    describe('object oneOf - root level', () => {
        let oneOf: Draft;
        beforeEach(() => {
            oneOf = new Draft07({
                oneOf: [
                    {
                        type: 'object',
                        description: 'header',
                        required: ['type', 'text'],
                        properties: {
                            type: { const: 'header' },
                            text: { type: 'string' }
                        }
                    },
                    {
                        type: 'object',
                        description: 'paragraph',
                        required: ['type', 'text'],
                        properties: {
                            type: { const: 'paragraph' },
                            text: { type: 'string' }
                        }
                    }
                ]
            });
        });

        it('should switch between object schema', () => {
            const before = create(oneOf, { type: 'header', text: 'test' }) as ObjectNode;
            assert.equal(before.schema.description, 'header');

            const [after, changes] = set(oneOf, before, '/type', 'paragraph');

            assert(after.type !== 'error');
            assert.equal(after.schema.description, 'paragraph');
            // check linking
            assertUnlinkedNodes(after, before, '/type');
            assertUnlinkedNodes(after, before, '/text');
            // check changeset
            // assert.deepEqual(changes, [{ type: 'update', node: after }]);
        });

        it('should not replace nodes on value update', () => {
            const before = create(oneOf, { type: 'header', text: 'test' }) as ObjectNode;
            const beforeJson = JSON.parse(JSON.stringify(before));

            const [after] = set(oneOf, before, '/text', 'updated-test-string');

            assert(after.type !== 'error');
            assert(before.id === after.id, 'parent id of object should not have changed');
            assert.equal(
                get(before, '/text').id,
                get(after, '/text').id,
                'id of updated value should not have changed'
            );
            // check linking
            assertUnlinkedNodes(after, before, '/text');
        });
    });

    describe('object oneOf', () => {
        let oneOf: Draft;
        beforeEach(() => {
            oneOf = new Draft07({
                type: 'object',
                properties: {
                    switch: {
                        type: 'object',
                        oneOf: [
                            {
                                id: 'header',
                                // type: 'object',
                                required: ['type', 'text'],
                                properties: {
                                    type: { const: 'header' },
                                    text: { type: 'string' }
                                }
                            },
                            {
                                id: 'paragraph',
                                // type: 'object',
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
        });

        it('should switch between object schema', () => {
            const before = create(oneOf, { switch: { type: 'header', text: 'test' } }) as ObjectNode;
            const beforeSwitch = get(before, '/switch');
            assert(!isJsonError(beforeSwitch));
            // @ts-expect-error id is custom attribute
            assert.equal(beforeSwitch.schema.id, 'header');

            const [after, changes] = set(oneOf, before, '/switch/type', 'paragraph');

            assert(after.type !== 'error');
            const afterSwitch = get(after, '/switch');
            assert(!isJsonError(afterSwitch));
            // @ts-expect-error id is custom attribute
            assert.equal(afterSwitch.schema.id, 'paragraph');
            // check linking
            assertUnlinkedNodes(after, before, '/switch/type');
            assertUnlinkedNodes(after, before, '/switch/text');
            // check changeset
            assert.deepEqual(changes, [
                { type: 'delete', node: beforeSwitch },
                { type: 'create', node: afterSwitch }
            ]);
        });

        it('should not replace nodes on value update', () => {
            const before = create(oneOf, { switch: { type: 'header', text: 'test' } }) as ObjectNode;
            const switchBefore = JSON.parse(JSON.stringify(get(before, '/switch')));

            const [after] = set(oneOf, before, '/switch/text', 'updated-test-string');

            assert(after.type !== 'error');
            const switchAfter = get(after, '/switch') as StringNode;
            assert(switchBefore.id === switchAfter.id, 'parent id of object should not have changed');
            assert.equal(
                get(switchBefore, '/text').id,
                get(switchAfter, '/text').id,
                'id of updated value should not have changed'
            );
            // check linking
            assertUnlinkedNodes(after, before, '/switch/text');
        });
    });

    describe('array oneOf', () => {
        let oneOf: Draft;
        beforeEach(() => {
            oneOf = new Draft07({
                type: 'object',
                properties: {
                    switch: {
                        type: 'array',
                        items: { oneOf: [{ type: 'string' }, { type: 'number' }] }
                    },
                    content: {
                        type: 'array',
                        oneOfProperty: 'id',
                        items: {
                            oneOf: [
                                {
                                    id: 'header',
                                    type: 'object',
                                    properties: {
                                        type: { const: 'header' },
                                        text: { type: 'string' }
                                    }
                                },
                                {
                                    id: 'paragraph',
                                    type: 'object',
                                    properties: {
                                        type: { const: 'paragraph' },
                                        text: { type: 'string' }
                                    }
                                }
                            ]
                        }
                    }
                }
            });
        });

        it('should change schema if type of values changes', () => {
            const before = create(oneOf, oneOf.getTemplate({ switch: ['first', 2] })) as ObjectNode;

            const [after1] = set(oneOf, before, '/switch/0', 1);
            assert(after1.type !== 'error');
            const first = get(after1, '/switch/0');
            assert.equal(first.type, 'number');

            const [after2] = set(oneOf, after1, '/switch/1', 'second');
            assert(after2.type !== 'error');
            const second = get(after2, '/switch/1');
            assert.equal(second.type, 'string');

            // check linking
            assertUnlinkedNodes(before, after2, '/switch/0');
            assertUnlinkedNodes(after1, after2, '/switch/1');
        });

        it('should change schema if type of object changes', () => {
            const before = create(oneOf, { content: [{ type: 'header' }, { type: 'paragraph' }] }) as ObjectNode;

            const [after, changes] = set(core, before, '/content/0', { type: 'paragraph' });

            assert(after.type !== 'error');
            const firstNode = get(after, '/content/0');
            assert(!isJsonError(firstNode));
            // @ts-expect-error id is custom attribute
            assert.equal(firstNode.schema.id, 'paragraph', 'should have change oneOf schema');
            // check linking
            assertUnlinkedNodes(after, before, '/content/0');
            // check changeset
            assert.deepEqual(changes, [
                { type: 'delete', node: get(before, '/content/0') },
                { type: 'create', node: firstNode }
            ]);
        });

        // bug?
        // it('should not change schema if type of object changes', () => {
        //     const before = create(oneOf, { content: [{ type: 'header' }, { type: 'paragraph' }] }) as ObjectNode;

        //     const [after] = set(core, before, '/content/0', { type: 'paragraph' });

        //     assert(after.type !== 'error');
        //     const firstNode = get(after, '/content/0');
        //     assert.equal(firstNode.schema.id, 'paragraph', 'should have change oneOf schema');
        // });

        it('should change schema if nested properties change', () => {
            const before = create(oneOf, { content: [{ type: 'header' }, { type: 'paragraph' }] }) as ObjectNode;

            const [after] = set(core, before, '/content/0/type', 'paragraph');

            assert(after.type !== 'error');
            const firstNode = get(after, '/content/0');

            assert(!isJsonError(firstNode));
            // @ts-expect-error id is custom attribute
            assert.equal(firstNode.schema.id, 'paragraph', 'should have change oneOf schema');
            assertUnlinkedNodes(after, before, '/content/0/type');
        });
    });

    describe('object dependencies', () => {
        let dependencies: Draft;
        beforeEach(() => {
            dependencies = new Draft07({
                type: 'object',
                properties: { test: { type: 'string' } },
                dependencies: {
                    test: {
                        properties: {
                            additionalValue: { description: 'added', type: 'string' }
                        }
                    }
                }
            });
        });

        it('should not replace dependency node', () => {
            const before = create<ObjectNode>(dependencies, { test: '' });

            const [after] = set<ObjectNode>(dependencies, before, '/test', 'with-value');

            assert(!isJsonError(after));
            assert.equal(before.children[0].id, after.children[0].id);
        });

        it('should not replace dependent node', () => {
            const before = create<ObjectNode>(dependencies, { test: 'with-value', additionalValue: 'before' });

            const [after] = set<ObjectNode>(dependencies, before, '/test', '');

            assert(after.type === 'object');
            assert.deepEqual(json(after), { test: '', additionalValue: 'before' });
        });

        it('should add required node with added trigger node', () => {
            const requiredDependency = new Draft07({
                type: 'object',
                properties: {
                    test: { type: 'string' },
                    additionalValue: { type: 'string' }
                },
                dependencies: {
                    test: ['additionalValue']
                }
            });
            const before = create<ObjectNode>(requiredDependency, {});
            assert.equal(before.children.length, 0);

            const [after] = set<ObjectNode>(requiredDependency, before, '/test', 'added');
            assert(after.type === 'object');
            assert.equal(after.children.length, 2);
            assert.deepEqual(json(after), { test: 'added', additionalValue: '' });
        });

        it('should add required node with added trigger when set by parent', () => {
            const requiredDependency = new Draft07({
                type: 'object',
                properties: {
                    test: { type: 'string' },
                    additionalValue: { type: 'string' }
                },
                dependencies: {
                    test: ['additionalValue']
                }
            });
            const before = create<ObjectNode>(requiredDependency, {});
            assert.equal(before.children.length, 0);

            const [after] = set<ObjectNode>(requiredDependency, before, '#', { test: 'added' });
            assert(after.type === 'object');
            assert.equal(after.children.length, 2);
            assert.deepEqual(json(after), { test: 'added', additionalValue: '' });
        });
    });

    describe('object if-then-else', () => {
        let conditional: Draft;
        beforeEach(() => {
            conditional = new Draft07({
                type: 'object',
                additionalProperties: false,
                properties: { test: { type: 'string' } },
                if: {
                    properties: {
                        test: { minLength: 10 }
                    }
                },
                then: {
                    required: ['thenValue'],
                    properties: {
                        thenValue: { description: 'then', type: 'string', default: 'from then' }
                    }
                },
                else: {
                    required: ['elseValue'],
                    properties: {
                        elseValue: { description: 'else', type: 'string', default: 'from else' }
                    }
                }
            });
        });

        it('should update conditional value', () => {
            const before = create<ObjectNode>(conditional, { test: 'select then' });
            assert.equal(before.children.length, 2);

            const [after] = set<ObjectNode>(conditional, before, '/thenValue', 'updated value');
            assert(after.type === 'object');
            assert.equal(after.children.length, 2);
            assert.deepEqual(json(after), { test: 'select then', thenValue: 'updated value' });
        });

        it('should change conditional value to "then" case', () => {
            const before = create<ObjectNode>(conditional, { test: '' });
            assert.equal(before.children.length, 2);
            assert.equal(before.children[1].schema.description, 'else');

            const [after] = set<ObjectNode>(conditional, before, '/test', 'select then');
            assert(after.type === 'object');

            assert.equal(after.children.length, 2);
            assert.equal(after.children[1].schema.description, 'then');
        });

        it('should change conditional value to "else" case', () => {
            const before = create<ObjectNode>(conditional, { test: 'selected then' });
            assert.equal(before.children.length, 2);
            assert.equal(before.children[1].schema.description, 'then');

            const [after] = set<ObjectNode>(conditional, before, '/test', '');
            assert(after.type === 'object');

            assert.equal(after.children.length, 2);
            assert.equal(after.children[1].schema.description, 'else');
        });

        it('should only remove "then"-schema on missing "else"', () => {
            const thenOnlySchema = new Draft07({
                type: 'object',
                additionalProperties: false,
                properties: { test: { type: 'string' } },
                if: {
                    properties: {
                        test: { minLength: 10 }
                    }
                },
                then: {
                    required: ['thenValue'],
                    properties: {
                        thenValue: { description: 'then', type: 'string', default: 'from then' }
                    }
                }
            });

            const before = create<ObjectNode>(thenOnlySchema, { test: 'selected then' });
            assert.equal(before.children.length, 2);
            assert.equal(before.children[1].schema.description, 'then');

            const [after] = set<ObjectNode>(thenOnlySchema, before, '/test', '');
            assert(after.type === 'object');

            assert.equal(after.children.length, 1);
        });

        it('should not add optional properties from selected then schema', () => {
            const thenOnlySchema = new Draft07({
                type: 'object',
                required: ['trigger'],
                properties: {
                    trigger: { type: 'boolean', default: false }
                },
                if: {
                    required: ['trigger'],
                    properties: {
                        trigger: { const: true }
                    }
                },
                then: {
                    properties: {
                        addition: { type: 'string' }
                    }
                }
            });

            const before = create<ObjectNode>(thenOnlySchema, { trigger: false });
            assert.equal(before.children.length, 1);

            const [after] = set<ObjectNode>(thenOnlySchema, before, '/trigger', true);
            assert(after.type === 'object');

            assert.equal(after.children.length, 1);
        });
    });

    describe('scenarios', () => {
        it('should not replace node of updated object', () => {
            const draft: Draft = new Draft07({
                type: 'object',
                required: ['addSchema'],
                properties: {
                    addSchema: { type: 'boolean', default: false },
                    additionalSchema: { type: 'string' },
                    secondSchema: { type: 'string' }
                },
                allOf: [
                    {
                        if: {
                            properties: {
                                addSchema: { type: 'boolean', const: true }
                            }
                        },
                        then: {
                            required: ['additionalSchema']
                        }
                    },
                    {
                        if: {
                            required: ['additionalSchema'],
                            properties: {
                                additionalSchema: { type: 'string', minLength: 1 }
                            }
                        },
                        then: {
                            required: ['secondSchema']
                        }
                    }
                ]
            });

            const before = create(draft, draft.getTemplate({ addSchema: true, additionalSchema: 'added' }));
            assert(before.type === 'object');
            const beforeString = json(before);

            const [after, changes] = set(draft, before, '', { addSchema: true, additionalSchema: 'updated' });
            assert(after.type === 'object');

            assert(before.id === after.id, 'should not have replaced root node');
            assert.deepEqual(json(before), beforeString, 'should not have modified previous state');
            assert(after.children[1].type === 'string');
            assert.equal(after.children[1].value, 'updated');
        });

        it('should not lose oneOf objects when setting a value', () => {
            const core: Draft = new Draft07({
                type: 'object',
                required: ['switch'],
                properties: {
                    switch: {
                        type: 'array',
                        minItems: 1,
                        default: [{ type: 'header', text: '' }],
                        items: {
                            oneOf: [
                                {
                                    id: 'header',
                                    type: 'object',
                                    properties: {
                                        type: { type: 'string', const: 'header', options: { hidden: true } },
                                        text: { type: 'string' }
                                    }
                                },
                                {
                                    id: 'paragraph',
                                    type: 'object',
                                    properties: {
                                        type: { type: 'string', const: 'paragraph', options: { hidden: true } },
                                        text: { type: 'string' }
                                    }
                                }
                            ]
                        }
                    }
                }
            });

            let state: any = create(core, core.getTemplate({}));
            [state] = set(core, state, '/switch/1', { type: 'paragraph', text: '' });
            assert(state.type !== 'error');
            [state] = set(core, state, '/switch/2', { type: 'header', text: '' });
            assert(state.type !== 'error');

            const list = get(state, '/switch') as ArrayNode;
            assert.equal(list.children.length, 3);

            [state] = set(core, state, '/switch/0/text', 'first item updated');
            assert(state.type !== 'error');
            assert.deepEqual(json(state), {
                switch: [
                    { type: 'header', text: 'first item updated' },
                    { type: 'paragraph', text: '' },
                    { type: 'header', text: '' }
                ]
            });

            const updatedList = get(state, '/switch') as ArrayNode;
            assert.equal(updatedList.children.length, 3);
        });
    });
});
