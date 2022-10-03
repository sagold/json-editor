import { EditorPlugin } from './decorators';
import { Node } from 'headless-json-editor';
import { Segment } from 'semantic-ui-react';

export const NullEditor = ({ node }: { node: Node }) => {
    const { description, title, pointer } = node.options;
    return (
        <Segment basic data-type="null" data-id={pointer}>
            <div className="field">
                <label>{title as string}</label>
            </div>
            {description && <em>{description}</em>}
        </Segment>
    );
};

export const NullEditorPlugin: EditorPlugin = {
    id: 'null-editor',
    use: (node) => node.schema.type === 'null',
    Editor: NullEditor
};
