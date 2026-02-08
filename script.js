const Game = (function () {
    let player;
    let computer;
    const init = function () {
        player = createPlayer('Furman', 'X', randomMove);
        computer = createPlayer('Computer', 'O', randomMove);
    };
    const play = function () {
        let win = false;

        do {
            Gameboard.display();

            player.move();
            Gameboard.display();

            win = checkWin();

            if (!win) {
                computer.move();
                Gameboard.display();
            }

            win = checkWin();

        } while (!win);
    };
    const checkWin = function () {
        let win = false;

        for (let i = 0; i < Gameboard.winCombinations.length; i++) {
            //get combination
            const winCondition = Gameboard.winCombinations[i];

            //get cells
            const [cell1, cell2, cell3] = winCondition;

            //check if all these cells are not empty
            if (
                Gameboard.isEmptyCell(cell1[0], cell1[1]) ||
                Gameboard.isEmptyCell(cell2[0], cell2[1]) ||
                Gameboard.isEmptyCell(cell3[0], cell3[1])
            ) {
                continue;
            }

            //check if they're the same
            const val1 = Gameboard.getCell(cell1[0], cell1[1]);
            const val2 = Gameboard.getCell(cell2[0], cell2[1]);
            const val3 = Gameboard.getCell(cell3[0], cell3[1]);

            if (val1 === val2 && val2 === val3 && val1 !== '-') {
                return true;
            }

        }

        if (win) return true;

        //tie
        if (Gameboard.isFull()) return true;

        return false;
    }

    return { init, play };
})();

const Gameboard = (function () {
    const board = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ];
    const winCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],

        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],

        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];

    const display = function () {
        for (const line of board) {
            console.log(`${line}\n`);
        }
        console.log('--------------------------------------');
    };
    const isEmptyCell = function (row, col) {
        if (board[row][col] === '-') {
            return true;
        }
        return false;
    };
    const setCell = function (row, col, sign) {
        board[row][col] = sign;
    };
    const getCell = function (row, col) {
        return board[row][col];
    };
    const isFull = function () {
        return board.flat().every(cell => cell !== '-');
    };

    return { display, isEmptyCell, setCell, getCell, winCombinations, isFull }
})();

function createPlayer(name, sign, moveFunc) {
    return {
        getName() {
            return name;
        },
        setName(newName) {
            name = newName;
        },
        getSign() {
            return sign;
        },
        setSign(newSign) {
            sign = newSign;
        },
        move() {
            moveFunc(sign);
        }
    }
}

function randomMove(sign) {
    const maxLineLength = 3; // 0..2
    let row;
    let col;

    do {
        row = Math.floor(Math.random() * maxLineLength);
        col = Math.floor(Math.random() * maxLineLength);

    } while (!Gameboard.isEmptyCell(row, col));

    Gameboard.setCell(row, col, sign);
}

Game.init();
Game.play();