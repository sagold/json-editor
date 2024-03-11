import { strict as assert } from 'assert';
import { HeadlessEditor, Plugin } from '../../src/HeadlessEditor';
import { JsonSchema } from '../../src/types';

describe('HeadlessEditor', () => {
    let schema: JsonSchema;
    beforeEach(() => {
        schema = { type: "object", properties: { title: { type: "string" } } };
    })

    describe("plugins", () => {
        let plugin: Plugin<{ id?: string }>;
        beforeEach(() => {
            plugin = (_, options) => {
                return {
                    id: options?.id || "test-plugin",
                    onEvent() {}
                };
            };
        })

        it('should add plugin to plugins list', () => {
            const editor = new HeadlessEditor({ schema, plugins: [plugin] });
            const instance = editor.findPlugin("test-plugin");

            assert(instance);
        });

        it('should add plugin to plugins list', () => {
            const editor = new HeadlessEditor({ schema, plugins: [plugin] });
            const instance = editor.findPlugin("test-plugin");

            assert(instance);
        });
    });
});
