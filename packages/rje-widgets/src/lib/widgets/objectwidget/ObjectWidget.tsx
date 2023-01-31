import { Button, Card, Icon, SemanticCOLORS } from 'semantic-ui-react';
import { classNames } from '../../classNames';
import { ObjectActionPanel } from './ObjectActionPanel';
import { ObjectLayout } from './buildObjectLayout';
import { ObjectProperties } from './ObjectProperties';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { useState } from 'react';
import { ValidationErrors } from '../../components/ValidationErrors';
import { widget, WidgetPlugin, ObjectNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { WidgetModalSize } from '../../components/widgetmodal/WidgetModal';

export type ObjectOptions = {
    /** additional classnames for object editor */
    classNames?: string[];
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        enabled?: boolean;
        modalSize?: WidgetModalSize;
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
    /**
     * Arrange properties within a 16 columns grid.
     * Format: `[{ prop: "title", width: 8 }, ...]`. Use `{ prop: '*', width: 16 }` to reference remaining properties
     */
    layout?: ObjectLayout & {
        type?: 'default' | 'card';
    };
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
    /** Is set internally to true to add a delete option for this object. */
    isOptional?: boolean;
    /** set to true to show inline buttons at the end of the object to add optional missing properties */
    inlineAddPropertyOption?: boolean;
    /** set to true to show a delete button after each optional property */
    inlineDeletePropertyOption?: boolean;
} & DefaultNodeOptions;

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor, setValue }) => {
    const [showContent, setShowContent] = useState<boolean>(options.collapsed ? !options.collapsed : true);

    const { title, description, editJson = {}, layout, header } = options;
    const showHeader = editJson.enabled || title || description || options.collapsed != null;
    const withInlineDelete = options.inlineDeletePropertyOption ?? !showHeader;
    const withInlineAdd = options.inlineAddPropertyOption ?? !showHeader;

    if (layout?.type === 'card') {
        return (
            <Card fluid data-type="object" data-id={node.pointer} className={options.classNames?.join(' ')}>
                <Card.Content key="header" style={{ background: header?.color }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Card.Header>{title}</Card.Header>
                            <Card.Meta>{description}</Card.Meta>
                        </div>
                        <div style={{ flexGrow: 1, textAlign: 'right' }}>
                            <ObjectActionPanel editor={editor} node={node} options={options} />
                        </div>
                    </div>
                </Card.Content>
                <Card.Content key="content">
                    <ValidationErrors errors={node.errors} />
                    {showContent && (
                        <ObjectProperties
                            editor={editor}
                            node={node}
                            options={options}
                            withInlineDelete={withInlineDelete}
                        />
                    )}
                </Card.Content>
            </Card>
        );
    }

    return (
        <div
            className={classNames('rje-form rje-form--parent rje-object', options.classNames)}
            data-type="object"
            data-id={node.pointer}
        >
            {showHeader && (
                <ParentHeader
                    node={node}
                    options={options}
                    icon={
                        options.collapsed != null && (
                            <Icon
                                link
                                rotated={!showContent ? 'counterclockwise' : undefined}
                                name="dropdown"
                                onClick={() => setShowContent(!showContent)}
                            />
                        )
                    }
                >
                    <ObjectActionPanel editor={editor} node={node} options={options} />
                </ParentHeader>
            )}
            <ValidationErrors errors={node.errors} />
            {showContent && (
                <ObjectProperties editor={editor} node={node} options={options} withInlineDelete={withInlineDelete} />
            )}
            {withInlineAdd && node.missingProperties.length > 0 && (
                <div className="rje-object__missing-properties">
                    {node.missingProperties.map((name) => (
                        <Button
                            key={name}
                            content={name}
                            icon="plus"
                            basic
                            size="small"
                            onClick={() => editor.addValue(`${node.pointer}/${name}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
