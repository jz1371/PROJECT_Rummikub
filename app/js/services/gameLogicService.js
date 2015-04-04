/**
 * File: gameLogicService.js
 * ----------------------------------------------------------
 * Game logic for Rummikub game.
 *
 * @author: Jingxin Zhu
 * @date  : 2015.02.14
 * ----------------------------------------------------------
 */

(function () {

    'use strict';

    /**
     **************************************************************************************
     *
     * I. Elements in game state.
     *
     * 1. board: 2D array.
     *      Each element is tileIndex ([0, 105]), -1 means no tile at that position. 
     *      1.1  game board   (6 x 18)
     *      1.2  player board (nplayers x tiles in each player's hand)
     *     
     *      e.g. 2-players initial scenario:
     *      row 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17  col
     *      [ [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  0  ----------
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  1      |
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  2  game board    
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  3      |
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  4      |
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  5  -----------   
     *        [ 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],                6 // 1st player's hand     
     *        [14,15,16,17,18,19,20,21,22,23,24,25,26]              ]  7 // 2nd player's hand 
     *
     * 2. deltas: 1D array, recording the move history in current turn.
     *      Each element is like: {tileIndex:*, from: {row: * ,col: * }, to: {row: * ,col: *} }
     *
     * 3. type:  'INIT' / "MOVE" / "PICK" / "MELD" / "UNDO"
     * 
     * 4. trace: {nplayers: , intial: [], nexttile:  * }
     *
     * 5. tiles: array of tile, each tile is {tileIndex: {score: , color: }}
     * 
     *---------------------------------------------------------------------------------- 
     *
     * II Moves in game process.
     *  
     *  0 - setTurn : {setTurn : {turnIndex: 0}},
     *  0 - endMatch: {endMatch: {endMatchScores: [90, -90]}}
     *  1 - setType : {set: {key: 'type', value: "PICK"}}
     *  2 - setBoard: {set: {key: 'board', value: [[..]]}}
     *  3 - setDelta: {set: {key: 'deltas', value: [...]}}
     *  4 - setTrace: {set: {key: 'trace', value: {}}
     * *5 - setVisibility: {setVisibility: {key: 'tile28', visibleToPlayerIndices: [1]}},
     *  
     *
     * II. Operations: the operation player chooses for current move.
     *
     *    "PICK", pick one tile from tile pool. // will ends current turn and shifts to next player
     *
     *    "MELD", make valid groups to meld.    // will ends turn and shifts to next players
     *      | --- "SEND"    , send one tile from player to board.
     *      | --- "RETRIEVE", retrieve one tile (sent to board in current turn) from board back to player.
     *      | --- "REPLACE" , replace one tile in board to another position in board.
     *
     *    "UNDO", undo operations in this turn.
     *
     *
     **************************************************************************************
     */
    angular.module('myApp').factory('gameLogicService', function() {

        /**
         * Checks whether given move is Ok or not.
         *
         * @param param (object) {turnIndexBeforeMove:(int), stateBeforeMove: (object), move:[]}
         * @returns {boolean}
         */
        function isMoveOk(param) {
            var playerIndex = param.turnIndexBeforeMove;
            var stateBefore = param.stateBeforeMove;
            var actualMove  = param.move;
            try {
                var expectedMove = createMove(stateBefore, playerIndex, actualMove);
                if (!angular.equals(actualMove, expectedMove)) {
                    return false;
                }
            } catch (e) {
                console.log(e.message);
                return false;
            }
            return true;
        }

        function createMove(stateBefore, playerIndex, actualMove) {
            var moveType = actualMove[1].set.value;
            if (moveType !== "INIT") {
                check( !isGameOver(stateBefore),
                    "Game is over, you cannot move any move"
                );
            }
            var expectedMove;
            //var board = stateBefore.board;
            //var deltas = stateBefore.deltas;
            //var trace = stateBefore.trace;

            switch (moveType) {
                case "INIT":
                    var nPlayers = actualMove[2].set.value.nplayers;
                    expectedMove = getInitialMove(playerIndex, nPlayers);
                    break;
                case "MOVE":
                    var deltas = actualMove[3].set.value;
                    var delta = deltas[deltas.length - 1];
                    expectedMove = getMoveMove(playerIndex, stateBefore, delta);
                    break;
                case "PICK":
                    expectedMove = getPickMove(playerIndex, stateBefore);
                    break;
                case "MELD":
                    expectedMove = getMeldMove(playerIndex, stateBefore);
                    break;
                case "UNDO":
                    expectedMove = getSingleUndoMove(playerIndex, stateBefore);
                    break;
                default:
                    throw new Error("Unexpected move");
            }
            return expectedMove;
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

            // whether player has made initial meld
            var initial = [];
            for (var i = 0; i < nPlayers; i++) {
                initial.push(false);
            }

            // 3. construct the move
            var nTilesPerPlayerInitially = 14;
            var move = [
                {setTurn: {turnIndex: 0}},
                {set: {key: 'type', value: "INIT"}},
                {set: {key: 'trace', value: {nplayers: nPlayers, initial: initial, nexttile: nPlayers * 14}}},
                {set: {key: 'board', value: getInitialBoard(nPlayers)}},
                {set: {key: 'deltas', value: []}}
            ];

            // 3.1. initialize game tiles and shuffle keys
            var tiles = [];
            var shuffleKeys = [];
            for (var tileIndex = 0; tileIndex< 106; tileIndex++) {
                tiles[tileIndex] = {set: {key: "tile" + tileIndex, value: getTileByIndex(tileIndex)}};
                shuffleKeys[tileIndex] = 'tile' + tileIndex;
            }

            // 3.3. initialize tile visibility
            var visibility = [];
            for (var ii = 0; ii < nPlayers; ii++) {
                for (var jj = 0; jj < nTilesPerPlayerInitially; jj++) {
                    // each player can see 14 tiles initially
                    tileIndex = ii * nTilesPerPlayerInitially + jj;
                    visibility[tileIndex] = {setVisibility: {key: 'tile' + tileIndex, visibleToPlayerIndices: [ii]}};
                }
            }

            move = move.concat(tiles);
            move.push({shuffle: {keys: shuffleKeys}});
            move = move.concat(visibility);
            return move;
        }

        /**
         *
         * @param playerIndex
         * @param stateBefore
         * @param delta
         * @returns {*[]}
         */
        function getMoveMove(playerIndex, stateBefore, delta, undo) {
            var tileToMove = delta.tileIndex;
            var from = delta.from;
            var to = delta.to;

            // 1. get game board
            var board = stateBefore.board;
            var deltas = stateBefore.deltas;

            var playerRow = getPlayerRow(playerIndex);

            // 2.1 check from's position is within board, not empty and consistent as declared in delta
            checkPositionWithinBoard(board, from.row, from.col);

            check(board[from.row][from.col] === tileToMove,
                "[MOVE] tile" + tileToMove + " is not at board[" + from.row + "][" + from.col + "]");

            check(tileToMove !== -1,
                "[MOVE] no tile at board[" + from.row + "][" + from.col + "]" );

            // 2.2 check to's position is within board and is empty
            checkPositionWithinBoard(board, to.row, to.col);

            check(board[to.row][to.col] === -1,
                "[MOVE] board[" + to.row + "][" + to.col + "] has been occupied by tile" + board[to.row][to.col] );

            // 2.3 player cannot move one tile from other player's hand
            check( from.row >=0 && from.row < getGameBoardRows() ||   // from game board
                from.row === playerRow,
                "[MOVE] you cannot move tiles from other player's hand" );

            // 2.4 player cannot move one tile to other player's hand
            check( to.row >=0 && to.row < getGameBoardRows() ||     // to game board
                to.row ===  playerRow,
                "[MOVE] you cannot move tiles to other player's hand" );

            // 3. player can only move his own tile if has not finished initial meld
            if (stateBefore.trace.initial[playerIndex] === false) {
                // if player has not yet finished initial meld, he can only move from his hand
                check(from.row === playerRow || isTileSentToBoardInCurrentTurnByPlayer(tileToMove, playerIndex, deltas),
                    "[MOVE] cannot move other player's tiles on board, since you have not finished initial meld" );
            }

            // null means every player can see
            var visibility = null;

            // 4. can only send tile which was sent to game board in current turn
            // back to player hand
            if (to.row === playerRow) {
                check( from.row === playerRow  ||   // move tiles in hand
                    isTileSentToBoardInCurrentTurnByPlayer(tileToMove, playerIndex, deltas), // retrieve own tile from board
                "[MOVE] cannot retrieve tile" + tileToMove+ " back to hand because" +
                    "it is not sent by board by you in current turn" );
                // after back to hand, only player himself can see that tile
                visibility = [playerIndex];
            }

            // 5. construct move operations.
            var boardAfter = angular.copy(board);
            boardAfter[from.row][from.col] = -1;
            boardAfter[to.row][to.col] = tileToMove;

            var deltasAfter = angular.copy(deltas);
            var moveTypeAfter = "MOVE";
            if (undo !== undefined && undo === true) {
                deltasAfter.splice(deltasAfter.length - 1, 1);
                moveTypeAfter = "UNDO";
            } else {
                deltasAfter.push(delta);
            }

            return [
                {setTurn: {turnIndex: playerIndex}},        // this move will not change turnIndex
                {set: {key: 'type', value: moveTypeAfter}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'deltas', value: deltasAfter}},
                {setVisibility: {key: 'tile' + tileToMove, visibleToPlayerIndices: visibility}}
            ];
        }

        /**
         *
         * @param playerIndex
         * @param stateBefore
         * @returns {*[]}
         */
        function getPickMove(playerIndex, stateBefore) {

            var playerRow = getGameBoardRows() + playerIndex;

            // 1. make sure player did not sent any tile to board during this turn.
            var tilesSentToBoardThisTurn = getTilesSentToBoardThisTurn(stateBefore.deltas, playerRow);
            check(tilesSentToBoardThisTurn.length === 0,
                "[PICK] you cannot pick, since you sent tile to board."
            );

            // 2. player is able to replace tiles throughout the board,
            //    but before picking, he should restore the 'able-to-meld' state
            //    and retrieve all tiles he sent to board in this turn.
            check(isMeldOk(stateBefore, stateBefore.board, playerIndex, true),
                "[PICK] you should not mess up the board, if you want to pick" );

            // 3. make sure picking next available tile based on last turn
            var tileToPick = stateBefore.trace.nexttile;
            check(tileToPick >= 0 && tileToPick < 106,
                "[PICK] no more tiles  left for picking");

            // 4. construct move operations.
            var boardAfter = angular.copy(stateBefore.board);
            boardAfter[playerRow].push(tileToPick);

            var traceAfter = angular.copy(stateBefore.trace);
            traceAfter.nexttile = tileToPick + 1;

            return [
                {setTurn: {turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBefore.trace.nplayers)}},
                {set: {key: 'type', value: "PICK"}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'deltas', value: []}},     // pick move will clear delta history
                {set: {key: 'trace', value: traceAfter}},
                {setVisibility: {key: 'tile' + tileToPick, visibleToPlayerIndices: [playerIndex]}}
            ];
        }

        /**
         *
         * @param playerIndex
         * @param stateBefore
         * @returns {*[]}
         */
        function getMeldMove(playerIndex, stateBefore) {
            var board = stateBefore.board;
            var playerRow = getPlayerRow(playerIndex);
            var deltas = stateBefore.deltas;

            // 0. check player has sent as least one tile from hand to board during this turn.
            var tilesSentToBoardThisTurn = getTilesSentToBoardThisTurn(deltas, playerRow);
            check ( tilesSentToBoardThisTurn.length !== 0,
                "[MELD] you cannot meld since no tiles sent to board in this turn"
            );


            // 1. check all sets in board are valid sets (runs or groups)
            check (isMeldOk(stateBefore, board, playerIndex ,stateBefore.trace.initial[playerIndex]),
                "[MELD] meld is not ok" );

            // 2. check winner
            var firstOperation;
            var hasPlayerWon = board[playerRow].length === 0;
            if (hasPlayerWon === false) {
                hasPlayerWon = true;
                for (var i = 0; i < board[playerRow].length; i++) {
                    if (board[playerRow][i] !== -1) {
                        hasPlayerWon = false;
                        break;
                    }
                }
            }
            // player has no tile left in hand, or only has -1 tile in hand, he wins
            if ( hasPlayerWon ) {
                firstOperation = {endMatch: {endMatchScores: getEndScores(playerIndex, stateBefore)}};
            } else {
                firstOperation = {setTurn: {
                    turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBefore.trace.nplayers)}};
            }

            // 3. construct move
            var boardAfter = angular.copy(stateBefore.board);
            // clear all empty slots for player's hand
            for (var col = boardAfter[playerRow].length; col >= 0; col-- ) {
                if (boardAfter[playerRow][col] === -1) {
                    boardAfter[playerRow].splice(col, 1);
                }
            }
            var traceAfter = angular.copy(stateBefore.trace);
            traceAfter.initial[playerIndex] = true;
            return [
                firstOperation,
                {set: {key: 'type', value: "MELD"}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'deltas', value: []}},     // meld move will clear delta history
                {set: {key: 'trace', value: traceAfter}}
            ];

        }

        //TODO: for better user experience
        /**
         * Undo moves by player in current turn
         * @param playerIndex
         * @param stateBefore
         */
        function getSingleUndoMove(playerIndex, stateBefore) {
            var deltas = stateBefore.deltas;
            var delta = deltas[deltas.length - 1];
            // reverse the last delta, and then make that move
            var deltaUndo = {tileIndex: delta.tileIndex , from: delta.to, to: delta.from};
            var moveUndo = getMoveMove(playerIndex, stateBefore, deltaUndo, true);
            moveUndo[1].set.value = "UNDO";
            return moveUndo;
        }

        /**
         *
         * @param stateBefore
         * @param playerIndex
         * @returns {Array}
         */
        function getPossibleMoves(stateBefore,  playerIndex) {
            var possibleMoves = [];
            try {
                // "PICK" is possible
                possibleMoves.push(getPickMove(playerIndex, stateBefore));

                // can meld from player's own hand?


            } catch (e) {

            }
            return possibleMoves;
        }

        /** ******************************************************
         ************        Helper Functions    *****************
         *********************************************************/

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

        function checkPlayerIndex(playerIndex, nPlayers) {
            check( playerIndex >= 0 && playerIndex < nPlayers,
                "checkPlayerIndex, [playerIndex:  " + playerIndex + ", nPlayers: " + nPlayers);
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
            if (playerIndex === nPlayers - 1) {
                index = 0;
            } else {
                index = playerIndex + 1;
            }
            return index;
        }

        /**
         * initializes game board.
         *
         * @param nPlayers
         * @returns {Array}
         */
        function getInitialBoard(nPlayers) {
            var board = [
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            ];
            var tileIndex = 0;
            var tilesInHandInitially = 14;
            // push 14 tiles for each player
            for (var i = 0; i < nPlayers; i++) {
                var row = [];
                for (var j = 0; j < tilesInHandInitially; j++) {
                    row.push(tileIndex);
                    tileIndex++;
                }
                board.push(row);
            }
            return board;
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
            var cols = board[row].length;
            check( row >= 0 && row < rows && col >= 0 && col < cols,
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
                score = index % 13  + 1;
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
            var tileSet = [];
            for (var i = 0; i < row.length; i++) {
                var tileIndex = row[i];
                if (tileIndex === -1) {
                    // current set ends
                    if (tileSet.length !== 0) {
                        result.push(tileSet);
                        tileSet = [];
                    }
                } else {
                    check(tileIndex >= 0 && tileIndex < 106,
                        "tileIndex: " + tileIndex
                    );
                    tileSet.push(tileIndex);
                }
            }
            // in case last tileSet ends at last element of row
            if (tileSet.length !== 0) {
                result.push(tileSet);
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

        /**
         * check whether current board can meld.
         *
         * @param stateBefore
         * @param board
         * @param playerIndex
         * @param initial
         * @returns {boolean}
         */
        function isMeldOk(stateBefore, board, playerIndex, initial) {
            var setsInBoard = [];
            // get all 'sets' in game board by scanning each row of board
            for (var i = 0; i < getGameBoardRows(); i++) {
                setsInBoard = setsInBoard.concat(parseRowToSets(board[i]));
            }
            for (var ii = 0; ii < setsInBoard.length; ii++) {
                var sets = getSetsOfTilesByIndex(setsInBoard[ii], stateBefore);
                if ( !isRuns(sets) && !isGroups(sets) ) {
                    console.log("isMeldOk, invalid sets: [" + setsInBoard[ii] + "]");
                    return false;
                }
            }
            if (initial === false) {
                var tilesSentToBoardThisTurn = getTilesSentToBoardThisTurn(stateBefore.deltas, getPlayerRow(playerIndex));
                var score = getInitialMeldScore(stateBefore, setsInBoard, tilesSentToBoardThisTurn);
                check(score >= 30,
                    "[MELD]: you must score at least 30 (without joker tile) for your initial meld" );
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
        function getInitialMeldScore(state, setsInBoard, tilesSentThisTurn) {
            var score = 0;
            for (var i = 0; i < setsInBoard.length; i++) {
                var tilesAllFromPlayer = true;
                var setScore = 0;
                for (var j = 0; j < setsInBoard[i].length; j++) {
                    var tileIndex = setsInBoard[i][j];
                    setScore += state["tile" + tileIndex].score;
                    if (tilesSentThisTurn.indexOf(tileIndex) === -1) {
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


        /**
         * check wether game is over.
         *
         * @param state
         * @returns {boolean}
         */
        function isGameOver(state) {
            return getWinner(state.board, state.deltas) !== -1 || isTie(state);
        }

        /**
         *
         * get index of winning player. returns -1 if no player wins.
         * After game is on, player with no tiles left in hand is the winner.
         * @param board
         * @returns {number}
         */
        function getWinner(board, deltas) {
            var hasLoser = false;
            var winner = -1;
            // check each player's hand
            for (var i = getGameBoardRows(); i < board.length; i++) {
                if (board[i].length === 0 && deltas.length === 0) {
                    winner = i;
                } else {
                    if (hasLoser === false) {
                        hasLoser = true;
                    }
                }
            }
            return hasLoser ? winner : -1;
        }

        /**
         * check if game is tied. Game is tied when tile pool is empty
         * or no player can make valid move any more.
         * @returns {boolean}
         */
        function isTie(state) {
            var isTied = state.trace.nexttile >= 106;
            //if (isTied === false) {
            //}
            return isTied;
        }

        /**
         * return true if tileIndex is sent from player's hand to game board in current turn.
         * @param tileIndex
         * @param playerIndex
         * @param deltas
         * @returns {boolean}
         */
        function isTileSentToBoardInCurrentTurnByPlayer(tileIndex, playerIndex, deltas) {
            var playerRow = getPlayerRow(playerIndex);
            for (var i = 0 ; i < deltas.length; i++) {
                if (deltas[i].tileIndex === tileIndex &&
                    deltas[i].from.row === playerRow ) {
                    return true;
                }
            }
            return false;
        }

        /**
         * get the row in board that belongs to given player's hand
         * @param playerIndex
         * @returns {*}
         */
        function getPlayerRow(playerIndex) {
            return getGameBoardRows() + playerIndex;
        }

        function getGameBoardRows() {
            return 6;
        }

        //function getGameBoardCols() {
        //    return 18;
        //}

        /**
         *
         * @param deltas
         * @param playerRow
         * @returns {Array} [tileIndex] sent to board by current player in this turn
         */
        function getTilesSentToBoardThisTurn(deltas, playerRow) {
            var result = [];
            var count = 0;
            for (var i = 0; i < deltas.length; i++) {
                var tileIndex = deltas[i].tileIndex;
                var from = deltas[i].from;
                var to = deltas[i].to;
                if (from.row === playerRow && to.row !== playerRow) {
                    count++;
                    result.push(tileIndex);
                } else if (from.row !== playerRow && to.row === playerRow) {
                    count--;
                    var index = result.indexOf(tileIndex);
                    result.splice(index, 1);
                }
            }
            check(result.length === count, "get tiles sent wrong");
            return result;
        }

        function findAllSetInHand(playerHand, state) {
            // try to find all groups in hand
            var hand = angular.copy(playerHand);
            var sortByScore = sortBy("score", state);
            hand.sort(sortByScore);
            console.log("ser: " + hand);

        }

        /**
         *
         * @param type
         * @returns {Function}
         */
        function sortBy(type, state) {
            return function (tileIndexA, tileIndexB) {
                var tileA = state["tile" + tileIndexA];
                var tileB =  state["tile" + tileIndexB];
                if (tileA !== undefined && tileB !== undefined) {
                    if (type === "score") {
                        return tileA.score - tileB.score;
                    } else if (type === "color") {
                        return (tileA.color > tileB.color) ? 1 : (tileA.color < tileB.color) ? -1 : (tileA.score - tileB.score);
                    }
                }
                return 1;
            }
        }

        /** *********************************
         * ======= Return functions ========
         ***********************************/
        return {
            isMoveOk: isMoveOk,
            createMove: createMove,
            getTileByIndex: getTileByIndex,
            getPossibleMoves: getPossibleMoves,
            findAllSetInHand: findAllSetInHand,
            sortBy: sortBy,

            createInitialMove: getInitialMove,
            createPickMove: getPickMove,
            createMeldMove: getMeldMove,
            createSingleUndoMove: getSingleUndoMove,
            createMoveMove: getMoveMove

        };

    });
}());
