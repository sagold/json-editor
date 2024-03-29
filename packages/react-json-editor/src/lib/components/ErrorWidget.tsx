import { JsonError } from 'json-schema-library';
import { Editor } from '../Editor';
import { WidgetPlugin } from '../decorators';
import { Node, isJsonError } from 'headless-json-editor';

export const ErrorWidget = ({ node, editor }: { node: Node; editor: Editor }) => {
    const error = node.schema as unknown as JsonError;
    const description = `${error.name} '${node.pointer}': ${error.message}`;
    return (
        <div className="rje-form" data-type="error" data-id={node.pointer}>
            <div className="rje-form__node">
                <button className="ui button basic outline" onClick={() => editor.removeValue(node.pointer)}>
                    delete
                </button>
                <label>{`${node.property} (${error.name})`}</label>
            </div>
            <div className="rje-form__errors">
                {node.errors.map((e, index) => (
                    <div key={index} className="rje_form__error">{e.message}</div>
                ))}
            </div>

            {description && <em className="rje-description">{description}</em>}
            {
                <p style={{ background: 'rgb(208, 120, 132)', padding: '8px' }}>
                    {JSON.stringify({ ...node.schema }, null, 2)}
                </p>
            }
        </div>
    );
};

export const ErrorWidgetPlugin: WidgetPlugin = {
    id: 'error-widget',
    use: (node) => isJsonError(node.schema),
    Widget: ErrorWidget
};
