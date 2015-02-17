/**
 * File: app/js/services/gameLogicService.js
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
     * The game state is represented by the following elements:
     *
     *
     * 1. player: { "initial" : true/false,  // whether initialled meld
     *              "tiles"   : [ array of indices of tiles player holds ],
     *              "lastTurn": [ array of indices of tiles player held in last turn] }
     *
     * 2. board: 2D array of tile indices of size 6 rows and 20 columns.
     *
     *
     * 3. turn type: the strategy player chooses for current turn.
     *
     *    "PICK", pick one tile from tile pool.
     *    "MELD", make valid groups to meld.
     *
     * 4. tiles: array of 'tile".
     *
     *    non-joker tile: { color: (RED/BLUE/ORANGE/BLACK), number: (1/2/3/.../13) }
     *    joker tile: "joker"
     *
     * 5. operation: the operation player chooses for current move.
     *
     *    "PICK", pick one tile from tile pool.
     *    "MELD", make valid groups to meld.
     *    "SEND", send one tile from player to board.
     *    "RETRIEVE", retrieve one tile from board back to player.
     *    "REPLACE", replace one tile in board to another position in board.
     *    "UNDO", undo operations in this turn.
     *
     * 6. nplayers: number of players in current game.
     *
     * 7. nexttile: index of first invisible tile in tile pool.
     *
     **************************************************************************************
     */

    angular.module('myApp', []).factory('gameLogicService', function() {

        /**
         *
         * @param param
         * @returns {boolean}
         */
        function isMoveOk(param) {
            var stateBefore = param.stateBeforeMove;
            var playerIndex = param.turnIndexBeforeMove;
            var actualMove = param.move;
            var expectedMove;
            var operation = stateBefore.oper;
            try {
                switch (operation) {
                    case getOperType().SETUP:
                        var nPlayers = stateBefore.nplayers;
                        expectedMove = getInitialMove(nPlayers);
                    case getOperType().PICK:
                        expectedMove = getPickFromPoolMove(stateBefore, playerIndex);
                        break;
                    case getOperType().SEND:
                        /* move example: (player0 is playing, 4 players in total)
                         * [{set: {key: 'selected', value: 13},
                         *  {set: {key: 'delta', value: {row: 0, col: 0},
                         *  {set: {key: 'board', value: [[13,-1,-1,...],[-1,-1,...],...]]},
                         *  {set: {key: 'player0', value: {initial: true, tiles: [1,2,3,...12], lastTurn: [1,2,3,...13]},
                         *  {setVisibility: {key: 'tile13', visibleToPlayerIndexes: [1, 2, 3]}]
                         */
                        var tileToSend = actualMove[0].set.value;
                        var row = actualMove[1].set.value.row;
                        var col = actualMove[1].set.value.col;
                        expectedMove = getSendToBoardMove(stateBefore, playerIndex,tileToSend, row, col);
                        break;
                    case getOperType().RETRIEVE:
                        /* move example: (player0 is playing, 4 players in total)
                         * [{set: {key: 'delta', value: {row: 0, col: 0},   // assume board[0][0] = 13
                         *  {set: {key: 'board', value: [[-1,-1,-1,...],[-1,-1,...],...]]},
                         *  {set: {key: 'player0', value: {initial: true, tiles: [1,2,3,...12, 13], lastTurn: [1,2,3,...13]},
                         *  {setVisibility: {key: 'tile13', visibleToPlayerIndexes: [0]}]  // ? need this ?
                         */
                        var row = actualMove[1].set.value.row;
                        var col = actualMove[1].set.value.col;
                        expectedMove = getRetrieveFromBoardMove(stateBefore, playerIndex, row, col);
                        break;
                    case getOperType().MELD:
                        //TODO:
                        expectedMove = getMeldMove();
                        break;
                    case getOperType().REPLACE:
                        /* move example: (player0 is playing, 4 players in total)
                         * [{set: {key: 'delta', value: {row: 0, col: 0},   // assume board[0][0] = 13
                         *  {set: {key: 'board', value: [[-1,-1,-1,...],[-1,-1,...],...]]},
                         *  {set: {key: 'player0', value: {initial: true, tiles: [1,2,3,...12, 13], lastTurn: [1,2,3,...13]},
                         *  {setVisibility: {key: 'tile13', visibleToPlayerIndexes: [0]}]  // ? need this ?
                         */
                        expectedMove = getReplaceMove();
                    default:
                        throw new Error("Unexpected move");
                        break;
                }
                if (!angular.equals(actualMove, expectedMove)) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            return true;
        }


        /**
         * Gets index of winning player.
         *
         * @param state
         * @returns {number}
         */
        function getWinner(state) {
            for (var i = 0; i < state.nplayer; i++) {
                if (getPlayer(state, i).tiles.length === 0) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Checks if game is tied. Game is tied when tile pool is empty
         * and no player can make valid move any more.
         * @returns {boolean}
         */
        function isTie() {
            return false;
        }

        /**
         * Gets the initial move.
         *
         * @param nPlayers number of players in the game.
         * @returns {Array}
         */
        function getInitialMove(nPlayers) {
            var board = getInitialBoard();
            var operations = [
                {setTurn: {turnIndexBeforeMove: 0}},
            ];
            check(nPlayers <= 4 && nPlayers >= 0,
                "Initialize: 2 - 4 players are allowed."
            );
            for (var i = 0; i < nPlayers; i++) {
                // each player gets 14 tiles initially
                var playerTile = [];
                for (var j = 0; j < 14; j++) {
                    playerTile[j] = i * 14 + j;
                }
                var player = {set: {
                    key: 'player' + i, value:  {initial: false, tiles: playerTile, lastTurn: [] }}};
                operations.concat([player]);
            }

            return operations;
        }

        /**
         * Picks one tile from tile pool, and adds it to player's rack,
         * and shifts game turn to next player.
         *
         * @param stateBeforeMove
         * @param turnIndexBeforeMove
         * @returns {Array}
         */
        function getPickFromPoolMove(stateBeforeMove, playerIndex) {
            // 1. make sure valid player.
            var nPlayers = stateBeforeMove.nplayers;
            var player = getPlayer(stateBeforeMove, playerIndex);

            // 2. make sure tile pool still has tile
            var indexOfNextTile = stateBeforeMove.nexttile;
            check ( indexOfNextTile < 106,
                "Pick: no more tile to pick"
            );

            // 3. construct move operations.
            var playerAfter = angular.copy(player);
            playerAfter.tiles = playerAfter.tiles.concat(indexOfNextTile);

            return [
                {setTurn: {turnIndexBeforeMove: getPlayerIndexOfNextTurn(playerIndex, nPlayers)}},
                {setVisibility: {key: 'tile' + indexOfNextTile, visibleToPlayerIndexes: [playerIndex]}},
                {set: {key: 'player' + playerIndex, value: playerAfter } },
                {set: {key: 'nexttile', value: indexOfNextTile + 1}},
            ];
        }


        /* Move example: (player0 is playing, 4 players in total)
         * {set: {key: 'board'    , value: [[13,-1,-1,..],[-1,-1,..-1],...]}},
         * {set: {key: 'player0'  , value: {initial: true, tiles: [1,2,..12], lastTurn:[1,2,3,..13]}}},
         * {set: {key: 'todelta'  , value: {row: 0, col: 0}}},
         * {set: {key: 'selected' , value: 13}},
         * {setVisibility: {key: 'tile13' , visibleToPlayerIndexes: [1,2,3]}}
         */
        /**
         * Sends one tile from player to board.
         *
         * @param stateBefore
         * @param playerIndex
         * @param tileToSend
         * @param to
         * @returns {*[]}
         */
         function getSendToBoardMove(stateBefore, playerIndex, tileToSend, to) {
            // 1. get game board.
            var board = getGameBoard(stateBefore.board);

            // 2. make sure correct player index.
            var player = getPlayer(stateBefore, playerIndex);

            // 3. make sure sending to an empty position
            checkPositionWithinBoard(board, to.row, to.col);
            var toIndex = board[to.row][to.col];
            check( (toIndex === -1),
                "Send: You cannot send to a non-empty position in board."
            );

            if (getWinner(stateBefore) !== -1 || isTie()) {
                throw new Error("You cannot send tile when game is over.");
            }

            // 4. check tile to send
            check (player.tiles.indexOf(tileToSend) !== -1,
                "Send: You can send your own tile."
            );

            // 5. construct move operations.
            var boardAfter = angular.copy(board);
            boardAfter[to.row][to.col] = tileToSend;
            var playerAfter = angular.copy(player);
            playerAfter.tiles = playerAfter.tiles.remove(tileToSend);
            var nPlayers = stateBefore.nplayers;

            return [
                {set: {key: 'board'   , value: boardAfter}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
                {set: {key: 'delta'   , value: to}},
                {set: {key: 'selected', value: tileToSend}},
                {setVisibility: {key: 'tile' + tileToSend, visibleToPlayerIndexes: getRestPlayers(playerIndex, nPlayers)}}
            ];
        }


        /* Move example: (player0 is playing, 4 players in total)
         * {set: {key: 'board', value: [[-1,-1,-1,...],[-1,-1,...],...]]},
         * {set: {key: 'player0', value: {initial: true, tiles: [1,2,3,...12, 13], lastTurn: [1,2,3,...13]},
         * {set: {key: 'fromdelta'  , value: {row: 0, col: 0}}},
         * {setVisibility: {key: 'tile13', visibleToPlayerIndexes: [0]}]  // ? need this ?
         */
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
            check(stateBefore.turn_type === getTurnType().MELD,
                "Retrieve: You cannot retrieve tile if you choose picking from pool this turn.");

            // 1. get game board.
            var board = getGameBoard(stateBefore.board);

            // 2. make sure correct player index.
            var player = getPlayer(stateBefore, playerIndex);

            // 3. make sure retrieving a valid tile from board
            checkPositionWithinBoard(board, from.row, from.col);
            var fromIndex = board[from.row][from.col];
            check( (fromIndex !== -1),
                "Retrieve: You cannot retrieve from an empty position in board."
            );

            // 4. make sure the tile was sent to board during current turn.
            check((player.lastTurn.indexOf(fromIndex) !== -1),
                "Retrieve: You cannot retrieve this tile because it does not belong to current turn.");

            // 5. construct move operations
            var boardAfter = angular.copy(board);
            boardAfter[from.row][from.col] = -1;
            var playerAfter = angular.copy(player);
            player.tiles.push(fromIndex);

            return [
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
                {set: {key: 'fromdelta', value: from }},
                {setVisibility: {key: 'tile' + fromIndex, visibleToPlayerIndexes: [playerIndex]}}
            ];
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
                "Replace: You cannot replace an empty position in board"
            );

            // 3. check to's position is within board and is empty.
            checkPositionWithinBoard(board, to.row, to.col);
            var toIndex = board[to.row][to.col];
            check( (toIndex === -1),
                "Replace: You cannot move tile to a non-empty position in board"
            );

            // 4. get game player, make sure it is a valid player.
            var player = getPlayer(stateBefore, playerIndex);

            if (player.initial === false) {
                // if not initial meld
                check((player.lastTurn.indexOf(fromIndex) !== -1),
                    "Replace: You cannot replace other player's tile since you have not initial meld");
            }

            var boardAfter = angular.copy(board);
            return [
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'fromdelta', value: from}},
                {set: {key: 'todelta', value: to}},
            ];
        }


        /* Move example: (player0 is playing, 4 players in total)
         * {setTurn: {turnIndex: 1)}},
         * {set: {key:
         */
        /**
         * Melds current turn and shift turn to next player.
         *
         * @returns {Array}
         */
        function getMeldMove(stateBefore, playerIndex) {
            // 1. get game board
            var board = getGameBoard(stateBefore.board);

            // 2. get valid player
            var player = getPlayer(stateBefore, playerIndex);

            // 3. has initial meld?
            if (player.initial ===  false) {
                // must score >= 30 and joker tile's score is not included if not initial meld
                check ( getTurnScore(player.tiles, player.lastTurn) >= 30,
                    "Meld: initial meld must have score equal or more than 30 with joker's score excluded."
                );
            }

            // 4. check all sets in board are valid sets (runs or groups)
            check( boardHasOnlyValidSets(board),
                "Meld: board contains invalid sets."
            );

            //TODO: 5. checks winner

            var playerAfter = angular.copy(player);
            playerAfter.initial = true;
            playerAfter.lastTurn = playerAfter.tiles;

            return [
                {setTurn: {turnIndexBeforeMove: getPlayerIndexOfNextTurn(playerIndex, stateBefore.nplayers)}},
                {set: {key: 'player' + playerIndex, value: playerAfter}},
            ];
        }

        //TODO: for better user experience
        //function getUndoMove() {
        //    return [];
        //}



        /* ######### Helper Functions ########## */

        function getTurnType() {
            var TURN_TYPE = {
                PICK: "PICK",
                MELD: "MELD"
            };
            return TURN_TYPE;
        }

        function getOperType() {
            var OPER = {
                SETUP: "SETUP",
                PICK: "PICK",
                SEND: "SEND",
                RETRIEVE: "RETRIEVE",
                //TODO: UNDO: "UNDO",
                MELD: "MELD",
                REPLACE: "REPLACE"
            };
            return OPER;
        }

        /**
         * Gets the player's index of next turn.
         * @param playerIndex
         * @param nPlayers number of players in current game.
         * @returns {number} index of next turn.
         */
        function getPlayerIndexOfNextTurn(playerIndex, nPlayers) {
            checkPlayerIndex(playerIndex, nPlayers);
            var index = 0;
            if (playerIndex = nPlayers - 1) {
                index = 0;
            } else {
                index = playerIndex + 1;
            }
            return index;
        }

        /**
         * Gets player profile from state.
         * @param state
         * @param playerIndex
         * @returns {*}
         */
        function getPlayer(state, playerIndex) {
            checkPlayerIndex(playerIndex, state.nplayers);
            if (playerIndex === 0) {
                return state.player0;
            } else if (playerIndex === 1) {
                return state.player1;
            } else if (playerIndex === 2) {
                return state.player2;
            } else if (playerIndex === 3) {
                return state.player3;
            } else {
                throw new Error("player index out of bound");
            }
        }

        function checkPlayerIndex(playerIndex, nPlayers) {
            check((playerIndex >= 0) && (playerIndex < nPlayers),
                "player index issue,[playerIndex:  " + playerIndex + ", nPlayers: " + nPlayers);
        }

        /**
         * Gets current game board, making sure it has initialized.
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
         * Initializes game board.
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
            arr.remove(playerIndex);
        }

        //TODO: cannot place to position to connect valid groups into invalid one.
        function isValidPosition(board, row, col) {
            check((row >= 0 && (row < 6) && (col >=0 && col < 20)),
                "Invalid position in the board, row: " + row + ", col: " + col
            );
            var result = (board[row][col] !== -1);
            return result;
        }

        Array.prototype.remove = function(value) {
            if (this.indexOf(value)!==-1) {
                this.splice(this.indexOf(value), 1);
                return true;
            } else {
                return false;
            };
        }

        /* check given (row, col) is within board's boundary,
         * and board is guaranteed not undefined before calling. */
        function checkPositionWithinBoard(board, row, col) {
            var rows = board.length;
            var cols = board[0].length;
            check( (row >= 0 && row < rows) && (col >= 0 && col < cols) ),
                "Position Out Of Board, [row: " + row + ",col: " + col
            );
        }

        /**
         *
         * Checks if given condition is satisfied. If not satisfied, throw error.
         *
         * @param condition
         * @param message
         */
        function check(condition, message) {
            if (condition === false) {
                console.log(message);
                for (var i = 2; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
                throw new Error('Fails!');
            }
        }

        /**
         * Gets the score for current turn.
         *
         * @param tilesRemain
         * @param tilesLastTurn
         * @returns {number}
         */
        function getTurnScore(tilesRemain, tilesLastTurn) {
            var score = 0;
            for ( var tileIndex in tilesLastTurn ){
                var tile = getTileByIndex(tileIndex);
                if (tile.color !== 'joker' && tilesRemain.indexOf(tileIndex) !== -1) {
                    score += tile.score;
                }
            }
            return score;
        }

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
         * Checks all sets in board are valid sets.
         * @param board
         * @returns {boolean}
         */
        function boardHasOnlyValidSets(board) {
            var rows = board.length;
            for (var i = 0; i < rows; i++) {
                if ( !isRowValid(board[i]) ) {
                    return false;
                }
            }
            return true;
        }

        // parse row into sets and check each set
        function isRowValid(row) {
            var setsArr = [];
            var sets = [];
            for (var i = 0; i < row.length; i++) {
                if (row[i] === -1 || i === row.length - 1) {
                    // current set ends
                    if (sets.length !== 0) {
                        setsArr.push(sets);
                        sets = [];
                    }
                } else {
                    sets.push(row[i]);
                }
            }
            if (setsArr > 0 ) {
                for (var sets in setArr) {
                    if ( !isRuns(sets) && !isGroups(sets) ) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * Valid runs: contains 3 or more tiles, tiles have the same color,
         * and tile's score are in consecutive number order. Joker can substitute any tile.
         * @param sets
         * @returns {boolean}
         */
        function isRuns(sets) {
            var len = sets.length;
            if (len < 3 || len > 13) {
                return false;
            }

            var tile = getTileByIndex(sets[0]);
            var jokers = 0;
            var sameColor = 'undecided';
            if (tile.color !== 'joker') {
                sameColor = tile.color;
            }
            var numbers = [];
            var minNum = 0;
            var maxNum = 0;
            for (var i = 0; i < len; i++) {
                tile = getTileByIndex(sets[i]);
                if (tile.color === 'joker') {
                    jokers++;
                } else {
                    // 1. check same color
                    if (sameColor === 'undecided') {
                        sameColor = tile.color;
                    }
                    if (sameColor !== tile.color) {
                        return false;
                    }

                    // 2. check number, cannot repeat number in current numbers;
                    var score = tile.score;
                    if (numbers.length === 0) {
                        // first number to put into numbers
                        numbers.push(score);
                        minNum = score;
                        maxNum = score;
                    } else {
                        // duplicated?
                        if (numbers.indexOf(score) !== -1) {
                            return false;
                        }
                        number.push(score);
                        minNum = (score < minNum) ? score : minNum;
                        maxNum = (score > maxNum) ? score : maxNum;
                    }
                }
            }
            // check number boundary
            return ( (maxNum - minNum)< len);
        }

        /**
         * Valid groups: sets contain 3 or 4 tiles, different colors with each other, same tile score,
         * joker can substitute any tile in need.
         * @param sets
         */
        function isGroups(sets) {
            var length = sets.length;
            if (length !== 3 && length !== 4) {
                return false;
            }

            var score = -1;
            var colors = [];
            for (var tileIndex in sets) {
                var tile = getTileByIndex(tileIndex);
                if (tile.color !== 'joker') {
                    // 1. check scores are the same
                    if (score === -1) {
                        // 1st score from the sets
                        score = tile.score;
                    }
                    if (score !== tile.score) {
                        return false;
                    }
                    // 2. check has different colors.
                    if (colors.indexOf(tile.color) !== -1) {
                        return false;
                    }
                    colors.push(tile.color);
                }
            }
            return true;
        }

        return {
            isMoveOk: isMoveOk
        };
    });
}());
