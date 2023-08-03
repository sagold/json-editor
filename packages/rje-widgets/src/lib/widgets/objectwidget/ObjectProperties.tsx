import { ObjectNode, Widget, JsonEditor } from '@sagold/react-json-editor';
import { ObjectOptions } from './ObjectWidget';
import { Button } from '../../components/button/Button';
import { Icon } from '../../components/icon/Icon';

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
    return (
        <div className="rje-object__properties" style={{ boxShadow: 'none', border: 0 }}>
            {node.children.map((child) => (
                <div key={child.id} className="rje-object__property">
                    <Widget
                        node={child}
                        editor={editor}
                        options={{ ...childOptions, isOptional: node.optionalProperties.includes(child.property) }}
                    />
                    {withInlineDelete &&
                        editor.optionalProperties &&
                        node.optionalProperties.includes(child.property) && (
                            <div className="rje-object__actions">
                                <Button
                                    variant="text"
                                    onPress={() => {
                                        editor.removeValue(child.pointer);
                                    }}
                                >
                                    <Icon>delete</Icon>
                                </Button>
                            </div>
                        )}
                </div>
            ))}
        </div>
    );
}
