import { Draft07, Draft, JsonValidator, JsonError } from 'json-schema-library';
import { strict as assert } from 'assert';
import { create } from '../../../src/node/create';
import { get } from '../../../src/node/get';
import { set } from '../../../src/transform/set';
import { updateErrors as validate } from '../../../src/validate/updateErrors';

describe('validate', () => {
    let core: Draft;

    beforeEach(() => {
        core = new Draft07({
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: 1
                },
                caption: {
                    type: 'string',
                    minLength: 1
                }
            }
        });
    });

    it('should add property errors', () => {
        const root = create(core, { title: '', caption: 'c' });

        validate(core, root);

        const titleNode = get(root, '/title');
        assert.equal(titleNode.errors.length, 1);
    });

    it('should update property errors', () => {
        const root = create(core, { title: '', caption: 'c' });

        validate(core, root);

        assert(root.type === 'array' || root.type === 'object');
        const [after] = set(core, root, '/title', 'minlength');
        assert(after.type !== 'error');

        validate(core, after);

        const titleNode = get(after, '/title');
        assert.equal(titleNode.errors.length, 0);
    });

    it('should validate from pointer only', () => {
        const root = create(core, { title: '', caption: '' });

        validate(core, root, '/caption');

        assert.equal(get(root, '/caption').errors.length, 1, 'should have set error on caption');
        assert.equal(get(root, '/title').errors.length, 0, 'should not have validated title');
    });

    describe('async validation', () => {
        let async: Draft;
        // @ts-ignore
        const validator: JsonValidator = (core, schema, value, pointer) => {
            const error: JsonError = {
                type: 'error',
                code: 'async-error',
                message: 'an async error',
                name: 'AsyncError',
                data: { pointer }
            };
            return Promise.resolve(error);
        };

        beforeEach(() => {
            async = new Draft07(
                {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            format: 'async'
                        },
                        caption: {
                            type: 'string'
                        }
                    }
                },
                {
                    validateFormat: {
                        async: validator
                    }
                }
            );
        });

        it('should perform async validation', async () => {
            const root = create(async, { title: '', caption: '' });

            await validate(async, root);

            assert.equal(get(root, '/title').errors?.[0]?.code, 'async-error');
        });

        it('should assign validation error once only', async () => {
            const root = create(async, { title: '', caption: '' });

            validate(async, root);
            await validate(async, root);

            assert.equal(get(root, '/title').errors.length, 1);
        });
    });
});
