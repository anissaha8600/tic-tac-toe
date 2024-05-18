// in code board representation 
// (avoid unececcary html element checking)
board = {};
for (i=1; i<10; i++) {
    board[`s${i}`] = '';
}

// constant for possible game states
const GAMESTATES = {
    'pregame' : 'pregame',
    'running' : 'running',
    'over' : 'over'
};

// curr state variables for game 
appState = {
    board : board,
    gameState : GAMESTATES.pregame,
    player : null,
    numPlayers : 2
};

// get html elements for board
const slots = [];
for (let i=1; i<10; i++) {
    const div = document.getElementById(`s${i}`);
    slots.push(div);
    div.addEventListener('click', () => {clickBoardSlot(div)});
}

// add event listener for start button
document.getElementById("begin-btn")
    .addEventListener('click', beginGame);

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
    0 : 'x',
    1 : 'o'
};

/* convert player id to svg element for game */
const playerToSVG = {
    0 : '<svg id="eiV5f1XjtR71" class="x" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="300" height="25.664356" rx="0" ry="0" transform="matrix(.707107 0.707107-.731799 0.682414 53.324565 35.177124)" fill="#1664ff" stroke-width="0"/><rect width="300" height="25.664356" rx="0" ry="0" transform="matrix(.707107-.707107 0.682414 0.731799 35.177124 246.675436)" fill="#1664ff" stroke-width="0"/></svg>',    
    1 : '<svg id="eWzTBC8scxg1" class="o" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><ellipse rx="125" ry="125" transform="translate(150 150)" fill="none" stroke="#ff2828" stroke-width="22"/></svg>'
}

/**
 * Given a player, return true iff player has met a victory condition
 * 
 * @param {boolean} player - player to check victory condition for
 * @return {boolean} - true iff player has one
 */
function checkVictory(player) {

    console.log("checking victory: ", appState);

    // get svg class corresponding to current player
    svgClassName = playerMap[player];

    // iterate through victory conditions and check to see if any are met
    let hasWon = true;
    for (cond of victoryConditions) {
        hasWon = true;

        // check individual victory condition
        for (pos of cond) {
            console.log(pos, cond, hasWon);
            if (appState.board[`s${pos}`] !== player) {
                hasWon = false;
                break;
            }
        }

        // early return if win condition met
        if (hasWon) {
            console.log(cond);
            return hasWon;
        } 
    }

    return hasWon;
}

/**
 * Register click on board 
 * 
 * @param {HTMLDivElement} slot - the tic-tac-toe slot clicked by user
 */
function clickBoardSlot(slot) {

    console.log("board slot clicked.", slot, appState);

    // no effect if game not running or slot filled already
    if (appState.gameState != GAMESTATES.running ||
        slot.innerHTML != '') {
            return;
    }

    // fill slot with svg appropriate for player
    slot.innerHTML = playerToSVG[appState.player];
    slot.classList.remove('hover');
    board[slot.id] = appState.player;

    // check victory then switch player
    if (checkVictory(appState.player)) {
        appState.gameState = GAMESTATES.over;
        return;
    }

    // switch player
    appState.player += 1;
    appState.player %= appState.numPlayers;

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

    // clear svgs from board slot divs and app state board
    slots.forEach(element => {
        element.innerHTML = "";
        appState.board[element.id] = "";
    });
}

/**
 * Begin tic-tac-toe game
 */
function beginGame() {

    console.log("game started.", appState);
    console.log("slots:", slots);
    clearBoard();
    console.log("board cleared");

    appState.player = 0;
    appState.gameState = GAMESTATES.running;

}

