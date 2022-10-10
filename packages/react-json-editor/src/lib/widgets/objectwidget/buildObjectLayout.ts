import { ObjectNode } from 'headless-json-editor';
import { SemanticWIDTHS } from 'semantic-ui-react';

const GRID_COLUMNS = 16 as const;

export type ObjectLayoutCell = {
    prop: string;
    width?: SemanticWIDTHS;
};

export type ObjectLayout = {
    cells: ObjectLayoutCell[];
};

export function buildObjectLayout(node: ObjectNode, layout: ObjectLayout): ObjectLayoutCell[] {
    const cells = layout.cells;
    const additionalChildren = node.children
        .filter((node) => node.options.hidden !== true)
        .map((c) => c.property)
        .filter((key) => cells.find((cell) => cell.prop === key) == null);
    const wildCardIndex = cells.findIndex((c) => c.prop === '*');

    if (wildCardIndex === -1) {
        const allCells: ObjectLayoutCell[] = additionalChildren.map((p) => ({ prop: p, width: GRID_COLUMNS }));
        allCells.unshift(...cells);
        return allCells;
    }

    const wildCard = cells[wildCardIndex];
    const remainingCells: ObjectLayoutCell[] = additionalChildren.map((p) => ({
        width: GRID_COLUMNS,
        ...wildCard,
        prop: p
    }));

    const allCells: ObjectLayoutCell[] = [...cells];
    allCells.splice(wildCardIndex, 1, ...remainingCells);
    return allCells;
}
