import { ObjectNode, getChildNode } from 'headless-json-editor';
import { Grid, Button } from 'semantic-ui-react';
import { buildObjectLayout } from './buildObjectLayout';
import { Widget } from '../../components/widget/Widget';
import { JsonEditor } from '@sagold/react-json-editor';
import { ObjectOptions } from './ObjectWidget';

type ObjectPropertiesProps = {
    node: ObjectNode<ObjectOptions>;
    options: ObjectOptions;
    editor: JsonEditor;
    withInlineDelete: boolean;
};

export function ObjectProperties({ node, editor, options, withInlineDelete }: ObjectPropertiesProps) {
    const childOptions: Record<string, any> = {};
    options.disabled && (childOptions.disabled = true);
    options.readOnly && (childOptions.readOnly = true);

    if (options.layout && Array.isArray(options.layout.cells)) {
        const cells = buildObjectLayout(node, options.layout);
        return (
            <div className="rje-object__properties rje-object__properties--grid">
                <Grid stackable columns="equal">
                    {cells.map((cell) => {
                        const child = getChildNode(node, cell.prop);
                        if (child == null) {
                            return null;
                        }
                        return (
                            <Grid.Column key={cell.prop} width={cell.width ?? 16} style={{ padding: 0 }}>
                                <Widget node={child} editor={editor} key={child.id} options={childOptions} />
                            </Grid.Column>
                        );
                    })}
                </Grid>
            </div>
        );
    }

    return (
        <div className="rje-object__properties" style={{ boxShadow: 'none', border: 0 }}>
            {node.children.map((child) => (
                <div key={child.id} className="rje-object__property">
                    <Widget
                        node={child}
                        editor={editor}
                        options={{ ...childOptions, isOptional: node.optionalProperties.includes(child.property) }}
                    />
                    {withInlineDelete && node.optionalProperties.includes(child.property) && (
                        <div className="rje-object__actions">
                            <Button
                                onClick={() => editor.removeValue(child.pointer)}
                                size="mini"
                                basic
                                icon="trash alternate outline"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
