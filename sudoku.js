import { generateSudoku, findEmptyCell } from "./sudokuGenerator.js";
import { boxSize, gridSize } from "./utilities.js";
export class Sudoku {
    constructor() {
        this.grid = generateSudoku();

    }
    getDuplicatePositions(row, column, value) {
        const duplicatesInColumn = this.getDuplicatePositionsInColumn(row, column, value);
        const duplicatesInRow = this.getDuplicatePositionsInRow(row, column, value);
        const duplicatesInBox = this.getDuplicatePositionsInBox(row, column, value);

        const duplicates = [...duplicatesInColumn, ...duplicatesInRow];
        duplicatesInBox.forEach(duplicateInBox => {
            if (duplicateInBox.row !== row && duplicateInBox.column !== column) {
                duplicatesInBox.push(duplicateInBox);
            }
        });
        return duplicates;
    }
    getDuplicatePositionsInColumn(row, column, value) {
        const duplicates = [];
        for (let iRow = 0; iRow < gridSize; iRow++) {
            if (this.grid[iRow][column] === value && iRow !== row) {
                duplicates.push({ row: iRow, column })
            }
        }
        return duplicates;
    }
    getDuplicatePositionsInRow(row, column, value) {
        const duplicates = [];
        for (let iColumn = 0; iColumn < gridSize; iColumn++) {
            if (this.grid[row][iColumn] === value && iColumn !== column) {
                duplicates.push({ row, column: iColumn });
            }
        }
        return duplicates;
    }
    getDuplicatePositionsInBox(row, column, value) {
        const duplicates = [];
        const firstRowInBox = row - row % boxSize;
        const firstColumnInBox = column - column % boxSize;

        for (let iRow = firstRowInBox; iRow < firstRowInBox + boxSize; iRow++) {
            for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + boxSize; iColumn++) {
                if (this.grid[iRow][iColumn] === value && iRow !== row && iColumn !== column) {
                    duplicates.push({ row: iRow, column: iColumn })
                }
            }
        }
        return duplicates;
    }
    hasEmptyCells() {
        return Boolean(findEmptyCell(this.grid));
    }
}