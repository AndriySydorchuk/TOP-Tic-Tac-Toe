const Gameboard = (function () {
    const board = [
        ['X', 'X', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X']
    ];
    const display = function () {
        for (const line of board) {
            console.log(`${line}\n`);
        }
    }

    return { display }
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

const player = createPlayer('Furman', 'X');
const computer = createPlayer('Computer', 'O');
