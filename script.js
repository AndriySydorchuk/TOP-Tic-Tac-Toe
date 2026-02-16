const Game = (function () {
    let player;
    let computer;
    let winner;


    const initPlayers = function (userPlayer) {
        player = createPlayer(userPlayer.name, userPlayer.sign.toUpperCase(), playerMove);
        computer = createPlayer('Computer', player.getSign() === 'X' ? 'O' : 'X', computerMove);
    };

    const getPlayer = function () {
        return player;
    }

    const getComputer = function () {
        return computer;
    }

    const getWinner = function () {
        return winner;
    }

    const play = function () {
        let isPlayerTurn;

        DOMHandler.setupForm((formData) => {
            initPlayers(formData);

            isPlayerTurn = player.getSign().toLowerCase() === 'x' ? true : false;
            if (!isPlayerTurn) {
                computer.move(computer.getSign());
                DOMHandler.updateBoard();
                isPlayerTurn = true;
            }
        })

        DOMHandler.setupCells((selectedCell) => {
            let initialCellText = selectedCell.innerText;

            if (isPlayerTurn) {
                player.move(player.getSign(), selectedCell.id);//todo
                const moveNotSetted = initialCellText === Gameboard.getCell(selectedCell.id);
                if (moveNotSetted) return;

                DOMHandler.updateBoard();

                winner = checkWin();

                //Computer turn
                if (!winner) {
                    computer.move(computer.getSign());
                    DOMHandler.updateBoard();
                    winner = checkWin();
                }
            }

            DOMHandler.displayWinner();
        });

        DOMHandler.setupRestartBtn(() => {
            isPlayerTurn = player.getSign().toLowerCase() === 'x' ? true : false;
            if (!isPlayerTurn) {
                computer.move(computer.getSign());
                DOMHandler.updateBoard();
                isPlayerTurn = true;
            }
        })

    };

    const checkWin = function () {
        let winner;

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
                winner = val1 === player.getSign() ? player.getName() : computer.getName();
            }
        }

        if (winner) return winner;

        //tie
        if (Gameboard.isFull()) return 'tie';

        return undefined;
    };

    return { getPlayer, getComputer, getWinner, play };
})();

const Gameboard = (function () {
    let board = [
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

    const clear = function () {
        board = board.map(cell => cell = '');
    }

    return { display, isEmptyCell, setCell, getCell, winCombinations, isFull, getBoard, clear }
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
            console.log('submit')
            event.preventDefault();

            const fData = new FormData(form);
            const formData = Object.fromEntries(fData.entries());
            console.log(formData);

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
                cell.classList.remove('cell-active')
                cell.classList.add('cell-disabled')
                cell.removeEventListener('click', handleCellClick);
            });
        } else { //activate
            cells.forEach(cell => {
                cell.classList.remove('cell-disabled');
                cell.classList.add('cell-active');
                cell.addEventListener('click', handleCellClick);
                cell.addEventListener('mouseover', () => {
                    cell.classList.add('hovered');
                })
                cell.addEventListener('mouseout', () => {
                    cell.classList.remove('hovered');
                })
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
            formTitle.classList.add('form-hidden');
            form.classList.add('form-hidden');
            board.style.display = 'grid';
        } else {
            formTitle.classList.remove('form-hidden');
            form.classList.remove('form-hidden');
            board.style.display = '';
        }
    };

    const displayWinner = function () {
        if (Game.getWinner()) {
            addWinnerText();
            addRestartBtns();

            toggleCellsActiveness();
        }
    }

    const addWinnerText = function () {
        const container = document.querySelector('.container');
        const message = document.createElement('p');

        const winner = Game.getWinner();

        message.textContent = winner === 'tie' ? 'Tie!' : `${winner} wins!`;
        message.classList.add('winner-text');

        container.appendChild(message);
    }

    const addRestartBtns = function () {
        const container = document.querySelector('.container');

        const restartBtnsContainer = document.createElement('div');
        restartBtnsContainer.classList.add('restart-btn-container')

        const restartBtn = document.querySelector('.restart-btn');
        if (restartBtn.classList.contains('hidden')) restartBtn.classList.remove('hidden');

        const playerMenuBtn = document.createElement('button');
        playerMenuBtn.textContent = 'Player Menu';
        playerMenuBtn.classList.add('playermenu-btn');
        playerMenuBtn.addEventListener('click', () => {
            clearRestartSection()

            document.querySelector('#name-input').value = '' //clear input

            Gameboard.clear()
            updateBoard()
            toggleGameboard();

            toggleCellsActiveness()
        })

        restartBtnsContainer.appendChild(restartBtn);
        restartBtnsContainer.appendChild(playerMenuBtn);

        container.appendChild(restartBtnsContainer);
    }

    const setupRestartBtn = function (onSuccess) {
        const restartBtn = document.querySelector('.restart-btn');
        if (!restartBtn) return;

        restartBtn.addEventListener('click', () => {
            clearRestartSection();

            Gameboard.clear()
            updateBoard()

            toggleCellsActiveness()

            if (typeof onSuccess === 'function') {

                //if not player turn
                //computer turn
                return onSuccess();
            }
        })
    };

    const clearRestartSection = function () {
        const winnerText = document.querySelector('.winner-text');
        const restartBtn = document.querySelector('.restart-btn');
        restartBtn.classList.add('hidden');
        document.body.appendChild(restartBtn);

        const restartBtnsContainer = document.querySelector('.restart-btn-container');
        winnerText.remove();
        restartBtnsContainer.remove();
    }

    return { setupForm, setupCells, updateBoard, toggleGameboard, displayWinner, setupRestartBtn };
})();

Game.play();

//TODO handle scenario when player selects O as a sign