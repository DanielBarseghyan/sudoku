import { Sudoku } from "./sudoku.js";
import { boxSize, convertIndexToPosition, convertPositionToIndex, gridSize } from "./utilities.js";
let sudoku = new Sudoku();
let cells,
    selectedCellIndex,
    selectedCell;

const playBtn = document.querySelector('.playBtn');
const gameStartModal = document.querySelector('.gameStartModal');
const numBord = document.querySelector('.numbers');
const reloudBtn = document.querySelector('.reloud');
reloudBtn.addEventListener('click', startNewGame);

function startNewGame() {
  location.reload();
}
playBtn.addEventListener('click', () => {
    gameStartModal.classList.add('hiden')
})

init();

function init() {
    initCells();
    initNumbers();
    initRemover();
    initKeyEvent();
}

function initCells() {
    cells = document.querySelectorAll('.cell');
    fillCells();
    initCellsEvent();
}

function fillCells() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const { row, column } = convertIndexToPosition(i);
        if (sudoku.grid[row][column] !== null) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = sudoku.grid[row][column];
        }
    }
}
function initCellsEvent() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => onCellClick(cell, index))
    });
}
function onCellClick(clickedCell, index) {
    cells.forEach(cell => cell.classList.remove('selected', 'highlighted', 'error'));
    if (clickedCell.classList.contains('filled')) {
        selectedCellIndex = null;
        selectedCell = null;
    }
    else {
        selectedCellIndex = index;
        selectedCell = clickedCell;
        clickedCell.classList.add('selected');
        highlightCellBy(index);
    }
    if (clickedCell.innerHTML === '') return;
    cells.forEach(cell => {
        if (cell.innerHTML === clickedCell.innerHTML) cell.classList.add('selected')
    })
}

function highlightCellBy(index) {
    highlightColumnBy(index);
    highlightRowBy(index);
    highlightBoxBy(index);
}

function highlightColumnBy(index) {
    const column = index % gridSize;
    for (let row = 0; row < gridSize; row++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add('highlighted');
    }
}
function highlightRowBy(index) {
    const row = Math.floor(index / gridSize);
    for (let column = 0; column < gridSize; column++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add('highlighted')
    }
}

function highlightBoxBy(index) {
    const column = index % gridSize;
    const row = Math.floor(index / gridSize);
    const firstRowInBox = row - row % boxSize;
    const firstColumnInBox = column - column % boxSize;

    for (let iRow = firstRowInBox; iRow < firstRowInBox + boxSize; iRow++) {
        for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + boxSize; iColumn++) {
            const cellIndex = convertPositionToIndex(iRow, iColumn);
            cells[cellIndex].classList.add('highlighted')
        }
    }
}

function initNumbers() {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
        number.addEventListener('click', () => onNumberClick(parseInt(number.innerHTML)))
    })
}

function onNumberClick(number) {
    if (!selectedCell) return;
    if (selectedCell.classList.contains('filled')) return;
    cells.forEach(cell => cell.classList.remove('error', 'shake', 'zoom', 'selected'));
    selectedCell.classList.add('selected');
    setValueInSelectedCell(number);

    if (!sudoku.hasEmptyCells()) {
        setTimeout(() => winAnimation(), 500);
    }
}
function setValueInSelectedCell(value) {
    const { row, column } = convertIndexToPosition(selectedCellIndex);
    const duplicatePositions = sudoku.getDuplicatePositions(row, column, value);
    if (duplicatePositions.length) {
        highlightDuplicates(duplicatePositions);
        return;
    }
    sudoku.grid[row][column] = value;
    selectedCell.innerHTML = value;
    setTimeout(() => selectedCell.classList.add('zoom'), 0)
}

function highlightDuplicates(duplicatePositions) {
    duplicatePositions.forEach(duplicate => {
        const index = convertPositionToIndex(duplicate.row, duplicate.column);
        setTimeout(() => cells[index].classList.add('error', 'shake'), 0);
    })
}

function initRemover() {
    const remover = document.querySelector('.remove');
    remover.addEventListener('click', () => onRemoveClick());
}

function onRemoveClick() {
    if (!selectedCell) return;
    if (selectedCell.classList.contains('filled')) return;

    cells.forEach(cell => cell.classList.remove('error', 'shake', 'zoom', 'selected'));
    selectedCell.classList.add('selected');

    const { row, column } = convertIndexToPosition(selectedCellIndex);
    selectedCell.innerHTML = '';
    sudoku.grid[row][column] = null;
}
function initKeyEvent() {

    document.addEventListener('keydown', (e) => {
        console.log(e.key);
        if (e.key === 'Backspace') {
            onRemoveClick();
        }
        else if (e.key >= '1' && e.key <= '9') {
            onNumberClick(parseInt(e.key));
        }
    });
}

function winAnimation() {
    cells.forEach(cell => cell.classList.remove('error', 'shake', 'zoom', 'selected', 'highlighted'));
    cells.forEach((cell, i) => {
        setTimeout(() => {
            cell.classList.add('highlighted', 'zoom')
        }, i * 15);
    })
    for (let i = 1; i < 10; i++) {
        setTimeout(() => cells.forEach(cell => {
            cell.classList.toggle('highlighted');
        }), 500 + cells.length * 15 + 300 * i);
    }
    showReloudBtn();
}
function showReloudBtn() {
    reloudBtn.classList.remove('hideBtn');
    numBord.classList.add('hideBtn');
}