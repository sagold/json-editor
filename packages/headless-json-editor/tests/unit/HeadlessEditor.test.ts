import { strict as assert } from 'assert';
import { HeadlessEditor, Plugin } from '../../src/HeadlessEditor';
import { JsonSchema } from '../../src/types';
import { setValue } from '../../src/transform/setValue';

describe('HeadlessEditor', () => {
    let schema: JsonSchema;
    beforeEach(() => {
        schema = { type: "object", properties: { title: { type: "string" } } };
    });

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

        it("should validate changes made by plugin", () => {
            const change: Plugin = ({ draft }) => ({
                id: "change",
                onEvent: (root, event) => {
                    if (event.type === "update") {
                        const result = setValue(draft, root, "#/title", "X");
                        if (result.length === 2) {
                            return result;
                        }
                    }
                    return undefined;
                }
            });
            const editor = new HeadlessEditor({
                data: { title: "valid" },
                schema: { type: "object", properties: { title: { type: "string", minLength: 2 } } },
                plugins: [change]
            });
            assert.equal(editor.getErrors().length, 0);

            editor.setValue("#/title", "still-valid");

            assert.equal(editor.getData().title, "X", "Test-plugin should have changed title");
            assert.equal(editor.getErrors().length, 1);
        });
    });
});
