import { Segment, Header, SemanticCOLORS } from 'semantic-ui-react';
import { DefaultNodeOptions, Node } from 'headless-json-editor';
import { split } from '@sagold/json-pointer';
import { classNames } from '@sagold/react-json-editor';

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

    if (!title && !description && !icon && !children) {
        return <></>;
    }

    return (
        <div className="ed-header">
            <Segment
                basic
                clearing
                inverted={inverted}
                color={header?.color}
                className={classNames(icon && 'with-icon', description && 'with-description')}
            >
                <Header as={`h${depth}`} inverted={inverted} floated="left">
                    {icon && <Header.Content floated="left">{icon}</Header.Content>}
                    {/*@todo flag required*/}
                    <Header.Content>{title}</Header.Content>
                    {description && <Header.Subheader>{description}</Header.Subheader>}
                </Header>
                {children && (
                    <div className="ed-header__actions" style={{ float: 'right' }}>
                        {children}
                    </div>
                )}
            </Segment>
        </div>
    );
}
