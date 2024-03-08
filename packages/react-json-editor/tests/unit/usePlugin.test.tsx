import { renderHook } from '@testing-library/react';
import { strict as assert } from 'assert';
import { Plugin, PluginInstance } from '../../../headless-json-editor/src/plugins/Plugin';
import { JsonSchema } from '../../../headless-json-editor/src/types';
import { useJsonEditor, UseJsonEditorOptions } from "../../src/lib/useJsonEditor";
import { usePlugin } from '../../src/lib/usePlugin';

type Options = Record<string, unknown>;

describe('usePlugin', () => {
    let schema: JsonSchema;
    let data: object;
    let MyPlugin: Plugin;
    beforeEach(() => {
        schema = { type: "object", properties: { title: { type: "string" } } };
        data = { title: "test-title" };
        MyPlugin = (he, options) => {
            const pluginInstance: PluginInstance = {
                id: "test-plugin",
                test() {},
                onEvent(root, event) {
                    if (event.type === "done" && options.callback) {
                        // @ts-ignore
                        options.callback(event);
                    }
                }
            };
            return pluginInstance;
        }
    });

    it("should register plugin to editor", () => {
        const { result } = renderHook(
            ({ pluginOptions, ...settings }: UseJsonEditorOptions & { pluginOptions: Options }) => {
                const editor = useJsonEditor(settings)[1];
                const plugin = usePlugin(editor, MyPlugin, pluginOptions);
                return { editor, plugin };
            },
            {
                initialProps: { schema, data, pluginOptions: {} }
            });

        const { plugin, editor } = result.current;
        assert(plugin);
        assert(editor.plugins.includes(plugin));
    });

    it("should not recreate plugin on rerender", () => {
        const { result, rerender } = renderHook(
            ({ pluginOptions, ...settings }: UseJsonEditorOptions & { pluginOptions: Options }) => {
                const editor = useJsonEditor(settings)[1];
                const plugin = usePlugin(editor, MyPlugin, pluginOptions);
                return { editor, plugin };
            },
            {
                initialProps: { schema, data, pluginOptions: {} }
            });

        const { plugin, editor } = result.current;
        rerender({ schema, data, pluginOptions: {} });
        assert(plugin);
        assert(plugin === result.current.plugin);
        assert(editor.plugins.includes(plugin));
    });

    it("should recreate plugin when options change", () => {
        const { result, rerender } = renderHook(
            ({ pluginOptions, ...settings }: UseJsonEditorOptions & { pluginOptions: Options }) => {
                const editor = useJsonEditor(settings)[1];
                const plugin = usePlugin(editor, MyPlugin, pluginOptions);
                return { editor, plugin };
            },
            {
                initialProps: {
                    schema, data, pluginOptions: {
                        id: "test-1"
                    }
                }
            });

        const { plugin, editor } = result.current;
        rerender({
            schema, data, pluginOptions: {
                id: "test-2"
            }
        });
        const newPlugin = result.current.plugin;
        assert(plugin !== result.current.plugin);
        assert(plugin);
        assert(!editor.plugins.includes(plugin));
        assert(newPlugin);
        assert(editor.plugins.includes(newPlugin));
    });
});
