import Markdown from 'markdown-to-jsx';
import { createRoot } from 'react-dom/client';
import { getJsonPointerFromPosition } from './getJsonPointerFromPosition';
import { hoverTooltip } from '@codemirror/view';
import { Text } from '@codemirror/state';
import { Editor, JsonSchema } from '@sagold/react-json-editor';

const dom = document.createElement('div');
const root = createRoot(dom);

function getData(doc: Text) {
    try {
        return JSON.parse(doc.toString());
    } catch (e) {
        return undefined;
    }
}

export const jsonSchemaTooltip = (editor: Editor, nodePointer = '#', localSchema?: JsonSchema) =>
    hoverTooltip(async (view, pos, side) => {
        const { pointer, cursor } = getJsonPointerFromPosition(view.state, pos);
        const absolutePointer = localSchema ? `#${pointer}` : `${nodePointer}${pointer}`;
        const data = getData(view.state.doc);

        const schemaNode = localSchema ? editor.schemaNode.compileSchema(localSchema) : editor.schemaNode;
        const { node: localNode } = schemaNode.getNode(absolutePointer, data);
        if (!localNode) {
            return null;
        }

        if (localNode.schema.title == null && localNode.schema.description == null) {
            return null;
        }

        return {
            // https://codemirror.net/docs/ref/#view.hoverTooltip
            pos: cursor.from,
            end: cursor.to,
            above: true,
            create(view) {
                root.render(
                    <div className="rje-code-tooltip rje-code-tooltip--jsonschema">
                        {localNode.schema.title && <h1>{localNode.schema.title}</h1>}
                        {localNode.schema.description && <Markdown>{localNode.schema.description}</Markdown>}
                        {/*<span className="rje-tooltip--pointer">{absolutePointer}</span>*/}
                    </div>
                );
                return { dom };
            }
        };
    });
