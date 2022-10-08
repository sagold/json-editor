import { EditorPlugin } from './decorators';
import { Node } from 'headless-json-editor';

export const NullEditor = ({ node }: { node: Node }) => {
    const { description, title, pointer } = node.options;
    return (
        <div className="ed-form ed-value" data-type="null" data-id={pointer}>
            <div className="field">
                <label>{title as string}</label>
            </div>
            {description && <em className="ed-description">{description}</em>}
        </div>
    );
};

export const NullEditorPlugin: EditorPlugin = {
    id: 'null-editor',
    use: (node) => node.schema.type === 'null',
    Editor: NullEditor
};
