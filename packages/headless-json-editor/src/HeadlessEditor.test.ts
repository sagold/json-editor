import { HeadlessEditor, Plugin } from './HeadlessEditor';
import { JsonSchema } from './types';
import { setValue } from './transform/setValue';
import { strict as assert } from 'assert';

describe('HeadlessEditor', () => {
    let schema: JsonSchema;
    beforeEach(() => {
        schema = { type: 'object', properties: { title: { type: 'string' } } };
    });

    it('should remove references on destroy', () => {
        const editor = new HeadlessEditor({ schema, extendDefaults: false });
        assert.notEqual(editor.root, null);
        assert.notEqual(editor.plugins, null);
        assert.notEqual(editor.schemaNode, null);
        assert.notEqual(editor.options, null);

        editor.destroy();

        assert.equal(editor.root, null);
        assert.equal(editor.plugins, null);
        assert.equal(editor.schemaNode, null);
        assert.equal(editor.options, null);
    });

    describe('options', () => {
        it('should set `extendDefault` in draft', () => {
            let editor = new HeadlessEditor({ schema, extendDefaults: false });
            assert.equal(editor.schemaNode.context.getDataDefaultOptions?.extendDefaults, false);

            editor = new HeadlessEditor({ schema, extendDefaults: true });
            assert.equal(editor.schemaNode.context.getDataDefaultOptions?.extendDefaults, true);

            editor = new HeadlessEditor({ schema, extendDefaults: false, draftConfig: {} });
            assert.equal(editor.schemaNode.context.getDataDefaultOptions?.extendDefaults, false);
        });
    });

    describe('file', () => {
        let schema: JsonSchema;
        let file: File;
        beforeEach(() => {
            schema = { type: 'object', properties: { file: { type: ['string', 'object'], format: 'file' } } };
            file = new File([], 'testfile.pdf');
        });

        it('should keep file-instance in create', () => {
            const editor = new HeadlessEditor({ schema, data: { file } });
            const data = editor.getData();
            assert.equal(data.file, file);
        });

        it('should keep file-instance on setData', () => {
            const editor = new HeadlessEditor({ schema, data: {} });
            editor.setData({ file });
            const data = editor.getData();
            assert.equal(data.file, file);
        });

        it('should keep file-instance on setValue', () => {
            const editor = new HeadlessEditor({ schema, data: {} });
            editor.setValue('/file', file);
            const data = editor.getData();
            assert.equal(data.file, file);
        });

        it('should keep file-instance on setSchema', () => {
            const editor = new HeadlessEditor({ schema, data: { file } });
            editor.setSchema({
                type: 'object',
                properties: { title: { type: 'string' }, file: { type: ['string', 'object'], format: 'file' } }
            });
            const data = editor.getData();
            assert.equal(data.file, file);
        });

        it('should replace file-instance using setValue', () => {
            const editor = new HeadlessEditor({ schema, data: { file } });
            const newFile = new File([], 'new-testfile.pdf');
            editor.setValue('/file', newFile);
            const data = editor.getData();
            assert.equal(data.file, newFile);
        });
    });

    describe('plugins', () => {
        let plugin: Plugin<{ id?: string }>;
        beforeEach(() => {
            plugin = (_, options) => {
                return {
                    id: options?.id || 'test-plugin',
                    onEvent() {}
                };
            };
        });

        it('should add plugin to plugins list', () => {
            const editor = new HeadlessEditor({ schema, plugins: [plugin] });
            const instance = editor.findPlugin('test-plugin');
            assert(instance);
        });

        it('should add plugin to plugins list', () => {
            const editor = new HeadlessEditor({ schema, plugins: [plugin] });
            const instance = editor.findPlugin('test-plugin');
            assert(instance);
        });

        it('should validate changes made by plugin', () => {
            const change: Plugin = () => ({
                id: 'change',
                onEvent: (root, event) => {
                    if (event.type === 'update') {
                        const result = setValue(root, '#/title', 'X');
                        if (result.length === 2) {
                            return result;
                        }
                    }
                    return undefined;
                }
            });
            const editor = new HeadlessEditor({
                data: { title: 'valid' },
                schema: { type: 'object', properties: { title: { type: 'string', minLength: 2 } } },
                plugins: [change]
            });
            assert.equal(editor.getErrors().length, 0);

            editor.setValue('#/title', 'still-valid');

            assert.equal(editor.getData().title, 'X', 'Test-plugin should have changed title');
            assert.equal(editor.getErrors().length, 1);
        });
    });
});
