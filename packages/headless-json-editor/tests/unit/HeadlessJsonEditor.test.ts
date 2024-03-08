import { strict as assert } from 'assert';
import { HeadlessJsonEditor } from '../../src/HeadlessJsonEditor';
import { JsonSchema } from '../../src/types';
import { Plugin } from "../../src/plugins/Plugin";

describe('HeadlessJsonEditor', () => {
    let schema: JsonSchema;
    beforeEach(() => {
        schema = { type: "object", properties: { title: { type: "string" } } };
    })

    describe("plugins", () => {
        let plugin: Plugin<{ id?: string }>;
        beforeEach(() => {
            plugin = (_, options) => {
                return {
                    id: options.id || "test-plugin",
                    onEvent() {}
                };
            };
        })

        it('should add plugin to plugins list', () => {
            const editor = new HeadlessJsonEditor({ schema, plugins: [plugin] });
            const instance = editor.plugin("test-plugin");

            assert(instance);
        });

        it('should pass options to plugin constructor', () => {
            const editor = new HeadlessJsonEditor({ schema, plugins: [{ plugin, options: { id: "custom-id" } }] });
            const instance = editor.plugin("custom-id");

            assert(instance);
        });
    });
});
