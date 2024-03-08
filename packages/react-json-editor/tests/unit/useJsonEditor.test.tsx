import { renderHook } from '@testing-library/react';
import { useJsonEditor, UseJsonEditorOptions } from "../../src/lib/useJsonEditor";
import { strict as assert } from 'assert';
import { isJsonError, JsonSchema, ObjectNode, StringNode } from 'headless-json-editor';
import { get } from "@sagold/react-json-editor";

describe('useJsonEditor', () => {
    it("should return state and editor instance", () => {
        const { result } = renderHook((settings: UseJsonEditorOptions) => useJsonEditor(settings), {
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
        const { result, rerender } = renderHook((settings: UseJsonEditorOptions) => useJsonEditor(settings), {
            initialProps: { schema, data }
        });

        const [state, editor] = result.current;
        const titleNode = get<StringNode>(state, "/title");
        rerender({ schema, data: { title: "updated title" } });

        const [stateAfter, editorAfter] = result.current;
        const titleNodeAfter = get<StringNode>(stateAfter, "/title");

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, "should not recreate editor when data has changed");
        assert(state !== stateAfter);
        assert.equal(titleNode.value, "test-title");
        assert.equal(titleNodeAfter.value, "updated title");
    });

    it("should update state when input schema changes", () => {
        const data = { title: "test-title" };
        const schema: JsonSchema = { type: "object", properties: { title: { type: "string" } } };
        const { result, rerender } = renderHook((settings: UseJsonEditorOptions<object>) => useJsonEditor<object, ObjectNode>(settings), {
            initialProps: { schema, data }
        });
        const [state, editor] = result.current;
        const titleNode = get<StringNode>(state, "/title");

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
        const titleNodeAfter = get<StringNode>(stateAfter, "/title");

        assert(!isJsonError(titleNode) && !isJsonError(titleNodeAfter));
        assert.equal(editor, editorAfter, "should not recreate editor when schema has changed");
        // assert(state !== stateAfter);
        assert.equal(state.children.length, 1);
        assert.equal(stateAfter.children.length, 2, "should have updated data after schema change");
        assert.equal(titleNode.schema.minLength, undefined);
        assert.equal(titleNodeAfter.schema.minLength, 1);
    });

    it("should recreated editor when cacheKey changes", async () => {
        const props: UseJsonEditorOptions = {
            data: { title: "test-title" },
            schema: { type: "object", properties: { title: { type: "string" } } }
        }
        const { result, rerender } = renderHook((settings: UseJsonEditorOptions) => useJsonEditor(settings), {
            initialProps: props
        });

        const editor = result.current[1];
        rerender({ ...props, cacheKey: 123 });
        const editorAfter = result.current[1];
        assert.notEqual(editor, editorAfter);
    });

    it("should add internal onChangePlugin", () => {
        const props: UseJsonEditorOptions = {
            data: { title: "test-title" },
            schema: { type: "object", properties: { title: { type: "string" } } }
        }
        const { result } = renderHook((settings: UseJsonEditorOptions) => useJsonEditor(settings), {
            initialProps: props
        });
        const editor = result.current[1];
        assert(editor.plugins.find(p => p.id === "InternalOnChange"));
    })
});

