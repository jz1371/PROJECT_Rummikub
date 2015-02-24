/**
 * File: gameLogic.js
 * ----------------------------------------------------------
 * Game logic for Rummikub game.
 *
 * @author: Jingxin Zhu
 * @date  : 2015.02.14
 * ----------------------------------------------------------
 */

(function () {

    'user strict';

    /**
     **************************************************************************************
     *
     * I. The game state is represented by the following elements:
     *
     * 1. for each player: 
     *    player:  { "initial" : true/false,  // whether initialled meld
     *               "tiles"   : [ array of indices of tiles player holds ],
     *               "lastTurn": [ array of indices of tiles player held in last turn] }
     *
     * 2. board: 2D array of tile indices of size 6 rows and 20 columns.
     *
     * 3. turnfinish: whether current turn is finished
     *
     * 4. tiles: array of 'tile".
     *    non-joker tile: {color: (RED/BLUE/ORANGE/BLACK), score: (1/2/3/.../13) }
     *    joker tile    : {color: joker", score: 0}
     *
     * 5. nplayers: number of players in current game.
     *
     * 6. nexttile: index of first invisible tile in tile pool.
     * 
     *---------------------------------------------------------------------------------- 
     *
     * II. operation: the operation player chooses for current move.
     *
     *    "PICK", pick one tile from tile pool.
     *    "MELD", make valid groups to meld.
     *    "SEND", send one tile from player to board.
     *    "RETRIEVE", retrieve one tile from board back to player.
     *    "REPLACE", replace one tile in board to another position in board.
     *    "UNDO", undo operations in this turn.
     *
     *
     **************************************************************************************
     */

    angular.module('myApp', []).factory('gameLogic', function() {

        /**
         * Checks whether given move is Ok or not.
         *
         * @param param
         * @returns {boolean}
         */
        function isMoveOk(param) {
            var playerIndex = param.turnIndexBeforeMove;
            var stateBefore = param.stateBeforeMove;
            var actualMove  = param.move;
            var expectedMove;
            var type = actualMove[1].set.value;
            try {
                switch (type) {
                    case "INIT":
                        check(Object.keys(stateBefore).length === 1 && !angular.isUndefined(stateBefore.nplayers),
                            "INIT: should assign number of players in the game."
                        );
                        expectedMove = getInitialMove(playerIndex, stateBefore.nplayers);
                        break;
                    case "PICK":
                        var typeBefore = stateBefore.type;
                        check(typeBefore !== "SEND" && typeBefore !== "RETRIEVE" && typeBefore !== "REPLACE",
                            "PICK: last type = " + typeBefore + ", but last move cannot involve move[SEND/RETRIEVE/REPLACE] towards meld"
                        );
                        expectedMove = getPickFromPoolMove(stateBefore, playerIndex);
                        break;
                    case "SEND":
                        var to   = actualMove[2].set.value;
                        expectedMove = getSendToBoardMove(stateBefore, playerIndex, to);
                        break;
                    case "RETRIEVE":
                        var from = actualMove[2].set.value;
                        expectedMove = getRetrieveFromBoardMove(stateBefore, playerIndex, from);
                        break;
                    case "REPLACE":
                        var from = actualMove[3].set.value;
                        var to   = actualMove[4].set.value;
                        expectedMove = getReplaceMove(stateBefore, playerIndex, from, to);
                        break;
                    case "MELD":
                        /* move example: (player0 is playing, 4 players in total)
                         * [{set: {key: 'delta', value: {row: 0, col: 0},   // assume board[0][0] = 13
                         *  {set: {key: 'board', value: [[-1,-1,-1,...],[-1,-1,...],...]]},
                         *  {set: {key: 'player0', value: {initial: true, tiles: [1,2,3,...12, 13], lastTurn: [1,2,3,...13]},
                         *  {setVisibility: {key: 'tile13', visibleToPlayerIndices: [0]}]  // ? need this ?
                         */
                        var turnFinish = stateBefore.turnfinish;
                        check (turnFinish === false,
                            "MELD: last type = " + typeBefore + ", but last move should be move[SEND/RETRIEVE/REPLACE] towards meld"
                        );
                        expectedMove = getMeldMove(stateBefore, playerIndex);
                        break;
                    default:
                        throw new Error("Unexpected move");
                }
                if (!angular.equals(actualMove, expectedMove)) {
                    return false;
                }
            } catch (e) {
                console.log(e.message);
                return false;
            }
            return true;
        }

        /**
         * Gets index of winning player. returns -1 if no player wins.
         * After game is on, player with no tiles left in hand is the winner.
         *
         * @param state
         * @returns {number}
         */
        function getWinner(state) {
            for (var i = 0; i < state.nplayers; i++) {
                if ( state["player" + i].tiles.length === 0
                    && state["player" + i].lastTurn.length === 0 ) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Checks if game is tied. Game is tied when tile pool is empty
         * and no player can make valid move any more.
         *
         * @returns {boolean}
         */
        function isTie() {
            return false;
        }

        /**
         * Creates the initial move.
         *
         * @param playerIndex (int) index of player who is playing.
         * @param nPlayers (int) number of players in current game.
         * @returns {*[]} array of operations in initial move.
         */
        function getInitialMove(playerIndex, nPlayers) {
            // 1. make sure player0 is initializing the game.
            check(playerIndex === 0,
                "INIT: player" + playerIndex + " is trying to move, but only player0 can play the initial move."
            );

            // 2. make sure 2 - 4 players are playing the game.
            check(nPlayers <= 4 && nPlayers >= 0,
                "INIT: nPlayers = " + nPlayers + " is given, but only 2 - 4 players are allowed."
            );

            // 3. construct the move
            var nTilesPerPlayerInitially = 14;
            var move = [
                {setTurn: {turnIndex: 0}},
                {set: {key: 'type', value: "INIT"}},
                {set: {key: 'board', value: getGameBoard()}},
            ];

            // 3.1. initialize game tiles and shuffle keys
            var tiles = [];
            var shuffleKeys = [];
            for (var i = 0; i < 106; i++) {
                tiles[i] = {set: {key: "tile" + i, value: getTileByIndex(i)}};
                shuffleKeys[i] = 'tile' + i;
            }

            // 3.2. initialize game players
            var players = [];
            for (var i = 0; i < nPlayers; i++) {
                // each player gets 14 tiles initially
                var playerTile = [];
                for (var j = 0; j < nTilesPerPlayerInitially; j++) {
                    playerTile[j] = i * nTilesPerPlayerInitially + j;
                }
                var player = {
                    set: {
                        key: 'player' + i,
                        value: {initial: false, tiles: playerTile, lastTurn: []}
                }};
                players.push(player);
            }

            // 3.3. initialize tile visibility
            var visibility = [];
            for (var i = 0; i < nPlayers; i++) {
                for (var j = 0; j < nTilesPerPlayerInitially; j++) {
                    // each player can see 14 tiles initially
                    var tileIndex = i * nTilesPerPlayerInitially + j;
                    visibility[tileIndex] = {setVisibility: {key: 'tile' + tileIndex, visibleToPlayerIndices: [i]}};
                }
            }

            move = move.concat(tiles);
            move.push({shuffle: {keys: shuffleKeys}});
            move = move.concat(players);
            move = move.concat(visibility);

            return move;
        }

        /**
         * Picks one tile from tile pool, and adds it to player's rack,
         * finishes this turn and shifts game turn to next player.
         *
         * @param stateBeforeMove (object)
         * @param playerIndex (int)
         * @returns {*[]}
         */
        function getPickFromPoolMove(stateBeforeMove, playerIndex) {

            // 1. make sure valid player.
            var player = getPlayer(stateBeforeMove, playerIndex);

            // 2. make sure picking next available tile based on last turn
            var tileToPick = stateBeforeMove.nexttile;
            check (tileToPick < 106, "Pick: picking tile" + tileToPick + ", but tile index should be [0, 106]" );

            // 3. construct move operations.
            var playerAfter = angular.copy(player);
            playerAfter.lastTurn = angular.copy(playerAfter.tiles);
            playerAfter.tiles.push(tileToPick);

            var pickMove = [
                {setTurn: {turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBeforeMove.nplayers)}},
                {set: {key: 'type', value: "PICK"}},
                {setVisibility: {key: 'tile' + tileToPick, visibleToPlayerIndices: [playerIndex]}},
                {set: {key: 'player' + playerIndex, value: playerAfter} },
                {set: {key: 'nexttile', value: tileToPick + 1}},
            ];

            return pickMove;
        }

        /**
         * Sends one tile from player to board.
         *
         * @param stateBefore
         * @param playerIndex
         * @param to (object) {tile:(int), row:(int), col:(int)}
         * @returns {*[]}
         */
        function getSendToBoardMove(stateBefore, playerIndex, to) {

            // 1. get game board.
            var board = getGameBoard(stateBefore.board);

            // 2. make sure correct player index.
            var player = getPlayer(stateBefore, playerIndex);

            // 3. make sure tile to send belongs to player
            var tileToSend = to.tile;
            check (tileToSend !== undefined,
                "Send: sending undefined tile"
            );
            check( player.tiles.indexOf(tileToSend) !== -1,
                "Send: sending tile" + tileToSend
                + ", but you should send your own tile: [" + player.tiles + "]"
            );

            // 4. make sure sending tile to an empty position within the board.
            var row = to.row;
            var col = to.col;
            checkPositionWithinBoard(board, row, col);

            var toIndex = board[row][col];
            check( (toIndex === -1),
                "Send: board["+ row + ", " + col + "] is already occupied with tile" + board[row][col]
                + ", you cannot send to this non-empty position in board."
            );

            // 5. check if game is over.
            check( getWinner(stateBefore) !== -1 || isTie() === false ), (
                "Send: game is over, you cannot move any more"
            );

            // 6. construct move operations.
            var boardAfter = angular.copy(board);
            boardAfter[row][col] = tileToSend;

            // 6.1 whether need to change tiles in lastTurn based
            var playerAfter = angular.copy(player);
            var typeFinish = stateBefore.turnfinish;
            if ( typeFinish ) {
                // need to change lastTurn, because starting a new turn towards meld
                var lastTurn = angular.copy(playerAfter.tiles);
                playerAfter.lastTurn = lastTurn;
            }
            playerAfter.tiles.splice(playerAfter.tiles.indexOf(tileToSend), 1);

            var sendMove = [
                {setTurn: {turnIndex: playerIndex}},     // 'send' move will not change game turn.
                {set: {key: 'type' , value: "SEND"}},
                {set: {key: 'todelta', value: to}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
                {set: {key: 'board', value: boardAfter}},
                {setVisibility: {key: 'tile' + tileToSend, visibleToPlayerIndices: getRestPlayers(playerIndex, stateBefore.nplayers)}}
            ];

            return sendMove;
        }

        /**
         * Retrieves one tile from board back to player, and the tile should have been
         * sent to board during current turn.
         *
         * @param stateBefore
         * @param playerIndex
         * @param from
         * @returns {*[]}
         */
        function getRetrieveFromBoardMove(stateBefore, playerIndex, from) {

            // 1. get game board.
            var board = getGameBoard(stateBefore.board);

            // 2. make sure correct player index.
            var player = getPlayer(stateBefore, playerIndex);

            // 3. make sure tile to retrieve belongs to player before this move
            var row = from.row;
            var col = from.col;
            checkPositionWithinBoard(board, row, col);
            var tileToRetrieve = board[row][col];
            check (tileToRetrieve !== -1,
                "Retrieve: no tile in board[" + row + "," + col + "]"
            );

            // 4. make sure tile retrieving belongs to player in the last turn.
            check ( player.lastTurn.indexOf(tileToRetrieve) !== -1,
                "Retrieve: retrieving tile" + tileToRetrieve
                + ", but you should retrieve your own tile: [" + player.tiles + "]"
            );

            // 5. check if game is over.
            check( getWinner(stateBefore) !== -1 || isTie() === false ), (
                "Retrieve: game is over, you cannot move any more"
            );

            // 6. construct move operations.
            var boardAfter = angular.copy(board);
            boardAfter[row][col] = -1;
            var playerAfter = angular.copy(player);
            playerAfter.tiles.push(tileToRetrieve);

            var retrieveMove = [
                {setTurn: {turnIndex: playerIndex}},     // 'retrieve' move will not change game turn.
                {set: {key: 'type' , value: "RETRIEVE"}},
                {set: {key: 'fromdelta', value: from}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
                {set: {key: 'board', value: boardAfter}},
                {setVisibility: {key: 'tile' + tileToRetrieve, visibleToPlayerIndices: [playerIndex]}}
            ];

            return retrieveMove;
        }

        /**
         * Replaces one tile in the board to another position in the board.
         * If player has not initially melded, player can only replace tile belonging to him.
         *
         * @param stateBefore
         * @param playerIndex
         * @param from
         * @param to
         * @returns {*[]}
         */
        function getReplaceMove(stateBefore, playerIndex, from, to) {
            // 1. get game board and initialize if undefined
            var board = getGameBoard(stateBefore.board);

            // 2. check from's position is within board and not empty.
            checkPositionWithinBoard(board, from.row, from.col);
            var fromIndex = board[from.row][from.col];
            check( (fromIndex !== -1),
                "Replace: no tile in board[" + from.row + "," + from.col + "] "
            );

            // 3. check to's position is within board and is empty.
            checkPositionWithinBoard(board, to.row, to.col);
            var toIndex = board[to.row][to.col];
            check( (toIndex === -1),
                "Replace: board[ " + to.row + "," + to.col + "] has been occupied with tile" + toIndex
            );

            // 4. get game player, make sure it is a valid player.
            var player = getPlayer(stateBefore, playerIndex);

            // 5. construct move
            var boardAfter = angular.copy(board);
            boardAfter[to.row][to.col] = fromIndex;
            boardAfter[from.row][from.col] = -1;

            var replaceMove = [
                {setTurn: {turnIndex: playerIndex}},
                {set: {key: 'type', value: "REPLACE"}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'fromdelta', value: from}},
                {set: {key: 'todelta', value: to}},
            ];

            return replaceMove;
        }

        /**
         * Melds current turn and shift turn to next player.
         *
         * @param stateBefore (object)
         * @param playerIndex (int) index of player who is playing.
         * @returns {Array}
         */
        function getMeldMove(stateBefore, playerIndex) {
            // 1. get game board
            var board = getGameBoard(stateBefore.board);

            // 2. get valid player
            var player = getPlayer(stateBefore, playerIndex);

            check( (getWinner(stateBefore) || isTie()),
                "Meld: cannot move any more after game is over"
            );

            // 3. check all sets in board are valid sets (runs or groups)
            var setsInBoard = [];
            // get all 'sets' in board by scanning each row of board
            for (var i = 0; i < board.length; i++) {
                setsInBoard = setsInBoard.concat(parseRowToSets(board[i]));
            }
            for (var i = 0; i < setsInBoard.length; i++) {
                var sets = getSetsOfTilesByIndex(setsInBoard[i], stateBefore);
                check (isRuns(sets) || isGroups(sets),
                    "Meld: board contains invalid sets: " + setsInBoard[i]
                );
            }

            // 4. finish initial meld?
            // for player does not finish initial meld, intial meld needs score at least 30.
            if (player.initial ===  false) {
                var score = getInitialMeldScore(stateBefore, setsInBoard, player.lastTurn);
                check (score >= 30,
                    "Meld: score is " + score + ", but initial meld needs at least 30 score"
                );
            }

            // 5. check winner
            var firstOperation;
            var hasPlayerWon = (player.tiles.length === 0 && player.lastTurn.length !== 0);
            if ( hasPlayerWon ) {
                firstOperation = {endMatch: {endMatchScores: getEndScores(playerIndex, stateBefore)}};
            } else {
                firstOperation = {setTurn: {turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBefore.nplayers)}};
            }

            var playerAfter = angular.copy(player);
            playerAfter.initial = true;
            playerAfter.lastTurn = playerAfter.tiles;

            var meldMove = [
                firstOperation,
                {set: {key: 'type', value: "MELD"}},
                {set: {key: 'turnfinish', value: true}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
            ];

            return meldMove;

        }

        //TODO: for better user experience
        //function getUndoMove() {
        //    return [];
        //}


        /* ===============   Helper Functions    =============== */

        /**
         * checks if given condition is satisfied. Throw error if not satisfied.
         *
         * @param condition condition to be tested and expected to be true.
         * @param message error message when condition is not satisfied.
         */
        function check(condition, message) {
            if (condition === false) {
                throw new Error(message);
            }
        }

        /**
         * gets player profile from state.
         *
         * @param state
         * @param playerIndex
         * @returns {*}
         */
        function getPlayer(state, playerIndex) {
            checkPlayerIndex(playerIndex, state.nplayers);
            return state["player" + playerIndex];
        }

        /**
         * gets the player's index of next turn.
         * 
         * @param playerIndex
         * @param nPlayers number of players in current game.
         * @returns {number} index of next turn.
         */
        function getPlayerIndexOfNextTurn(playerIndex, nPlayers) {
            checkPlayerIndex(playerIndex, nPlayers);
            var index = 0;
            if (playerIndex === (nPlayers - 1)) {
                index = 0;
            } else {
                index = playerIndex + 1;
            }
            return index;
        }

        function checkPlayerIndex(playerIndex, nPlayers) {
            check((playerIndex >= 0) && (playerIndex < nPlayers),
                "checkPlayerIndex, [playerIndex:  " + playerIndex + ", nPlayers: " + nPlayers);
        }

        /**
         * gets current game board, making sure it has initialized.
         * 
         * @param board
         * @returns {*}
         */
        function getGameBoard(board) {
            if (board === undefined) {
                board = getInitialBoard();
            }
            return board;
        }

        /**
         * initializes game board.
         * 
         * @returns {*[]}
         */
        function getInitialBoard() {
            var board = [[], [], [], [], [], []];
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 20; j++) {
                    board[i].push(-1);
                }
            }
            return board;
        }

        function getRestPlayers(playerIndex, nPlayers) {
            var arr = [];
            for (var i = 0; i < nPlayers; i++) {
                arr.push(i);
            }
            //arr.remove(playerIndex);
            arr.splice(arr.indexOf(playerIndex), 1);

            return arr;
        }

        /**
         * checks given (row, col) is within board's boundary,
         * p.s., board is guaranteed not undefined before calling.
         *
         * @param board
         * @param row
         * @param col
         */
        function checkPositionWithinBoard(board, row, col) {
            check (row !== undefined && col !== undefined,
                "checkPositionWithinBoard: (row, col) = (" + row + "," +  col + ") is undefined"
            );
            var rows = board.length;
            var cols = board[0].length;
            check( (row >= 0 && row < rows) && (col >= 0 && col < cols),
                "checkPositionWithinBoard: position out Of board, [row: " + row + ", col: " + col + "]"
            );
        }

        /**
         * gets tile object by tile index.
         *
         * example: index = 1 -> {color: "blue", score:1}
         *
         * @param index (int)
         * @returns {{color: *, score: *}}
         */
        function getTileByIndex(index) {
            check (index >=0  && index < 106, "Illegal index");
            var color;
            var score;
            if (index === 104 || index === 105) {
                color = "joker";
                score = 0;
            } else {
                if (index < 26) {
                    color = 'blue';
                } else if (index < 52) {
                    color = 'red';
                } else if (index < 78) {
                    color = 'black';
                } else {
                    color = 'orange';
                }
                score = (index % 13 ) + 1;
            }
            return {color: color, score: score};
        }

        /**
         * parses one row in game board into array of 'sets' in this row.
         *
         * example: row = [1,2,3,-1,-1,-1,4,8,9,10,-1,-1] -> [[1,2,3],[4,8,9,10]]
         *
         * @param row (array[int]) array of tile indices.
         * @returns {Array}
         */
        function parseRowToSets(row) {
            var result = [];
            var sets = [];
            for (var i = 0; i < row.length; i++) {
                var tileIndex = row[i];
                if (tileIndex === -1) {
                    // current set ends
                    if (sets.length !== 0) {
                        result.push(sets);
                        sets = [];
                    }
                } else {
                    check(tileIndex >= 0 && tileIndex < 106,
                        "tileIndex: " + tileIndex
                    );
                    sets.push(tileIndex);
                }
            }
            if (sets.length !== 0) {
                result.push(sets);
            }

            return result;
        }

        /**
         * valid runs: contains 3 or more tiles, and
         *             tiles have the same color, and
         *             tile's score are in consecutive number order. Joker can substitute any tile.
         *
         * runs examples: [black3,black4,black5]; [red7,red8,red9,red10,red11]
         *
         * @param sets (array[{color: .., score: ..}])
         * @returns {boolean}
         */
        function isRuns(sets) {
            var len = sets.length;
            if (len < 3 || len > 13) {
                return false;
            }
            var sameColor;
            var expectScore = 0;
            for (var i = 0; i < len; i++) {
                var color = sets[i].color;
                var score = sets[i].score;
                if (color !== 'joker') {
                    // 1. check same color
                    if (sameColor === undefined) {
                        sameColor = color;
                    }
                    if (sameColor !== color) {
                        return false;
                    }

                    // 2. check number, cannot repeat number in current numbers;
                    if (expectScore === 0) {
                        expectScore = score;
                    }
                    if (score !== expectScore) {
                        return false;
                    }
                }
                if (expectScore !== 0) {
                    expectScore += 1;
                }
            }
            return true;
        }

        /**
         * valid groups: sets contain 3 or 4 tiles, and
         *               different colors with each other, and
         *               tiles have the same tile score. joker can substitute any tile in need.
         *
         * groups examples: [black3,red3,joker]; [red7,orange7,blue7,black7]
         *
         * @param sets (array[{color: .., score: ..}])
         * @returns {boolean}
         */
        function isGroups(sets) {
            var length = sets.length;
            if (length !== 3 && length !== 4) {
                return false;
            }
            var sameScore;
            var colors = [];
            for (var i = 0; i < length; i++) {
                var color = sets[i].color;
                var score = sets[i].score;
                if (color !== 'joker') {
                    // 1. check scores are the same
                    if (sameScore === undefined) {
                        // 1st score from the sets
                        sameScore = score;
                    }
                    if (score !== sameScore) {
                        return false;
                    }

                    // 2. check has different colors.
                    if (colors.indexOf(color) !== -1) {
                        // duplicated color appears
                        return false;
                    }
                    colors.push(color);
                }
            }
            return true;
        }

        /**
         * gets the score for player's initial meld.
         * In initial meld, only sets contain no tiles that from opponents can be calculated,
         * and joker's score is 0.
         *
         * @param state
         * @param setsInBoard
         * @param tilesLastTurn (array) of tile indices that player holding in last turn.
         * @returns {number}
         */
        function getInitialMeldScore(state, setsInBoard, tilesLastTurn) {
            var score = 0;
            for (var i = 0; i < setsInBoard.length; i++) {
                var tilesAllFromPlayer = true;
                var setScore = 0;
                for (var j = 0; j < setsInBoard[i].length; j++) {
                    var tileIndex = setsInBoard[i][j];
                    setScore += state["tile" + tileIndex].score;
                    if (tilesLastTurn.indexOf(tileIndex) === -1) {
                        // this tile is from opponent
                        tilesAllFromPlayer = false;
                        break;
                    }
                }
                // only add score of sets in which all tiles are from the player who is playing.
                if (tilesAllFromPlayer) {
                    score += setScore;
                }
            }
            return score;
        }

        function getSetsOfTilesByIndex(setsOfTileIndices, state) {
            var result = [];
            for (var i = 0; i < setsOfTileIndices.length; i++) {
                var tile = state["tile" + setsOfTileIndices[i]];
                result.push(tile);
            }
            return result;
        }

        /**
         * get scores of each player at the end of the game.
         * winner gets the scores of tiles that loser still holds at the end.
         *
         * example: player0: []     // winner
         *          player1: [{color:'blue',score:4}, {color:'black',score:5}] // still in player1's hand
         *       -> player0's score = 9, player1's score = -9
         *
         * @param winnerIndex (int) of player who won the game.
         * @param state
         * @returns {Array}
         */
        function getEndScores(winnerIndex, state) {
            var result = [];
            var scoresFromAllLosers = 0;
            var nPlayers = state.nplayers;
            for (var i = 0; i < nPlayers; i++) {
                // calculating score for each player who is not winner
                if (i !== winnerIndex) {
                    var tilesRemaining = state["player" + i].tiles;
                    var score = 0;
                    for (var j = 0; j < tilesRemaining.length; j++) {
                        // adding each tile's score
                        var tile = state["tile" + tilesRemaining[j]];
                        if (tile.color === 'joker') {
                            // joker tile's score is 30
                            score -= 30;
                        } else {
                            score -= tile.score;
                        }
                    }
                    result[i] = score;
                    scoresFromAllLosers += score;
                }
            }
            // winner score is all scores from losers
            result[winnerIndex] = - scoresFromAllLosers;
            return result;
        }

        return {
            isMoveOk: isMoveOk,
            getInitialMove: getInitialMove,
            getTileByIndex: getTileByIndex
        };

    });
}());
