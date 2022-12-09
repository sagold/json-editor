const GRID_COLUMNS = 16;
export function buildObjectLayout(node, layout) {
    const cells = layout.cells;
    const additionalChildren = node.children
        .filter((node) => node.options.hidden !== true)
        .map((c) => c.property)
        .filter((key) => cells.find((cell) => cell.prop === key) == null);
    const wildCardIndex = cells.findIndex((c) => c.prop === '*');
    if (wildCardIndex === -1) {
        const allCells = additionalChildren.map((p) => ({ prop: p, width: GRID_COLUMNS }));
        allCells.unshift(...cells);
        return allCells;
    }
    const wildCard = cells[wildCardIndex];
    const remainingCells = additionalChildren.map((p) => ({
        width: GRID_COLUMNS,
        ...wildCard,
        prop: p
    }));
    const allCells = [...cells];
    allCells.splice(wildCardIndex, 1, ...remainingCells);
    return allCells;
}
//# sourceMappingURL=buildObjectLayout.js.map