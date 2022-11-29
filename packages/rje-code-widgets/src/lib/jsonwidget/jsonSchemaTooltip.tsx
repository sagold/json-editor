import Markdown from 'markdown-to-jsx';
import { createRoot } from 'react-dom/client';
import { getJsonPointerFromPosition } from './getJsonPointerFromPosition';
import { hoverTooltip } from '@codemirror/view';
import { Text } from '@codemirror/state';
import { JsonEditor, JSONSchema } from '@sagold/react-json-editor';

const dom = document.createElement('div');
const root = createRoot(dom);

function getData(doc: Text) {
    try {
        return JSON.parse(doc.toString());
    } catch (e) {
        return undefined;
    }
}

export const jsonSchemaTooltip = (editor: JsonEditor, nodePointer = '#', localSchema?: JSONSchema) =>
    hoverTooltip((view, pos, side) => {
        const { pointer, cursor, location } = getJsonPointerFromPosition(view.state, pos);
        const absolutePointer = localSchema ? `#${pointer}` : `${nodePointer}${pointer}`;
        const data = getData(view.state.doc);
        const schema = editor.draft.getSchema(`${absolutePointer}`, data, localSchema);
        if (schema.type === 'error' || location === 'value') {
            return null;
        }

        if (schema.title == null && schema.description == null) {
            return null;
        }

        return {
            // https://codemirror.net/docs/ref/#view.hoverTooltip
            pos: cursor.from,
            end: cursor.to,
            above: true,
            create(view) {
                root.render(
                    <div className="rje-tooltip rje-tooltip--jsonschema">
                        {schema.title && <h1>{schema.title}</h1>}
                        {schema.description && <Markdown>{schema.description}</Markdown>}
                        {/*<span className="rje-tooltip--pointer">{absolutePointer}</span>*/}
                    </div>
                );
                return { dom };
            }
        };
    });
