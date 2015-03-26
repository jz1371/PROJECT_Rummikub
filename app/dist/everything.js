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
     * I. The game state is represented by the following elements:
     *
     * 1. for each player: 
     *    player:  {
     *               "initial" : true/false,       // whether initialled meld
     *               "tiles"   : [ array of indices of tiles player holds in hand ],
     *             }
     *
     * 2. board: 2D array of tile indices of size 6 rows and 20 columns.
     *
     * 3. tilesSentToBoardThisTurn: array of tiles, which are sent to board in current turn.
     *
     * 4. tiles: array of 'tile".
     *    non-joker tile: {color: (RED/BLUE/ORANGE/BLACK), score: (1/2/3/.../13) }
     *    joker tile    : {color: joker", score: 0}
     *
     * 5. nplayers: number of players in current game.
     *
     * 6. nexttile: index of first invisible tile in tile pool.
     *
     * 7. type: "PICK" / "MELD" / "SEND" / "RETRIEVE" / "REPLACE" / "UNDO"
     * 
     *---------------------------------------------------------------------------------- 
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
    angular.module('myApp', []).factory('gameLogicService', function() {


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

        /**
         * Creates move based on move type.
         *
         * @param stateBefore
         * @param playerIndex
         * @param actualMove
         * @returns {expectedMove} [Array of operations]
         */
        function createMove(stateBefore, playerIndex, actualMove) {
            var moveType = actualMove[1].set.value;
            if (moveType !== "INIT") {
                check ( !isGameOver(stateBefore),
                    "Game is over, you cannot move any more"
                );
            }
            var expectedMove;
            switch (moveType) {
                case "INIT":
                    var nPlayers = actualMove[2].set.value;
                    expectedMove = getInitialMove(playerIndex, nPlayers);
                    break;
                case "PICK":
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
                    var replace_from = actualMove[3].set.value;
                    var replace_to   = actualMove[4].set.value;
                    expectedMove = getReplaceMove(stateBefore, playerIndex, replace_from, replace_to);
                    break;
                case "MELD":
                    expectedMove = getMeldMove(stateBefore, playerIndex);
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

            // 3. construct the move
            var nTilesPerPlayerInitially = 14;
            var move = [
                {setTurn: {turnIndex: 0}},
                {set: {key: 'type', value: "INIT"}},
                {set: {key: 'nplayers', value: nPlayers}},
                {set: {key: 'tilesSentToBoardThisTurn', value: []}},
                {set: {key: 'board', value: getGameBoard(undefined)}},
            ];

            // 3.1. initialize game tiles and shuffle keys
            var tiles = [];
            var shuffleKeys = [];
            for (var tileIndex = 0; tileIndex< 106; tileIndex++) {
                tiles[tileIndex] = {set: {key: "tile" + tileIndex, value: getTileByIndex(tileIndex)}};
                shuffleKeys[tileIndex] = 'tile' + tileIndex;
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
                        value: {initial: false, tiles: playerTile}
                }};
                players.push(player);
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
            move = move.concat(players);
            move = move.concat(visibility);
            move.push({set: {key: 'nexttile', value: nPlayers * 14}});

            return move;
        }

        /**
         * Picks one tile from tile pool, and adds it to player's hand,
         * finishes this turn and shifts game turn to next player.
         *
         * @param stateBeforeMove (object)
         * @param playerIndex (int)
         * @returns {*[]}
         */
        function getPickFromPoolMove(stateBeforeMove, playerIndex) {

            // 1. make sure valid player.
            var player = getPlayer(stateBeforeMove, playerIndex);

            // 2. make sure player did not sent any tile to board during this turn.
            check (stateBeforeMove.tilesSentToBoardThisTurn.length === 0,
                "PICK: you cannot pick, since you sent tile to board."
            );

            // 3. player is able to replace tiles throughout the board, but before picking,
            //    he should restore the 'able-to-meld' state and retrieve all tiles he sent to board in this turn.
            check (isMeldOk(stateBeforeMove, stateBeforeMove.board),
                "PICK: you should not mess up the board, if you want to pick"
            );

            // 4. make sure picking next available tile based on last turn
            var tileToPick = stateBeforeMove.nexttile;
            check (tileToPick < 106,
                "Pick: picking tile" + tileToPick + ", but tile index should be [0, 106]"
            );

            // 5. construct move operations.
            var playerAfter = angular.copy(player);
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
         * Sends one tile from player's hand to board.
         *
         * @param stateBefore
         * @param playerIndex (int)
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
                "Send: sending tile" + tileToSend +
                ", but you should send your own tile: [" + player.tiles + "]"
            );

            // 4. make sure sending tile to an empty position within the board.
            var row = to.row;
            var col = to.col;
            checkPositionWithinBoard(board, row, col);

            var toIndex = board[row][col];
            check( toIndex === -1,
                "Send: board["+ row + ", " + col +
                "] is already occupied with tile" + board[row][col] +
                ", you cannot send to this non-empty position in board."
            );

            // 5. construct move operations.
            var boardAfter = angular.copy(board);
            boardAfter[row][col] = tileToSend;
            var playerAfter = angular.copy(player);
            playerAfter.tiles.splice(playerAfter.tiles.indexOf(tileToSend), 1);
            var tilesAfter = angular.copy(stateBefore.tilesSentToBoardThisTurn);
            tilesAfter.push(tileToSend);

            var sendMove = [
                {setTurn: {turnIndex: playerIndex}},     // 'send' move will not change game turn.
                {set: {key: 'type' , value: "SEND"}},
                {set: {key: 'todelta', value: to}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
                {set: {key: 'tilesSentToBoardThisTurn', value: tilesAfter}},
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
         * @param from (object) {row:(int), col(int)}
         * @returns {*[]}
         */
        function getRetrieveFromBoardMove(stateBefore, playerIndex, from) {

            // 1. get game board.
            var board = getGameBoard(stateBefore.board);

            // 2. make sure correct player index.
            var player = getPlayer(stateBefore, playerIndex);

            // 3. make sure retrieving an existing tile in board
            var row = from.row;
            var col = from.col;
            checkPositionWithinBoard(board, row, col);
            var tileToRetrieve = board[row][col];
            check (tileToRetrieve !== -1,
                "RETRIEVE: no tile in board[" + row + "," + col + "]"
            );

            // 4. make sure tile retrieving was sent by player in this turn
            var index = stateBefore.tilesSentToBoardThisTurn.indexOf(tileToRetrieve);
            check ( -1 !== index,
                "RETRIEVE: retrieving tile" + tileToRetrieve +
                ", but it is not your hand:[" + stateBefore.tilesSentToBoardThisTurn + "]."
            );

            // 5. construct move operations.
            var boardAfter = angular.copy(board);
            boardAfter[row][col] = -1;
            var playerAfter = angular.copy(player);
            playerAfter.tiles.push(tileToRetrieve);
            var tilesAfter = angular.copy(stateBefore.tilesSentToBoardThisTurn);
            tilesAfter.splice(index, 1);

            var retrieveMove = [
                {setTurn: {turnIndex: playerIndex}},     // 'retrieve' move will not change game turn.
                {set: {key: 'type' , value: "RETRIEVE"}},
                {set: {key: 'fromdelta', value: from}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
                {set: {key: 'tilesSentToBoardThisTurn', value: tilesAfter}},
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
         * @param from (object) {row:(int),col:(int)}
         * @param to (object) {row:(int),col:(int)}
         * @returns {*[]}
         */
        function getReplaceMove(stateBefore, playerIndex, from, to) {
            // 1. get game board and initialize if undefined
            var board = getGameBoard(stateBefore.board);

            // 2. check from's position is within board and not empty.
            checkPositionWithinBoard(board, from.row, from.col);
            var fromIndex = board[from.row][from.col];
            check( fromIndex !== -1,
                "Replace: no tile in board[" + from.row + "," + from.col + "] "
            );

            // 3. check to's position is within board and is empty.
            checkPositionWithinBoard(board, to.row, to.col);
            var toIndex = board[to.row][to.col];
            check( toIndex === -1,
                "Replace: board[ " + to.row + "," + to.col + "] has been occupied with tile" + toIndex
            );

            // 4. get game player, make sure it is a valid player.
            //var player = getPlayer(stateBefore, playerIndex);

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
            // 0. check player has sent as least one tile from hand to board during this turn.
            check (stateBefore.tilesSentToBoardThisTurn.length !== 0,
                "MELD: you cannot meld since no tiles sent to board in this turn"
            );

            // 1. get game board
            var board = getGameBoard(stateBefore.board);

            // 2. get valid player
            var player = getPlayer(stateBefore, playerIndex);

            // 3. check all sets in board are valid sets (runs or groups)
            var setsInBoard = [];
            // get all 'sets' in board by scanning each row of board
            for (var i = 0; i < board.length; i++) {
                setsInBoard = setsInBoard.concat(parseRowToSets(board[i]));
            }
            for (var ii = 0; ii < setsInBoard.length; ii++) {
                var sets = getSetsOfTilesByIndex(setsInBoard[ii], stateBefore);
                var position = findPosition(board, setsInBoard[ii][0]);
                check (isRuns(sets) || isGroups(sets),
                    "Meld: board contains invalid sets from (" +
                    (position.row + 1) + "," + (position.col + 1) + ") to (" +
                    (position.row + 1) + "," + (position.col + sets.length) + ")"
                );
            }

            // 4. finish initial meld?
            // for player does not finish initial meld, intial meld needs score at least 30.
            if (player.initial ===  false) {
                var score = getInitialMeldScore(stateBefore, setsInBoard, stateBefore.tilesSentToBoardThisTurn);
                check (score >= 30,
                    "Meld: score is " + score + ", but initial meld needs at least 30 score (excluding 'joker' tile)"
                );
            }

            // 5. check winner
            var firstOperation;
            var hasPlayerWon = player.tiles.length === 0 && stateBefore.tilesSentToBoardThisTurn.length !== 0;
            if ( hasPlayerWon ) {
                firstOperation = {endMatch: {endMatchScores: getEndScores(playerIndex, stateBefore)}};
            } else {
                firstOperation = {setTurn: {turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBefore.nplayers)}};
            }

            var playerAfter = angular.copy(player);
            playerAfter.initial = true;

            var meldMove = [
                firstOperation,
                {set: {key: 'type', value: "MELD"}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
                {set: {key: 'tilesSentToBoardThisTurn', value: []}}
            ];

            return meldMove;

        }

        //TODO: for better user experience
        //function getUndoMove() {
        //    return [];
        //}

        /**
         * Gets all possible moves for the given game state and player index.
         *
         * @param stateBefore
         * @param turnIndexBeforeMove
         * @returns {Array} [[possible moves1], [possible moves2],...]
         */
        function getPossibleMoves(stateBefore,  playerIndex) {
            var possibleMoves = [];
            try {
                possibleMoves.push(getPickFromPoolMove(stateBefore, playerIndex));
            } catch (e) {

            }
            //try {
            // if (stateBefore.tilesSentToBoardThisTurn.length === 0) {
            //        // case 2: move can be: ("PICK" | "SEND" | "REPLACE")
            //        //         It is new turn for player, player can choose either "PICK" move or
            //        //         move towards "MELD", (i.e. "SEND"|"REPLACE"|"RETRIEVE"). Because this will
            //        //         will be the 1st move in new turn, player has not sent any tile to board,
            //        //         so "RETRIEVE" move is not possible.
            //
            //        // possible "PICK" move
            //        try {
            //            possibleMoves.push(getPickFromPoolMove(stateBefore, playerIndex));
            //        } catch (e)  {}
            //
            //        // possible "SEND" moves
            //        var positions = checkPossiblePositions(stateBefore.board);
            //        var tos = positions["empty"];
            //        var tilesInPlayerHand = stateBefore["player" + playerIndex].tiles;
            //        for (var i = 0; i < tilesInPlayerHand.length; i++) {
            //            for (var j = 0; j < tos.length; j++) {
            //                var to = {tile: tilesInPlayerHand[i], row: tos[j].row, col: tos[j].col};
            //                try {
            //                    possibleMoves.push(getSendToBoardMove(stateBefore, playerIndex, to));
            //                } catch (e) {}
            //            }
            //        }
            //
            //        // possible "REPLACE" moves
            //        var froms = positions["occupied"];
            //        for (var i = 0; i < froms.length; i++) {
            //            for (var j = 0; j < tos.length; j++) {
            //                var from = froms[i];
            //                var to = tos[j];
            //                try {
            //                    possibleMoves.push(getReplaceMove(stateBefore, playerIndex, from, to));
            //                } catch (e) {}
            //            }
            //        }
            //    } else {
            //        // case 3: move can be ("SEND" | "REPLACE" | "RETRIEVE" | "MELD")
            //        //         Player is still in turn towards meld.
            //
            //        // possible "SEND" move
            //        try {
            //            possibleMoves.push(getSendToBoardMove(stateBefore, playerIndex, to));
            //        } catch (e) {}
            //
            //        // possible "REPLACE" moves
            //        var positions = checkPossiblePositions(stateBefore.board);
            //        var froms = positions["occupied"];
            //        var tos = positions["empty"];
            //        for (var i = 0; i < froms.length; i++) {
            //            for (var j = 0; j < tos.length; j++) {
            //                try {
            //                    possibleMoves.push(getReplaceMove(stateBefore, playerIndex, froms[i], tos[j]));
            //                } catch (e) {}
            //            }
            //        }
            //
            //        // possible "RETRIEVE" moves
            //        for (var i = 0; i < froms.length; i++) {
            //            try {
            //                possibleMoves.push(getRetrieveFromBoardMove(stateBefore, playerIndex, froms[i]));
            //            } catch (e) {}
            //        }
            //
            //        // possible "MELD" move
            //        try {
            //            possibleMoves.push(getMeldMove(stateBefore, playerIndex));
            //        } catch (e) {}
            //    }
            //} catch (e) {
            //    console.log("move is not ok");
            //}
            return possibleMoves;
        }

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
            if (playerIndex === nPlayers - 1) {
                index = 0;
            } else {
                index = playerIndex + 1;
            }
            return index;
        }

        function checkPlayerIndex(playerIndex, nPlayers) {
            check( playerIndex >= 0 && playerIndex < nPlayers,
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
            var board = [];
            for (var i = 0; i < getBoardRows(); i++) {
                board.push([]);
                for (var j = 0; j < getBoardCols(); j++) {
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
         * return all empty positions in board and all occupied positions in board.
         *
         * @param board
         * @returns {{empty: Array, occupied: Array}}
         */
        //function checkPossiblePositions(board) {
        //    var empty = [];
        //    var occupied = [];
        //    var rows = board.length;
        //    var cols = board[0].length;
        //    for (var i = 0; i < rows; i++) {
        //        for (var j = 0; j < cols; j++) {
        //            if (board[i][j] === -1) {
        //                empty.push({row: i, col: j});
        //            } else {
        //                occupied.push({row: i, col: j});
        //            }
        //        }
        //    }
        //    return {empty: empty, occupied: occupied};
        //}

        /**
         * check whether current board can meld
         *
         * @param stateBefore
         * @param board
         * @returns {boolean}
         */
        function isMeldOk(stateBefore, board) {
            var setsInBoard = [];
            // get all 'sets' in board by scanning each row of board
            for (var i = 0; i < board.length; i++) {
                setsInBoard = setsInBoard.concat(parseRowToSets(board[i]));
            }
            for (var ii = 0; ii < setsInBoard.length; ii++) {
                var sets = getSetsOfTilesByIndex(setsInBoard[ii], stateBefore);
                if ( !isRuns(sets) && !isGroups(sets) ) {
                    console.log("isMeldOk, invalid sets: [" + setsInBoard[ii] + "]");
                    return false;
                }
            }
            return true;
        }

        /**
         * check wether game is over.
         *
         * @param state
         * @returns {boolean}
         */
        function isGameOver(state) {
            return getWinner(state) !== -1 || isTie(state);
        }

        /**
         * get index of winning player. returns -1 if no player wins.
         * After game is on, player with no tiles left in hand is the winner.
         *
         * @param state
         * @returns {number}
         */
        function getWinner(state) {
            var hasLoser = false;
            var winner = -1;
            for (var i = 0; i < state.nplayers; i++) {
                if ( state["player" + i].tiles.length === 0 && state.tilesSentToBoardThisTurn.length === 0) {
                    winner = i;
                } else {
                    if (hasLoser === false) {
                        hasLoser = true;
                    }
                }
            }
            // in case game is not initialized
            return hasLoser ? winner : -1;
        }

        function findPosition(board, tileIndex) {
            var position = {};
            for (var row = 0; row < board.length; row++) {
                for (var col = 0; col < board[0].length; col++) {
                    if (board[row][col] === tileIndex) {
                        position.row = row;
                        position.col = col;
                        break;
                    }
                }
            }
            return position;
        }

        function getBoardRows() {
            return 6;
        }

        function getBoardCols() {
            return 18;
        }

        /**
         * check if game is tied. Game is tied when tile pool is empty
         * and no player can make valid move any more.
         *
         * @returns {boolean}
         */
        function isTie(state) {
            if (state !== undefined) {
                console.log("initialed game");
            }
            return false;
        }

        /* ======= Return functions ======= */
        return {
            isMoveOk: isMoveOk,
            getInitialMove: getInitialMove,
            getTileByIndex: getTileByIndex,
            getPossibleMoves: getPossibleMoves,
            createMove: createMove,

            getPickMove: getPickFromPoolMove,
            getMeldMove: getMeldMove,
            getSendMove: getSendToBoardMove,
            getRetrieveMove: getRetrieveFromBoardMove,
            getReplaceMove: getReplaceMove

            //setBoardRows: getBoardRows,
            //setBoardCols: getBoardCols
        };

    });
}());
;/**
 * File: app/js/controllers/gameCtrl.js
 * @author:
 * @date:
 */

(function() {
    'use strict';
    angular.module('myApp').controller('GameCtrl',
    ['$scope', '$log', '$window', '$animate', '$timeout', 'stateService', 'gameService', 'gameLogicService',
    function($scope, $log, $window,  $animate, $timeout, stateService ,gameService, gameLogicService ) {

        //console.log("height: " + window.innerWidth);
        //resizeGameAreaService.setWidthToHeight(0.6);
        $scope.rows = 6;
        $scope.cols = 18;

        window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

        function sendComputerMove() {
            var items = gameLogicService.getPossibleMoves($scope.state, $scope.turnIndex);
            gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
            console.log("here");
            $scope.debug = "computer picks one tile";
            $scope.turnInfo = "Your turn";
        }

        function updateUI(params) {

            // initialize move
            if (isEmptyObj(params.stateAfterMove)) {
                var playerIndex = 0;
                var nPlayers = 2;
                var move = gameLogicService.getInitialMove(playerIndex, nPlayers);
                gameService.makeMove(move);
                return;
            }

            $scope.state = params.stateAfterMove;
            $scope.turnIndex = params.turnIndexAfterMove;
            $scope.board = params.stateAfterMove.board;
            var opponentIndex = 1 - $scope.turnIndex;
            $scope.opponent_top = params.stateAfterMove["player" + opponentIndex].tiles;
            $scope.curPlayer = params.stateAfterMove["player" + $scope.turnIndex].tiles;
            $scope.isYourTurn = params.yourPlayerIndex === params.turnIndexAfterMove;
            $scope.nexttile = params.stateAfterMove.nexttile;

            // Is it the computer's turn?
            if ($scope.isYourTurn &&
                params.playersInfo[params.yourPlayerIndex].playerId === '') {
                $scope.isYourTurn = false; // to make sure the UI won't send another move.
                // Waiting 0.5 seconds to let the move animation finish; if we call aiService
                // then the animation is paused until the javascript finishes.
                $timeout(sendComputerMove, 500);
            }

        }

        //window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

        /* Select one tile from player's hand */
        $scope.tileClicked= function(tileIndex) {
            if ($scope.isYourTurn) {
                if ($scope.activeTile !== undefined && $scope.activeOrigin === 'board' && $scope.from !== undefined) {
                    // if one tile inside board is activated then we are expecting a 'retrieve' move
                    var from = $scope.from;
                    try {
                        var move = gameLogicService.getRetrieveMove($scope.state, $scope.turnIndex, from);
                        gameService.makeMove(move);
                    } catch (e) {
                    }
                    clearActiveTile();
                } else {
                    $scope.activeTile = tileIndex;
                    $scope.activeOrigin = "curPlayer";
                    $scope.debug = "picking Tile" + tileIndex + " (" +  getTileByIndex(tileIndex).color + "," + getTileByIndex(tileIndex).score + ")";
                }
            }
        };

        $scope.boardCellClicked = function (row, col) {
            $log.info(["Clicked on cell:", row, col]);
            $scope.debug = "click board cell: (" + row + "," + col + ")";
            if ( !$scope.isYourTurn ) {
                return false;
            }
            try {
                if ($scope.activeTile === undefined) {
                    if ($scope.board[row][col] !== -1) {
                        // clicking an position occupied by tile
                        $scope.activeOrigin = 'board';
                        $scope.activeTile = $scope.board[row][col];
                        $scope.from = {row: row, col: col};
                        $scope.debug = "picking Tile" + $scope.activeTile + " (" +
                        getTileByIndex($scope.activeTile).color +
                        "," + getTileByIndex($scope.activeTile).score +
                        " from: (" + row + "," + col + ")";
                    }
                } else {
                    var to = {};
                    var move;
                    if ($scope.activeOrigin === 'board') {
                        // one tile on board has been activated before, so we are expecting a 'replace' move
                        var from = $scope.from;
                        to = {row: row, col: col};

                        // may 'replace' itself
                        if (angular.equals(from, to)) {
                            return false;
                        }

                        move = gameLogicService.getReplaceMove($scope.state, $scope.turnIndex, from, to);
                        gameService.makeMove(move);

                    } else if ($scope.activeOrigin === 'curPlayer') {
                        // one tile in player's hand has been activated, so we are expecting a 'send' move
                        to = {tile: $scope.activeTile, row: row, col: col};
                        move = gameLogicService.getSendMove($scope.state, $scope.turnIndex, to);
                        $scope.isYourTurn = false; // to prevent making another move
                        gameService.makeMove(move);
                        //$log.info("tile: " + $scope.board[row][col]);
                        $scope.debug = "here";
                    }
                    $scope.debug = "Tile" + $scope.activeTile + " (" +
                    getTileByIndex($scope.activeTile).color +
                    "," + getTileByIndex($scope.activeTile).score +
                    ") to: (" + row + "," + col + ")";
                    clearActiveTile();
                }

            } catch (e) {
                //$log.info(["Cell is already full in position:", row, col]);
                clearActiveTile();
                return false;
            }
        };

        $scope.curPlayerAreaClicked = function() {
            $scope.debug = $scope.activeOrigin + " , " + $scope.activeTile + "," + $scope.from;
            //$scope.debug = "adaf";
            if ($scope.activeTile !== undefined && $scope.activeOrigin === 'board' && $scope.from !== undefined) {
                // if one tile inside board is activated then we are expecting a 'retrieve' move
                var from = $scope.from;
                try {
                    var move = gameLogicService.getRetrieveMove($scope.state, $scope.turnIndex, from);
                    gameService.makeMove(move);
                } catch (e) {
                }
                clearActiveTile();
            }
            //$scope.debug = "here also";
        };

        $scope.shouldShowTileOnBoard = function (row, col) {
            // -1 stands for empty position on board
            return $scope.board !== undefined && $scope.board[row][col] !== -1;
        };

        $scope.notJoker = function (tileIndex) {
            var tile = getTileByIndex(tileIndex);
            return tile !== undefined && tile.color !== 'joker';
        };

        $scope.isJoker = function(tileIndex) {
            var tile = getTileByIndex(tileIndex);
            return tile !== undefined && tile.color === 'joker';
        };

        $scope.pickBtnClicked = function() {
            if ($scope.isYourTurn) {
                console.log("next: " + $scope.nexttile);
                try {
                    var move = gameLogicService.getPickMove($scope.state, $scope.turnIndex);
                    gameService.makeMove(move);
                    $scope.debug = "pick one tile";
                } catch (e) {
                    $scope.debug = "cannot pick when tiles sent to board";
                }
            }
        };

        $scope.meldBtnClicked = function() {
            try {
                var move = gameLogicService.getMeldMove($scope.state, $scope.turnIndex);
                gameService.makeMove(move);
            } catch (e) {
                $scope.debug = "cannot meld";
                $window.alert(e);
            }
        };

        $scope.getTileDataValue = function(tileIndex) {
            var dataValue = "";
            var tile = getTileByIndex(tileIndex);
            if ( tile !== undefined) {
                dataValue = tile.color + " " + tile.score;
            }
            return dataValue;
        };

        $scope.canDrag = function (tileIndex) {
            if ($scope.isYourTurn &&  getTileByIndex(tileIndex) !== undefined) {
                return true;
            }
            return false;
        };

        $scope.getTileScore = function(tileIndex) {
            var tile = getTileByIndex(tileIndex);
            if (tile !== undefined) {
                return tile.score;
            } else {
                return "";
            }
        };

        //TODO:
        //function sortTiles() {
        //}



        /* ================= Helper Functions =================== */
        function isEmptyObj(obj) {

            // null and undefined are "empty"
            if (obj === null) {
                return true;
            }

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    {
                return false;
            }
            if (obj.length === 0)  {
                return true;
            }

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Returns tile object if tileIndex is valid and tile exists.
         * @param tileIndex
         * @returns {*} {score: int, color: string}
         */
        function getTileByIndex(tileIndex) {
            if (tileIndex !== undefined && $scope.state['tile' + tileIndex] !== undefined) {
                return $scope.state['tile' + tileIndex];
            }
            return undefined;
        }

        $scope.getTileByIndex = getTileByIndex;

        function clearActiveTile() {
            $scope.activeTile = undefined;
            $scope.activeOrigin = undefined;
            $scope.from = undefined;
        }

        gameService.setGame( {
            gameDeveloperEmail: "jz1371@nyu.edu",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 4,
            isMoveOk: gameLogicService.isMoveOk,
            updateUI: updateUI
        });

    }]);
}());
