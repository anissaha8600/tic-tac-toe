// get button to start game
const btn = document.getElementById("begin-btn");
btn.addEventListener()

// in code board representation (avoid unececcary html element checking)
board = {}
for (i=1; i<10; i++) {
    board[`s${i}`] = '';
}

/* Game Slots */
const slots = {};
document.getElementsByClassName("slot").forEach(s => {
    // add event listeners for each board slot

});

/* all possible fill conditions of the 
same colour which lead to victory */
const victoryConditions = [
    // row victories
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],

    // col victories
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],

    // diagonal victories
    [1, 5, 9],
    [3, 5, 7]
];

/* convert player variable into svg class name */
const playerMap = {
    true : 'x',
    false : 'o'
};

/* convert player id to svg element for game */
const playerToSVG = {
    true : '<svg id="eiV5f1XjtR71" class="x" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="300" height="25.664356" rx="0" ry="0" transform="matrix(.707107 0.707107-.731799 0.682414 53.324565 35.177124)" fill="#1664ff" stroke-width="0"/><rect width="300" height="25.664356" rx="0" ry="0" transform="matrix(.707107-.707107 0.682414 0.731799 35.177124 246.675436)" fill="#1664ff" stroke-width="0"/></svg>',    
    false : '<svg id="eWzTBC8scxg1" class="o" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><ellipse rx="125" ry="125" transform="translate(150 150)" fill="none" stroke="#ff2828" stroke-width="22"/></svg>'
}

/**
 * Given a player, return true iff player has met a victory condition
 * 
 * @param {boolean} player - player to check victory condition for
 * @return {boolean} - true iff player has one
 */
function checkVictory(player) {

    // get svg class corresponding to current player
    svgClassName = playerMap[player];

    // iterate through victory conditions and check to see if any are met
    for (cond of victoryConditions) {
        hasWon = true;

        // check individual victory condition
        for (pos of cond) {
            if (!checkSlotSvg(pos, svgClassName)) {
                hasWon = false;
                break;
            }
        }

        // early return if win condition met
        if (hasWon) return hasWon; 
    }

    return hasWon;
}


/**
 * returns true iff div slot at boardPos contains an svg 
 * element with classname className
 * 
 * @param {int} boardPos - position on tic-tac-toe board in [1, 9]
 * @param {string} className - classname of svg element in board slot ('x' or 'o')
 * @returns {boolean} - returns true iff div slot at boardPos contains an svg element with classname className
 */
function checkSlotSvg(boardPos, className) {

    // get div of board slot specified
    div = document.getElementById(`s${boardPos}`);

    // check if div contains svg with specified classname
    return div.childNodes && 
        div.childNodes[0].nodeName === 'svg' &&
        div.childNodes[0].classList.contains(className);

}

/**
 * Clears board for new game
 */
function clearBoard() {

    // clear board slots
    document.getElementsByClassName("slot").array.forEach(element => {
        element.innerHTML = "";
    });
}

/**
 * Take turn for player
 */
function takeTurn() {

}

function beginGame() {
    playerTurn = false;
    clearBoard();

    // let players take turns untill player has won
    do {
        playerTurn = !playerTurn; // switch player
        takeTurn();

    } while (!checkVictory(player))


}

