import { WidgetPlugin } from './decorators';
import { Node } from 'headless-json-editor';

export const NullWidget = ({ node }: { node: Node }) => {
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

export const NullWidgetPlugin: WidgetPlugin = {
    id: 'null-widget',
    use: (node) => node.schema.type === 'null',
    Widget: NullWidget
};