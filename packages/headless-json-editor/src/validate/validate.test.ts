import { createNode } from '../node/createNode';
import { JsonError, isJsonError, SchemaNode, extendDraft, JsonSchemaValidator } from 'json-schema-library';
import { getNode } from '../node/getNode';
import { setValue } from '../transform/setValue';
import { strict as assert } from 'assert';
import { updateErrors as validate } from '../validate/updateErrors';
import { compileSchema, jsonEditorDraft } from '../compileSchema';
import { Node } from '../types';

describe('validate', () => {
    let schemaNode: SchemaNode;

    beforeEach(() => {
        schemaNode = compileSchema({
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
        const root = createNode(schemaNode, { title: '', caption: 'c' });

        validate(root);

        const titleNode = getNode(root, '/title');

        assert(!isJsonError(titleNode));
        assert.equal(titleNode.errors.length, 1);
    });

    it('should update property errors', () => {
        const root = createNode(schemaNode, { title: '', caption: 'c' });

        validate(root);

        assert(root.type === 'array' || root.type === 'object');
        const [after] = setValue(root, '/title', 'minlength');
        assert(after.type !== 'error');

        validate(after);

        const titleNode = getNode(after, '/title');

        assert(!isJsonError(titleNode));
        assert.equal(titleNode.errors.length, 0);
    });

    it('should validate from pointer only', () => {
        const root = createNode(schemaNode, { title: '', caption: '' });

        validate(getNode(root, '/caption') as Node);

        const caption = getNode(root, '/caption');
        assert(!isJsonError(caption));
        assert.equal(caption.errors.length, 1, 'should have set error on caption');

        const title = getNode(root, '/title');
        assert(!isJsonError(title));
        assert.equal(title.errors.length, 0, 'should not have validated title');
    });

    describe('async validation', () => {
        let async: SchemaNode;
        // @ts-ignore
        const validator: JsonSchemaValidator = ({ node, value, pointer }) => {
            console.log('return error');
            const error: JsonError = {
                type: 'error',
                code: 'async-error',
                message: 'an async error',
                name: 'AsyncError',
                data: {
                    pointer: pointer ?? '',
                    schema: node.schema,
                    value
                }
            };
            return Promise.resolve(error);
        };

        beforeEach(() => {
            async = compileSchema(
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
                    drafts: [
                        extendDraft(jsonEditorDraft, {
                            formats: {
                                async: validator
                            }
                        })
                    ]
                }
            );
        });

        it('should have async format validator registered', () => {
            const root = createNode(async, { title: '', caption: '' });
            assert(root.schemaNode.context.formats.async);
        });

        it('should perform async validation', async () => {
            const root = createNode(async, { title: '', caption: '' });

            await validate(root);

            const title = getNode(root, '/title');
            assert(!isJsonError(title));
            assert.equal(title.errors?.[0]?.code, 'async-error');
        });

        it('should assign validation error once only', async () => {
            const root = createNode(async, { title: '', caption: '' });

            validate(root);
            await validate(root);

            const title = getNode(root, '/title');
            assert(!isJsonError(title));
            assert.equal(title.errors.length, 1);
        });
    });
});
