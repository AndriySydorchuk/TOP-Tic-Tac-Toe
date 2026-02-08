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

Gameboard.display();