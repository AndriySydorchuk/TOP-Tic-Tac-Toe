const Game = (function () {
    let player;
    let computer;
    const init = function () {
        console.log('Game init call');
        player = createPlayer('Furman', 'X', randomMove);
        computer = createPlayer('Computer', 'O', randomMove);

        console.log(`Player1: ${player.getName()}, ${player.getSign()}`);
        console.log(`Player2: ${computer.getName()}, ${computer.getSign()}`);
    };
    const play = function () {
    };

    return { init, play };
})();

const Gameboard = (function () {
    const board = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ];
    const display = function () {
        for (const line of board) {
            console.log(`${line}\n`);
        }
    };
    const isEmptyCell = function (row, col) {
        if (board[row][col] === '-') {
            return true;
        }
        return false;
    };
    const setCell = function (row, col, sign) {
        board[row][col] = sign;
    }

    return { display, isEmptyCell, setCell }
})();

function createPlayer(name, sign) {
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
        move(func) {
            func();
        }
    }
}

function randomMove(sign) {
    const maxLineLength = 3; // 0..2
    let rowIndex;
    let colIndex;

    do {
        rowIndex = Math.floor(Math.random() * maxLineLength);
        colIndex = Math.floor(Math.random() * maxLineLength);

        console.log(`Generated coordinates: [${rowIndex}, ${colIndex}]`)

    } while (!Gameboard.isEmptyCell(rowIndex, colIndex));

    Gameboard.setMove(rowIndex, colIndex, sign);

    console.log(`Cell [${rowIndex}, ${colIndex}] is set to ${sign}`);
}