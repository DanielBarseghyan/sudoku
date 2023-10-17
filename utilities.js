export const gridSize = 9;
export const boxSize = 3;

export function convertIndexToPosition(index) {
    return {
        row: Math.floor(index / gridSize),
        column: index % gridSize,
    }
}

export function convertPositionToIndex(row, column) {
    return row * gridSize + column;
}