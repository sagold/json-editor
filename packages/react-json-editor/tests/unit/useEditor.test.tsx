import { renderHook, act } from '@testing-library/react';
import { useEditor, UseEditorOptions } from "../../src/lib/useEditor";
import { strict as assert } from 'assert';
import { isJsonError, JsonSchema, ObjectNode, StringNode, getNode } from 'headless-json-editor';

describe('useEditor', () => {
    it("should return state and editor instance", () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                schema: { type: "object", properties: { title: { type: "string" } } },
                data: { title: "test-title" }
            }
        });

        const [state, editor] = result.current;

        assert.equal(state.type, "object");
        assert.equal(typeof editor.draft.getSchema, "function");
    });

    it("should update state when input data changes", () => {
        const data = { title: "test-title" };
        const schema: JsonSchema = { type: "object", properties: { title: { type: "string" } } };
        const { result, rerender } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: { schema, data }
        });

        const [state, editor] = result.current;
        const titleNode = getNode<StringNode>(state, "/title");
        rerender({ schema, data: { title: "updated title" } });

        const [stateAfter, editorAfter] = result.current;
        const titleNodeAfter = getNode<StringNode>(stateAfter, "/title");

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, "should not recreate editor when data has changed");
        assert(state !== stateAfter);
        assert.equal(titleNode.value, "test-title");
        assert.equal(titleNodeAfter.value, "updated title");
    });

    it("should update state when input schema changes", () => {
        const data = { title: "test-title" };
        const schema: JsonSchema = { type: "object", properties: { title: { type: "string" } } };
        const { result, rerender } = renderHook((settings: UseEditorOptions<object>) => useEditor<object, ObjectNode>(settings), {
            initialProps: { schema, data }
        });
        const [state, editor] = result.current;
        const titleNode = getNode<StringNode>(state, "/title");

        rerender({
            schema: {
                type: "object", required: ["title", "subtitle"],
                properties: {
                    title: { type: "string", minLength: 1 },
                    subtitle: { type: "string", minLength: 1, default: "subtitle" }
                }
            }, data
        });

        const [stateAfter, editorAfter] = result.current;
        const titleNodeAfter = getNode<StringNode>(stateAfter, "/title");

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, "should not recreate editor when schema has changed");
        // assert(state !== stateAfter);
        assert.equal(state.children.length, 1);
        assert.equal(stateAfter.children.length, 2, "should have updated data after schema change");
        assert.equal(titleNode.schema.minLength, undefined);
        assert.equal(titleNodeAfter.schema.minLength, 1);
    });

    it("should recreated editor when cacheKey changes", async () => {
        const props: UseEditorOptions = {
            data: { title: "test-title" },
            schema: { type: "object", properties: { title: { type: "string" } } }
        }
        const { result, rerender } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: props
        });

        const editor = result.current[1];
        rerender({ ...props, cacheKey: 123 });
        const editorAfter = result.current[1];
        assert.notEqual(editor, editorAfter);
    });

    it("should add internal onChangePlugin", () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: "test-title" },
                schema: { type: "object", properties: { title: { type: "string" } } }
            }
        });

        const editor = result.current[1];
        assert(editor.plugins.find(p => p.id === "InternalOnChange"));
    });

    it("should return latest list of errors", () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: "test-title" },
                schema: { type: "object", properties: { title: { type: "string", minLength: 2 } } }
            }
        });
        assert.equal(result.current[1].getErrors().length, 0);

        act(() => {
            const editor = result.current[1]
            editor.setValue("#/title", "X");
        });

        const [root, editor] = result.current;
        const titleNode = getNode(root, "#/title");
        assert.equal(titleNode.type, "string");
        assert.equal(titleNode.value, "X");
        assert.equal(editor.getErrors().length, 1);
    });

    it("should not recreate editor using setValue", () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: "test-title" },
                schema: { type: "object", properties: { title: { type: "string", minLength: 2 } } }
            }
        });
        const editorBefore = result.current[1];

        act(() => {
            editorBefore.setValue("#/title", "X");
        });

        const editorAfter = result.current[1];
        assert.equal(editorAfter.getData().title, "X");
        assert.equal(editorBefore.getErrors().length, 1);
        assert(editorBefore === editorAfter);
    });

    it("should update after validation", () => {
        const { result } = renderHook((settings: UseEditorOptions) => useEditor(settings), {
            initialProps: {
                data: { title: "" },
                schema: { type: "object", properties: { title: { type: "string", minLength: 2 } } },
                validate: false
            }
        });
        assert.equal(result.current[1].getErrors().length, 0);

        act(() => {
            result.current[1].validate();
        });

        assert.equal(result.current[1].getErrors().length, 1);
    });
});

