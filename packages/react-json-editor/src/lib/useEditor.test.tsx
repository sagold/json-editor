import { isJsonError, JsonSchema, isParentNode, isValueNode } from 'headless-json-editor';
import { renderHook, act, render } from '@testing-library/react';
import { strict as assert } from 'assert';
import { useEditor, UseEditorOptions } from './useEditor';
import { Editor } from './Editor';
import { WidgetPlugin } from './decorators';
import { StrictMode } from 'react';

describe('useEditor', () => {
    it('should return state and editor instance', () => {
        const options: UseEditorOptions = {
            schema: { type: 'object', properties: { title: { type: 'string' } } },
            data: { title: 'test-title' }
        };

        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: options
        });

        assert(result.current != null, 'should have returned instance on final render');
        assert.equal(typeof result.current.draft.getSchema, 'function');
    });

    it('should update state when input data changes', () => {
        const data = { title: 'test-title' };
        const schema: JsonSchema = { type: 'object', properties: { title: { type: 'string' } } };
        const { result, rerender } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: { schema, data }
        });

        const editor = result.current;
        assert(editor != null);
        const state = editor.getNode();
        const titleNode = editor.getNode('/title');
        rerender({ schema, data: { title: 'updated title' } });

        const editorAfter = result.current;
        assert(editorAfter != null);
        const stateAfter = editorAfter.getNode();
        const titleNodeAfter = editor.getNode('/title');

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, 'should not recreate editor when data has changed');
        assert(state !== stateAfter);
        assert(isValueNode(titleNode) && isValueNode(titleNodeAfter));
        assert.equal(titleNode.value, 'test-title');
        assert.equal(titleNodeAfter.value, 'updated title');
    });

    it('should update state when input schema changes', () => {
        const data = { title: 'test-title' };
        const schema: JsonSchema = { type: 'object', properties: { title: { type: 'string' } } };
        const { result, rerender } = renderHook((settings: UseEditorOptions<object>) => useEditor<object>(settings), {
            initialProps: { schema, data }
        });
        const editor = result.current;
        assert(editor);
        const state = editor.getNode();
        assert(isParentNode(state));
        const titleNode = editor.getNode('/title');

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

        const editorAfter = result.current;
        assert(editorAfter);
        const stateAfter = editor.getNode();
        assert(isParentNode(stateAfter));
        const titleNodeAfter = editor.getNode('/title');

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, 'should not recreate editor when schema has changed');
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
        const editor = result.current;

        rerender({ ...props, cacheKey: 123 });

        const editorAfter = result.current;
        assert(editor && editorAfter);
        assert.notEqual(editor, editorAfter);
        assert.notEqual(editor.id, editorAfter.id);
    });

    it('should add internal onChangePlugin', () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: 'test-title' },
                schema: { type: 'object', properties: { title: { type: 'string' } } }
            }
        });

        const editor = result.current;
        assert(editor);
        assert(editor.plugins.find((p) => p.id === 'InternalOnChange'));
    });

    it('should return latest list of errors', () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: 'test-title' },
                schema: { type: 'object', properties: { title: { type: 'string', minLength: 2 } } }
            }
        });
        const editor = result.current;
        assert(editor);
        assert.equal(editor.getErrors().length, 0);

        act(() => {
            editor.setValue('#/title', 'X');
        });

        const editorAfter = result.current;
        assert(editorAfter);
        const titleNode = editorAfter.getNode('#/title');
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
        const editorBefore = result.current;
        assert(editorBefore);

        act(() => {
            editorBefore.setValue('#/title', 'X');
        });

        const editorAfter = result.current;
        assert(editorAfter);
        assert.equal(editorAfter.getData().title, 'X');
        assert.equal(editorBefore.getErrors().length, 1);
        assert(editorBefore === editorAfter);
    });

    it('should rerender after validation', () => {
        const renderCalls: (Editor | null)[] = [];
        const options: UseEditorOptions = {
            data: { title: '' },
            schema: { type: 'object', properties: { title: { type: 'string', minLength: 2 } } },
            validate: false
        };
        function Form() {
            const editor = useEditor(options);
            renderCalls.push(editor);
            return <div>{editor?.id}</div>;
        }

        render(<Form />);
        const editor = renderCalls[renderCalls.length - 1];
        assert(editor);
        assert.equal(editor.getErrors().length, 0);
        renderCalls.length = 0;

        act(() => {
            editor.validate();
        });

        assert.equal(renderCalls.length, 1);
        const editorAfter = renderCalls[renderCalls.length - 1];
        assert.equal(editorAfter?.getErrors().length, 1);
    });

    describe('destroy', () => {
        it('should destroy editor on unmount', () => {
            let currentEditor: null | Editor = null;
            function Form() {
                const editor = useEditor({
                    schema: { type: 'object' },
                    widgets: [{ id: 'dummy', use: () => true, Widget: () => <div /> }] as WidgetPlugin[]
                });
                currentEditor = editor;
                if (editor == null) {
                    return null;
                }
                const root = editor.getNode();
                const Widget = editor.getWidget(root);
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

        it('should call destroy for each created instance in StrictMode', () => {
            const createCalls: Date[] = [];
            const destroyCalls: Date[] = [];
            function Form() {
                const editor = useEditor({
                    schema: { type: 'object' },
                    plugins: [
                        () => {
                            createCalls.push(new Date());
                            return {
                                id: 'spy',
                                onEvent() {},
                                onDestroy() {
                                    destroyCalls.push(new Date());
                                }
                            };
                        }
                    ],
                    widgets: [{ id: 'dummy', use: () => true, Widget: () => <div /> }] as WidgetPlugin[]
                });
                if (editor == null) {
                    return null;
                }
                const root = editor.getNode();
                const Widget = editor.getWidget(root);
                return <Widget node={root} editor={editor} />;
            }

            const { rerender } = render(
                <StrictMode>
                    <Form />
                </StrictMode>
            );
            rerender(
                <StrictMode>
                    <div />
                </StrictMode>
            );

            // console.log(createCalls, destroyCalls);
            assert.equal(createCalls.length, destroyCalls.length);
        });
    });

    describe('options: extendDefaults', () => {
        it('should set `extendDefault` in draft to false', () => {
            const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
                initialProps: {
                    extendDefaults: false,
                    schema: { type: 'array' }
                }
            });
            const editor = result.current;
            assert.equal(editor?.draft.config.templateDefaultOptions?.extendDefaults, false);
        });

        it('should set `extendDefault` in draft to true', () => {
            const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
                initialProps: {
                    extendDefaults: true,
                    schema: { type: 'array' }
                }
            });

            const editor = result.current;
            assert.equal(editor?.draft.config.templateDefaultOptions?.extendDefaults, true);
        });

        it('should not add minimum required array items if default-value is []', () => {
            const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
                initialProps: {
                    schema: { type: 'array', minItems: 1, default: [], items: { type: 'string' } }
                }
            });

            const state = result.current?.getNode();
            assert.equal(state?.type, 'array');
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

            const list = result.current?.getNode('/list');
            assert.equal(list?.type, 'array');
            assert.equal(list.children.length, 0);
        });
    });
});
