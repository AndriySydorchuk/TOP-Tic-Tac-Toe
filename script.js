const Game = (function () {
    let player;
    let computer;

    const initPlayer = function (newPlayer) {
        player = createPlayer(newPlayer.name, newPlayer.sign.toUpperCase(), playerMove);

        const computerSign = player.getSign() === 'X' ? 'O' : 'X';
        computer = createPlayer('Computer', computerSign, computerMove);
    };

    const getPlayer = function () {
        if (player) {
            return player;
        }
    }

    const getComputer = function () {
        if (computer) {
            return computer;
        }
    }

    const play = function () {
        let result = {
            win: false,
            winner: ''
        }

        DOMHandler.setupForm((formData => {
            initPlayer(formData);
        }));

        let isPlayerMove = true;//rework according to X : O order of moving

        DOMHandler.setupCells((cell) => {
            player.move(player.getSign(), cell.id);
            isPlayerMove = false;

            result = checkWin();

            DOMHandler.updateBoard();
        })

        if (!result.win && !isPlayerMove) {
            computer.move(computer.getSign());

            isPlayerMove = true;

            result = checkWin();
            //logs
            console.log('computer moved');
            console.log(result);

            DOMHandler.updateBoard();
        }

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
            DOMHandler.toggleCellsActiveness();
        }
    }

    return { initPlayer, getPlayer, getComputer, play };
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

    const getBoard = function () {
        return board;
    }

    return { display, isEmptyCell, setCell, getCell, winCombinations, isFull, getBoard }
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
        move(sign, index) {
            moveFunc(sign, index);
        }
    }
}

function computerMove(sign, index = -1) {
    const maxLineLength = 9; // 0..8
    console.log(`computer move: initial index = ${index}`);

    do {
        index = Math.floor(Math.random() * maxLineLength);
        console.log(`computer move: generated index = ${index}`);


    } while (!Gameboard.isEmptyCell(index));

    Gameboard.setCell(index, sign);
    console.log(`computer move: final index = ${index}`);

}

function playerMove(sign, index) {
    if (Gameboard.isEmptyCell(index)) {
        Gameboard.setCell(index, sign);
    }
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

    const updateBoard = function () {
        const cells = document.querySelectorAll('.cell');
        const board = Gameboard.getBoard();
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = board[i];
        }
    }

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

    const toggleCellsActiveness = function () {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.disabled = true);
    }

    return { setupForm, setupCells, updateBoard, toggleGameboard, toggleCellsActiveness };
})();

Game.play();