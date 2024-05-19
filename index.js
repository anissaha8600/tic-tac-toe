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

// winner message
const winnerHeader = document.getElementById('winner-status');

/* possible messages at end of game */
const WINNER_MESSAGES = {
    0 : 'Blue Wins!',
    1 : 'Red Wins!',
    null : 'Tie Game!'
};

const WINNER_CSS = {
    0 : 'winner-blue',
    1 : 'winner-red',
    null : 'winner-tie',
    none : 'winner-none'
}

// curr state variables for game 
appState = {
    board : board,
    gameState : GAMESTATES.pregame,
    player : null,
    numPlayers : 2,
    winner : null
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

/* available victories (will be removed when no longer possible in game)*/
availableVictories = {};
for (i = 0; i<victoryConditions.length; i++) {
    availableVictories[i] = true;
}

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

    console.log("checking victory: ", appState, availableVictories);

    // iterate through victory conditions and check to see if any are met
    let hasWon = true;
    for (let vicId of Object.keys(availableVictories)) {

        hasWon = true;
        // check each board position for victory cond
        for (pos of victoryConditions[vicId]) {
            if (appState.board[`s${pos}`] !== player) {
                hasWon = false;
                break;
            }
        }

        // early return if victorious
        if (hasWon) return true;
        
    }

    return false; // no victory conditions met
}

/**
 * Check if game is tied 
 * @returns {boolean} iff game is no longer winnable by either player
 */
function checkTie() {
    
    for (let vicId of Object.keys(availableVictories)) {

        const seen = []; // seen players on a row, col or diagonal
        for(pos of victoryConditions[vicId]) {

            // check player at position
            const val = appState.board[`s${pos}`];
            if (val !== '' && !seen.includes(val)) {
                seen.push(val);
            }

            // victory no longer available
            if (seen.length > 1) {
                delete availableVictories[vicId];
                break;
            }
        }   
    }

    // tie if no victory options available
    if (Object.keys(availableVictories).length == 0) {
        appState.gameState = GAMESTATES.over;
        return true;
    }

    return false;
}

/**
 * Register click on board 
 * 
 * @param {HTMLDivElement} slot - the tic-tac-toe slot clicked by user
 */
function clickBoardSlot(slot) {

    console.log("board slot clicked.", slot, appState, availableVictories);

    // no effect if game not running or slot filled already
    if (appState.gameState != GAMESTATES.running ||
        slot.innerHTML != '') {
            return;
    }

    // fill slot with svg appropriate for player
    slot.innerHTML = playerToSVG[appState.player];
    slot.classList.remove('slot');
    slot.classList.add('slot-filled');
    board[slot.id] = appState.player;

    // check for tie 
    if (checkTie()) {
        appState.gameState = GAMESTATES.over;
    }

    // check victory then switch player (loser goes first)
    if (appState.gameState !== GAMESTATES.over &&
        checkVictory(appState.player)) {
        appState.gameState = GAMESTATES.over;
        appState.winner = appState.player;
    }

    if (appState.gameState === GAMESTATES.over) {
        winnerHeader.innerHTML = WINNER_MESSAGES[appState.winner];
        winnerHeader.classList.remove("winner-none");
        winnerHeader.classList.add(WINNER_CSS[appState.winner]);
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
 * @returns {boolean} returns true iff div slot at boardPos contains an svg element with classname className
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
        element.classList.remove("slot-filled");
        element.classList.add("slot");
    });

    // empty board means all victory positions are available
    for (i=0; i<victoryConditions.length; i++) {
        availableVictories[i] = true;
    }

    winnerHeader.classList = ['winner-none']; // hide winner status msg

    appState.winner = null; // unset winner
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

