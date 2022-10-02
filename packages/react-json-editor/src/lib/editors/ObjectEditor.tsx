import { ObjectNode, DefaultNodeOptions, getChildNode, json } from 'headless-json-editor';
import { getEditorHeader } from '../utils/getEditorHeader';
import { Message, Accordion, Icon, Grid, SemanticWIDTHS } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import { useState } from 'react';

const GRID_COLUMNS = 16 as const;

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/objecteditor/index.ts

export type LayoutCell = {
    prop: string;
    width?: SemanticWIDTHS;
};

export type Layout = {
    cells: LayoutCell[];
};

function buildLayout(node: ObjectNode, layout: Layout): LayoutCell[] {
    const cells = layout.cells;
    const additionalChildren = node.children
        .filter((node) => node.options.hidden !== true)
        .map((c) => c.property)
        .filter((key) => cells.find((cell) => cell.prop === key) == null);
    const wildCardIndex = cells.findIndex((c) => c.prop === '*');

    if (wildCardIndex === -1) {
        const allCells: LayoutCell[] = additionalChildren.map((p) => ({ prop: p, width: GRID_COLUMNS }));
        allCells.unshift(...cells);
        return allCells;
    }

    const wildCard = cells[wildCardIndex];
    const remainingCells: LayoutCell[] = additionalChildren.map((p) => ({ width: GRID_COLUMNS, ...wildCard, prop: p }));
    const allCells: LayoutCell[] = [...cells];
    allCells.splice(wildCardIndex, 1, ...remainingCells);
    return allCells;
}

export type ObjectOptions = {
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** arrange properties within a 16 columns grid. Use `{ prop: '*', width: 16 }` to reference remaining properties */
    layout?: Layout;
} & DefaultNodeOptions;

export const ObjectEditor = editor<ObjectNode<ObjectOptions>>(({ node, options, instance }) => {
    const Header = getEditorHeader(node);
    const [isOpen, setToggleState] = useState<boolean>(options.collapsed ? !options.collapsed : true);

    let children: JSX.Element;
    const errors =
        node.errors.length > 0 ? (
            <Message error>
                {node.errors.map((e) => (
                    <Message.Item key={e.message}>{e.message}</Message.Item>
                ))}
            </Message>
        ) : null;

    if (options.layout && Array.isArray(options.layout.cells)) {
        const cells = buildLayout(node, options.layout);
        children = (
            <Grid stackable columns="equal">
                {cells.map((cell) => {
                    const child = getChildNode(node, cell.prop);
                    if (child == null) {
                        return null;
                    }
                    const ChildEditor = instance.getEditor(child);
                    return (
                        <Grid.Column width={cell.width ?? 16}>
                            <ChildEditor node={child} instance={instance} key={child.id} />
                        </Grid.Column>
                    );
                })}
            </Grid>
        );
    } else {
        children = (
            <>
                {node.children.map((child) => {
                    const ChildEditor = instance.getEditor(child);
                    return <ChildEditor node={child} instance={instance} key={child.id} />;
                })}
            </>
        );
    }

    if (options.collapsed == null) {
        return (
            <div data-type="object" data-id={node.pointer}>
                {options.title && <Header>{options.title}</Header>}
                {options.description && <p>{options.description as string}</p>}
                {errors}
                {children}
            </div>
        );
    }

    return (
        <Accordion data-type="object" data-id={node.pointer}>
            <Accordion.Title active={isOpen}>
                <Header onClick={() => setToggleState(!isOpen)}>
                    <Icon name="dropdown" link />
                    {options.title}
                </Header>
                {options.description && <p>{options.description as string}</p>}
            </Accordion.Title>
            <Accordion.Content active={isOpen}>
                {errors}
                {children}
            </Accordion.Content>
        </Accordion>
    );
});

export const ObjectEditorPlugin: EditorPlugin = {
    id: 'object-editor',
    use: (node) => node.schema.type === 'object',
    Editor: ObjectEditor
};
