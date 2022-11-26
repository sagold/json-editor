import Markdown from 'markdown-to-jsx';
import { createRoot } from 'react-dom/client';
import { getJsonPointerFromPosition } from './getJsonPointerFromPosition';
import { hoverTooltip } from '@codemirror/view';
import { JsonEditor, JSONSchema } from '@sagold/react-json-editor';

const dom = document.createElement('div');
const root = createRoot(dom);

export const jsonSchemaTooltip = (editor: JsonEditor, nodePointer = '#', localSchema?: JSONSchema) =>
    hoverTooltip((view, pos, side) => {
        const { pointer, cursor } = getJsonPointerFromPosition(view.state, pos);
        const absolutePointer = localSchema ? `#${pointer}` : `${nodePointer}${pointer}`;
        const schema = editor.draft.getSchema(`${absolutePointer}`, {}, localSchema);

        if (schema.type === 'error') {
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
                console.log('Create');
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
