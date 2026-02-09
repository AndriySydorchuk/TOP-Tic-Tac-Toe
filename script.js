const Game = (function () {
    let player;
    let computer;
    const initPlayer = function (newPlayer) {
        player = createPlayer(newPlayer.name, newPlayer.sign, randomMove);
        computer = createPlayer('Computer', 'O', randomMove);
    };
    const play = function () {
        let result = {
            win: false,
            winner: ''
        }

        do {
            Gameboard.display();

            player.move();
            Gameboard.display();

            result = checkWin();

            if (!result.win) {
                computer.move();
                Gameboard.display();
            }

            result = checkWin();

        } while (!result.win);

        displayWinner(result);
    };
    const checkWin = function () {
        let win = false;
        let winner = '';

        for (let i = 0; i < Gameboard.winCombinations.length; i++) {
            //get combination
            const winCondition = Gameboard.winCombinations[i];

            //get cells
            const [cell1Idx, cell2Idx, cell3Idx] = winCondition;

            //check if all these cells are not empty
            if (
                Gameboard.isEmptyCell(cell1Idx) ||
                Gameboard.isEmptyCell(cell2Idx) ||
                Gameboard.isEmptyCell(cell3Idx)
            ) {
                continue;
            }

            //check if they're the same
            const val1 = Gameboard.getCell(cell1Idx);
            const val2 = Gameboard.getCell(cell2Idx);
            const val3 = Gameboard.getCell(cell3Idx);

            if (val1 === val2 && val2 === val3 && val1 !== '') {
                win = true;
                winner = val1;
            }
        }

        if (win) {
            return { win, winner };
        };

        //tie
        if (Gameboard.isFull()) {
            return { win: true, winner: 'tie' };
        };

        return { win: false, winner };
    };
    const displayWinner = function (result) {
        if (result.win) {
            if (result.winner === 'tie') {
                console.log('Tie!');
            } else if (result.winner === player.getSign()) {
                console.log(`${player.getName()} wins!`);
            } else {
                console.log(`${computer.getName()} wins!`);
            }
        }
    }

    return { initPlayer, play };
})();

const Gameboard = (function () {
    const board = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];
    const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],
    ];

    const display = function () {
        const line1 = `${board[0]} ${board[1]} ${board[2]}`;
        const line2 = `${board[3]} ${board[4]} ${board[5]}`;
        const line3 = `${board[6]} ${board[7]} ${board[8]}`;
        console.log(line1);
        console.log(line2);
        console.log(line3);
        console.log('--------------------------------------');
    };
    const isEmptyCell = function (index) {
        if (board[index] === '') {
            return true;
        }
        return false;
    };
    const setCell = function (index, sign) {
        board[index] = sign;
    };
    const getCell = function (index) {
        return board[index];
    };
    const isFull = function () {
        return board.flat().every(cell => cell !== '');
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
    const maxLineLength = 9; // 0..8
    let index = -1;

    do {
        index = Math.floor(Math.random() * maxLineLength);

    } while (!Gameboard.isEmptyCell(index));

    Gameboard.setCell(index, sign);
}

const DOMHandler = (function () {
    const setupForm = function (onSuccess) {
        const form = document.querySelector('.form');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const fData = new FormData(form);
            const formData = Object.fromEntries(fData.entries());

            toggleGameboard();

            if (typeof onSuccess === 'function') {
                onSuccess(formData);
            }
        })
    };

    const setupCells = function (onSuccess) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (typeof onSuccess === 'function') {
                    return onSuccess(cell);
                }
            });
        });
    };

    const toggleGameboard = function () {
        const formTitle = document.querySelector('.form-title');
        const form = document.querySelector('.form');
        const board = document.querySelector('.board');

        const isCreatePlayer = board.style.display === '';

        if (isCreatePlayer) {
            formTitle.style.display = 'none';
            form.style.display = 'none';
            board.style.display = 'grid';
        } else {
            formTitle.style.display = 'block';
            form.style.display = 'block';
            board.style.display = 'none';
        }
    };

    return { setupForm, setupCells };
})();

DOMHandler.setupForm();
DOMHandler.setupCells()