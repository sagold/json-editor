import { Plugin, PluginEvent, JsonSchema } from 'headless-json-editor';
import { renderHook } from '@testing-library/react';
import { strict as assert } from 'assert';
import { useEditor, UseEditorOptions } from './useEditor';
import { useEditorPlugin } from './useEditorPlugin';

type PluginOptions = { id?: string; callback?: (event: PluginEvent) => void };
type PluginSignature = {
    /** comment for additional test-function */
    test: () => string;
};

describe('useEditorPlugin', () => {
    let schema: JsonSchema;
    let data: object;
    let MyPlugin: Plugin<PluginOptions, PluginSignature>;
    beforeEach(() => {
        schema = { type: 'object', properties: { title: { type: 'string' } } };
        data = { title: 'test-title' };
        MyPlugin = (he, options) => ({
            id: 'test-plugin',
            test: () => 'hello',
            // onDestroy: () => console.log('destroy plugin', 'test-plugin'),
            onEvent(root, event) {
                if (event.type === 'done' && options.callback) {
                    // @ts-ignore
                    options.callback(event);
                }
            }
        });
    });

    it('should register plugin to editor', () => {
        const { result } = renderHook(
            ({ pluginOptions, ...settings }: UseEditorOptions & { pluginOptions: PluginOptions }) => {
                const editor = useEditor(settings);
                const plugin = useEditorPlugin(editor, MyPlugin, pluginOptions);
                plugin?.test();
                return { editor, plugin };
            },
            { initialProps: { schema, data, pluginOptions: {} } }
        );

        const { plugin, editor } = result.current;
        assert(plugin && editor);
        assert(editor.plugins.includes(plugin));
    });

    it('should not recreate plugin on rerender', () => {
        const options = { schema, data, pluginOptions: {} };
        const { result, rerender } = renderHook(
            ({ pluginOptions, ...settings }: UseEditorOptions & { pluginOptions: PluginOptions }) => {
                const editor = useEditor(settings);
                const plugin = useEditorPlugin(editor, MyPlugin, pluginOptions);
                return { editor, plugin };
            },
            { initialProps: options }
        );

        const { plugin, editor } = result.current;
        assert(plugin && editor);
        rerender(options);

        assert(plugin === result.current.plugin);
        assert(editor.plugins.includes(plugin));
    });

    it('should recreate plugin when options change', () => {
        const { result, rerender } = renderHook(
            ({ pluginOptions, ...settings }: UseEditorOptions & { pluginOptions: PluginOptions }) => {
                const editor = useEditor(settings);
                const plugin = useEditorPlugin(editor, MyPlugin, pluginOptions);
                return { editor, plugin };
            },
            {
                initialProps: {
                    schema,
                    data,
                    pluginOptions: {
                        id: 'test-1'
                    }
                }
            }
        );

        const { plugin, editor } = result.current;
        rerender({
            schema,
            data,
            pluginOptions: {
                id: 'test-2'
            }
        });
        const newPlugin = result.current.plugin;
        assert(plugin !== result.current.plugin);
        assert(plugin && editor);
        assert(!editor.plugins.includes(plugin));
        assert(newPlugin);
        assert(editor.plugins.includes(newPlugin));
    });
});
