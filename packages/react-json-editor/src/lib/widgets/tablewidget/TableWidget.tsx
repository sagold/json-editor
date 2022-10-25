import { get, ArrayNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import { Table } from 'semantic-ui-react';
import { widget, WidgetPlugin } from '../decorators';
import { useState } from 'react';
import { EditModal } from '../../components/editmodal/EditModal';
import { getTypeOf } from 'json-schema-library';

export type ColumnConfig = {
    key: string;
    title?: string;
};

export type TableOptions = {
    table: {
        columns?: ColumnConfig[];
    };
} & DefaultNodeOptions;

/**
 * @todo maybe better to use ag-grid
 */
export const TableWidget = widget<ArrayNode<TableOptions>>(({ node, editor }) => {
    const columns = Object.keys(node.schema.items.properties);
    const [edit, setEdit] = useState<{ isOpen: boolean; pointer?: string; cell?: Node }>({ isOpen: false });

    return (
        <div className="ed-form ed-parent" data-type="array">
            <Table celled definition>
                <Table.Header>
                    <Table.Row>
                        {columns.map((title, index) => (
                            <Table.HeaderCell key={index}>{title}</Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {node.children.map((row) => {
                        return (
                            <Table.Row key={row.id}>
                                {row.children.map((cell) => {
                                    {
                                        /*const WidgetComponent = editor.getWidget(cell);*/
                                    }
                                    return (
                                        <Table.Cell selectable key={cell.id} error={cell.errors.length > 0}>
                                            {/*<Editor editor={editor} node={cell} />*/}
                                            <a
                                                className="clickable"
                                                onClick={() => setEdit({ isOpen: true, pointer: row.pointer, cell })}
                                            >
                                                {cell.value}
                                            </a>
                                        </Table.Cell>
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            {edit.pointer && (
                <EditModal
                    editor={editor}
                    node={get(node, edit.pointer)}
                    isOpen={edit.isOpen}
                    closeModal={() => setEdit({ isOpen: false })}
                />
            )}
        </div>
    );
});

export const TableWidgetPlugin: WidgetPlugin = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array' && getTypeOf(node.schema.items) === 'object',
    Widget: TableWidget
};
