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

        DOMHandler.setupCells((selectedCell) => {
            player.move(player.getSign(), selectedCell.id);
            isPlayerMove = false;
            DOMHandler.updateBoard();

            result = checkWin();

            if (!result.win) {
                computer.move(computer.getSign());
                isPlayerMove = true;
                DOMHandler.updateBoard();

                result = checkWin();
            }


            DOMHandler.displayWinner(result);
        })

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

    do {
        index = Math.floor(Math.random() * maxLineLength);
    } while (!Gameboard.isEmptyCell(index));

    Gameboard.setCell(index, sign);
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

    let handleCellClick;

    const setupCells = function (onSuccess) {
        const cells = document.querySelectorAll('.cell');

        handleCellClick = function (event) {
            if (typeof onSuccess === 'function') {
                return onSuccess(event.currentTarget);
            }
        }

        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    };

    const toggleCellsActiveness = function () {
        const cells = document.querySelectorAll('.cell');

        //if at least one cell is filled that means that all the board is active
        const isCellsActive = [...cells].find(cell => cell.innerText !== '');

        if (isCellsActive) { //deactivate
            cells.forEach(cell => {
                cell.style.cursor = 'default';
                cell.style.backgroundColor = 'rgb(84, 84, 84)';
                cell.removeEventListener('click', handleCellClick);
            });
        } else { //activate
            cells.forEach(cell => {
                cell.style.cursor = 'pointer';
                cell.style.backgroundColor = 'rgb(33, 33, 33)';
                cell.addEventListener('click', handleCellClick);
            });
        }
    }

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

    const displayWinner = function (result) {
        if (result.win) {
            const container = document.querySelector('.container');

            const winnerText = document.createElement('p');

            if (result.winner === 'tie') {
                winnerText.textContent = 'Tie!';
            } else {
                const winnerPlayer = result.winner === Game.getPlayer().getSign() ? Game.getPlayer() : Game.getComputer();
                winnerText.textContent = `${winnerPlayer.getName()} wins!`;
            }

            winnerText.style.marginTop = '15px';
            winnerText.style.textAlign = 'center';
            winnerText.style.fontSize = '24px';

            container.appendChild(winnerText);

            toggleCellsActiveness();
        }
    }

    return { setupForm, setupCells, updateBoard, toggleGameboard, displayWinner };
})();

Game.play();