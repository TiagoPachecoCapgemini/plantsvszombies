const boardSize = 10;
const numZombies = 15;
let board = [];
let revealedCount = 0;

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');

function createBoard() {
    board = [];
    revealedCount = 0;
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;

    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push({ isZombie: false, revealed: false, adjacentZombies: 0 });
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => revealCell(i, j));
            gameBoard.appendChild(cell);
        }
        board.push(row);
    }

    placeZombies();
    calculateAdjacentZombies();
}

function placeZombies() {
    let placedZombies = 0;
    while (placedZombies < numZombies) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].isZombie) {
            board[row][col].isZombie = true;
            placedZombies++;
        }
    }
}

function calculateAdjacentZombies() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].isZombie) continue;
            let count = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const ni = i + x;
                    const nj = j + y;
                    if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize && board[ni][nj].isZombie) {
                        count++;
                    }
                }
            }
            board[i][j].adjacentZombies = count;
        }
    }
}

function revealCell(row, col) {
    const cell = board[row][col];
    if (cell.revealed) return;

    cell.revealed = true;
    revealedCount++;

    const cellElement = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cellElement.classList.add('revealed');

    if (cell.isZombie) {
        cellElement.classList.add('zombie');
        alert('Você encontrou um zumbi! Fim de jogo!');
        revealAllZombies();
    } else {
        cellElement.textContent = cell.adjacentZombies > 0 ? cell.adjacentZombies : '';
        if (cell.adjacentZombies === 0) {
            revealAdjacentCells(row, col);
        }
        if (revealedCount === boardSize * boardSize - numZombies) {
            alert('Parabéns! Você venceu!');
        }
    }
}

function revealAdjacentCells(row, col) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            const ni = row + x;
            const nj = col + y;
            if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize) {
                revealCell(ni, nj);
            }
        }
    }
}

function revealAllZombies() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].isZombie) {
                const cellElement = document.querySelector(`.cell[data-row='${i}'][data-col='${j}']`);
                cellElement.classList.add('zombie');
            }
        }
    }
}

resetButton.addEventListener('click', createBoard);

createBoard();