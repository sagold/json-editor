import { Form, Checkbox } from 'semantic-ui-react';
import { WidgetPlugin } from '@sagold/react-json-editor';
import { Node, DefaultNodeOptions, NullNode, widget } from '@sagold/react-json-editor';

export type NullOptions = {
    /** if true, shows a separator line */
    separator?: boolean;
} & DefaultNodeOptions;

export const NullWidget = widget<NullNode<NullOptions>, null>(({ node, options }) => {
    const { description, title, pointer, separator } = options;
    return (
        <div className="rje-form rje-value" data-type="null" data-id={pointer}>
            <Form.Field
                id={node.id}
                error={node.errors.length > 0 && node.errors.map((e) => e.message)}
                style={{ display: 'flex', alignItems: 'center' }}
                disabled={options.disabled}
            >
                <label>{title as string}</label>
                {separator && (
                    <div
                        className="separator"
                        style={{
                            flexGrow: 1,
                            height: 1,
                            background: 'RGBA(7,23,32,0.8)',
                            borderBottom: '1px solid rgba(255,255,255,0.8)',
                            marginLeft: 8
                        }}
                    ></div>
                )}
            </Form.Field>
            {description && <em className="rje-description">{description}</em>}
        </div>
    );
});

export const NullWidgetPlugin: WidgetPlugin = {
    id: 'null-widget',
    use: (node) => node.schema.type === 'null',
    Widget: NullWidget
};
