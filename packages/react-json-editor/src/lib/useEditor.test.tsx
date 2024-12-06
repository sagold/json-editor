import { isJsonError, JsonSchema, ObjectNode, StringNode, getNode } from 'headless-json-editor';
import { renderHook, act, render } from '@testing-library/react';
import { strict as assert } from 'assert';
import { useEditor, UseEditorOptions } from './useEditor';
import { Editor } from './Editor';
import { WidgetPlugin } from './decorators';

describe('useEditor', () => {
    it('should return state and editor instance', () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                schema: { type: 'object', properties: { title: { type: 'string' } } },
                data: { title: 'test-title' }
            }
        });

        const [state, editor] = result.current;

        assert.equal(state.type, 'object');
        assert.equal(typeof editor.draft.getSchema, 'function');
    });

    it('should update state when input data changes', () => {
        const data = { title: 'test-title' };
        const schema: JsonSchema = { type: 'object', properties: { title: { type: 'string' } } };
        const { result, rerender } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: { schema, data }
        });

        const [state, editor] = result.current;
        const titleNode = getNode<StringNode>(state, '/title');
        rerender({ schema, data: { title: 'updated title' } });

        const [stateAfter, editorAfter] = result.current;
        const titleNodeAfter = getNode<StringNode>(stateAfter, '/title');

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, 'should not recreate editor when data has changed');
        assert(state !== stateAfter);
        assert.equal(titleNode.value, 'test-title');
        assert.equal(titleNodeAfter.value, 'updated title');
    });

    it('should update state when input schema changes', () => {
        const data = { title: 'test-title' };
        const schema: JsonSchema = { type: 'object', properties: { title: { type: 'string' } } };
        const { result, rerender } = renderHook(
            (settings: UseEditorOptions<object>) => useEditor<object, ObjectNode>(settings),
            {
                initialProps: { schema, data }
            }
        );
        const [state, editor] = result.current;
        const titleNode = getNode<StringNode>(state, '/title');

        rerender({
            schema: {
                type: 'object',
                required: ['title', 'subtitle'],
                properties: {
                    title: { type: 'string', minLength: 1 },
                    subtitle: { type: 'string', minLength: 1, default: 'subtitle' }
                }
            },
            data
        });

        const [stateAfter, editorAfter] = result.current;
        const titleNodeAfter = getNode<StringNode>(stateAfter, '/title');

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, 'should not recreate editor when schema has changed');
        // assert(state !== stateAfter);
        assert.equal(state.children.length, 1);
        assert.equal(stateAfter.children.length, 2, 'should have updated data after schema change');
        assert.equal(titleNode.schema.minLength, undefined);
        assert.equal(titleNodeAfter.schema.minLength, 1);
    });

    it('should recreated editor when cacheKey changes', async () => {
        const props: UseEditorOptions = {
            data: { title: 'test-title' },
            schema: { type: 'object', properties: { title: { type: 'string' } } }
        };
        const { result, rerender } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: props
        });

        const editor = result.current[1];
        rerender({ ...props, cacheKey: 123 });
        const editorAfter = result.current[1];
        assert.notEqual(editor, editorAfter);
    });

    it('should add internal onChangePlugin', () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: 'test-title' },
                schema: { type: 'object', properties: { title: { type: 'string' } } }
            }
        });

        const editor = result.current[1];
        assert(editor.plugins.find((p) => p.id === 'InternalOnChange'));
    });

    it('should return latest list of errors', () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: 'test-title' },
                schema: { type: 'object', properties: { title: { type: 'string', minLength: 2 } } }
            }
        });
        assert.equal(result.current[1].getErrors().length, 0);

        act(() => {
            const editor = result.current[1];
            editor.setValue('#/title', 'X');
        });

        const [root, editor] = result.current;
        const titleNode = getNode(root, '#/title');
        assert.equal(titleNode.type, 'string');
        assert.equal(titleNode.value, 'X');
        assert.equal(editor.getErrors().length, 1);
    });

    it('should not recreate editor using setValue', () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: 'test-title' },
                schema: { type: 'object', properties: { title: { type: 'string', minLength: 2 } } }
            }
        });
        const editorBefore = result.current[1];

        act(() => {
            editorBefore.setValue('#/title', 'X');
        });

        const editorAfter = result.current[1];
        assert.equal(editorAfter.getData().title, 'X');
        assert.equal(editorBefore.getErrors().length, 1);
        assert(editorBefore === editorAfter);
    });

    it('should rerender after validation', () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: '' },
                schema: { type: 'object', properties: { title: { type: 'string', minLength: 2 } } },
                validate: false
            }
        });
        assert.equal(result.current[1].getErrors().length, 0);

        act(() => {
            result.current[1].validate();
        });

        assert.equal(result.current[1].getErrors().length, 1);
    });

    it('should destroy editor on demount', () => {
        let currentEditor: undefined | Editor = undefined;
        function Form() {
            const [root, editor] = useEditor({
                schema: { type: 'object' },
                widgets: [{ id: 'dummy', use: () => true, Widget: () => <div /> }] as WidgetPlugin[]
            });

            const Widget = editor.getWidget(root);
            currentEditor = editor;
            return <Widget node={root} editor={editor} />;
        }
        const { rerender } = render(<Form />);
        assert(currentEditor != null);
        currentEditor = currentEditor as Editor;

        rerender(<div />);

        assert(currentEditor != null);
        assert(currentEditor.plugins == null);
        assert(currentEditor.root == null);
    });

    describe('options: extendDefaults', () => {
        it('should set `extendDefault` in draft to false', () => {
            const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
                initialProps: {
                    extendDefaults: false,
                    schema: { type: 'array' }
                }
            });
            const [state, editor] = result.current;
            assert.equal(editor.draft.config.templateDefaultOptions?.extendDefaults, false);
        });

        it('should set `extendDefault` in draft to true', () => {
            const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
                initialProps: {
                    extendDefaults: true,
                    schema: { type: 'array' }
                }
            });
            const [state, editor] = result.current;
            assert.equal(editor.draft.config.templateDefaultOptions?.extendDefaults, true);
        });

        it('should not add minimum required array items if default-value is []', () => {
            const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
                initialProps: {
                    schema: { type: 'array', minItems: 1, default: [], items: { type: 'string' } }
                }
            });

            const [state] = result.current;

            assert.equal(state.type, 'array');
            assert.equal(state.children.length, 0);
        });

        it('should not add minimum required array items if default-value is [] (2)', () => {
            const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
                initialProps: {
                    schema: {
                        required: ['list'],
                        type: 'object',
                        properties: {
                            list: {
                                type: 'array',
                                minItems: 1,
                                default: [],
                                items: { type: 'string' }
                            }
                        }
                    }
                }
            });

            const [state] = result.current;
            const list = getNode(state, '/list');

            assert.equal(list.type, 'array');
            assert.equal(list.children.length, 0);
        });
    });
});
