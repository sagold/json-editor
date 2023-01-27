import { classNames } from '../../classNames';
import { DefaultNodeOptions, Node } from '@sagold/react-json-editor';
import { Segment, Header, SemanticCOLORS } from 'semantic-ui-react';
import { split } from '@sagold/json-pointer';

function getNodeDepth(node: Node, max = 4) {
    const depth = split(node.pointer).length;
    return Math.min(max, depth + 1);
}

export type NodeOptions = {
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;

export type ParentHeaderProps = {
    node: Node;
    options: NodeOptions;
    icon?: React.ReactNode;
    children?: React.ReactNode | React.ReactNodeArray;
};

export function ParentHeader({ node, icon, options, children }: ParentHeaderProps) {
    const inverted = options.header?.inverted === true;
    const { title, description, header = {} } = options;
    const depth = getNodeDepth(node);

    const showHeader = title || description || icon;
    if (!showHeader && !children) {
        return null;
    }

    return (
        <div className="rje-header">
            <Segment
                basic
                clearing
                inverted={inverted}
                color={header?.color}
                className={classNames(icon && 'with-icon', description && 'with-description')}
            >
                {showHeader && (
                    <Header as={`h${depth}`} inverted={inverted} floated="left">
                        {icon && <Header.Content floated="left">{icon}</Header.Content>}
                        {title && typeof title !== 'boolean' && <Header.Content>{title}</Header.Content>}
                        {description && <Header.Subheader>{description}</Header.Subheader>}
                    </Header>
                )}
                {children && (
                    <div className="rje-header__actions" style={{ float: 'right' }}>
                        {children}
                    </div>
                )}
            </Segment>
        </div>
    );
}
