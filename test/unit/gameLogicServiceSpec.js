/**
 * File: test/unit/gameLogicServiceSpec.js
 * --------------------------------------------------------------
 *
 * Usage from terminal (assuming at project root):
 *
 *   0. $ sudo npm install
 *   1. $ cd test
 *   2. $ ../node_modules/karma/bin/karma start
 *
 * Usage from Webstorm
 *
 *   1. right click on karma.conf.js file -> 'Create karma.conf.js'
 *   2. fill in:
 *       node interpreter: /usr/local/bin/node
 *       karma package   : /Users/Steven/node_modules/karma
 *   3. 'Run karma.conf.js'
 *
 * Run single test suite: describe --> fdescribe
 * Run single test spec:        it --> fit
 *
 * @author: Jingxin Zhu
 * @date  : 2015.02.18
 * --------------------------------------------------------------
 */
describe("Rummikub Unit Tests", function() {

    'use strict';

    var _service;
    var defaultState = {};

    beforeEach(module("myApp"));

    beforeEach(inject(function (gameLogicService) {
        _service = gameLogicService;
    }));

    function getInitMove(nPlayers) {
        var initial = [];
        var board = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        ];
        var tileIndex = 0;
        var tilesInHandInitially = 14;
        for (var i = 0; i < nPlayers; i++) {
            initial.push(false);
            var row = [];
            for (var j = 0; j < tilesInHandInitially; j++) {
                row.push(tileIndex);
                tileIndex++;
            }
            board.push(row);
        }

        var move = [
            // 1. set game turn
            {setTurn: {turnIndex: 0}},

            // 2. set move type
            {set: {key: 'type' , value: "INIT"}},

            {set: {key: 'trace', value: {nplayers: nPlayers, initial: initial, nexttile: nPlayers * 14}}},

            // 3. set game board
            {set: {key: 'board', value: board}},

            {set: {key: 'deltas', value: []}},

            // 4. set game tiles
            {set: {key: 'tile0' , value: {color: 'blue'  , score:  1}}},
            {set: {key: 'tile1' , value: {color: 'blue'  , score:  2}}},
            {set: {key: 'tile2' , value: {color: 'blue'  , score:  3}}},
            {set: {key: 'tile3' , value: {color: 'blue'  , score:  4}}},
            {set: {key: 'tile4' , value: {color: 'blue'  , score:  5}}},
            {set: {key: 'tile5' , value: {color: 'blue'  , score:  6}}},
            {set: {key: 'tile6' , value: {color: 'blue'  , score:  7}}},
            {set: {key: 'tile7' , value: {color: 'blue'  , score:  8}}},
            {set: {key: 'tile8' , value: {color: 'blue'  , score:  9}}},
            {set: {key: 'tile9' , value: {color: 'blue'  , score: 10}}},
            {set: {key: 'tile10', value: {color: 'blue'  , score: 11}}},
            {set: {key: 'tile11', value: {color: 'blue'  , score: 12}}},
            {set: {key: 'tile12', value: {color: 'blue'  , score: 13}}},
            {set: {key: 'tile13', value: {color: 'blue'  , score:  1}}},
            {set: {key: 'tile14', value: {color: 'blue'  , score:  2}}},
            {set: {key: 'tile15', value: {color: 'blue'  , score:  3}}},
            {set: {key: 'tile16', value: {color: 'blue'  , score:  4}}},
            {set: {key: 'tile17', value: {color: 'blue'  , score:  5}}},
            {set: {key: 'tile18', value: {color: 'blue'  , score:  6}}},
            {set: {key: 'tile19', value: {color: 'blue'  , score:  7}}},
            {set: {key: 'tile20', value: {color: 'blue'  , score:  8}}},
            {set: {key: 'tile21', value: {color: 'blue'  , score:  9}}},
            {set: {key: 'tile22', value: {color: 'blue'  , score: 10}}},
            {set: {key: 'tile23', value: {color: 'blue'  , score: 11}}},
            {set: {key: 'tile24', value: {color: 'blue'  , score: 12}}},
            {set: {key: 'tile25', value: {color: 'blue'  , score: 13}}},

            {set: {key: 'tile26', value: {color: 'red' , score:  1}}},
            {set: {key: 'tile27', value: {color: 'red' , score:  2}}},
            {set: {key: 'tile28', value: {color: 'red' , score:  3}}},
            {set: {key: 'tile29', value: {color: 'red' , score:  4}}},
            {set: {key: 'tile30', value: {color: 'red' , score:  5}}},
            {set: {key: 'tile31', value: {color: 'red' , score:  6}}},
            {set: {key: 'tile32', value: {color: 'red' , score:  7}}},
            {set: {key: 'tile33', value: {color: 'red' , score:  8}}},
            {set: {key: 'tile34', value: {color: 'red' , score:  9}}},
            {set: {key: 'tile35', value: {color: 'red' , score: 10}}},
            {set: {key: 'tile36', value: {color: 'red' , score: 11}}},
            {set: {key: 'tile37', value: {color: 'red' , score: 12}}},
            {set: {key: 'tile38', value: {color: 'red' , score: 13}}},
            {set: {key: 'tile39', value: {color: 'red' , score:  1}}},
            {set: {key: 'tile40', value: {color: 'red' , score:  2}}},
            {set: {key: 'tile41', value: {color: 'red' , score:  3}}},
            {set: {key: 'tile42', value: {color: 'red' , score:  4}}},
            {set: {key: 'tile43', value: {color: 'red' , score:  5}}},
            {set: {key: 'tile44', value: {color: 'red' , score:  6}}},
            {set: {key: 'tile45', value: {color: 'red' , score:  7}}},
            {set: {key: 'tile46', value: {color: 'red' , score:  8}}},
            {set: {key: 'tile47', value: {color: 'red' , score:  9}}},
            {set: {key: 'tile48', value: {color: 'red' , score: 10}}},
            {set: {key: 'tile49', value: {color: 'red' , score: 11}}},
            {set: {key: 'tile50', value: {color: 'red' , score: 12}}},
            {set: {key: 'tile51', value: {color: 'red' , score: 13}}},

            {set: {key: 'tile52', value: {color: 'black' , score:  1}}},
            {set: {key: 'tile53', value: {color: 'black' , score:  2}}},
            {set: {key: 'tile54', value: {color: 'black' , score:  3}}},
            {set: {key: 'tile55', value: {color: 'black' , score:  4}}},
            {set: {key: 'tile56', value: {color: 'black' , score:  5}}},
            {set: {key: 'tile57', value: {color: 'black' , score:  6}}},
            {set: {key: 'tile58', value: {color: 'black' , score:  7}}},
            {set: {key: 'tile59', value: {color: 'black' , score:  8}}},
            {set: {key: 'tile60', value: {color: 'black' , score:  9}}},
            {set: {key: 'tile61', value: {color: 'black' , score: 10}}},
            {set: {key: 'tile62', value: {color: 'black' , score: 11}}},
            {set: {key: 'tile63', value: {color: 'black' , score: 12}}},
            {set: {key: 'tile64', value: {color: 'black' , score: 13}}},
            {set: {key: 'tile65', value: {color: 'black' , score:  1}}},
            {set: {key: 'tile66', value: {color: 'black' , score:  2}}},
            {set: {key: 'tile67', value: {color: 'black' , score:  3}}},
            {set: {key: 'tile68', value: {color: 'black' , score:  4}}},
            {set: {key: 'tile69', value: {color: 'black' , score:  5}}},
            {set: {key: 'tile70', value: {color: 'black' , score:  6}}},
            {set: {key: 'tile71', value: {color: 'black' , score:  7}}},
            {set: {key: 'tile72', value: {color: 'black' , score:  8}}},
            {set: {key: 'tile73', value: {color: 'black' , score:  9}}},
            {set: {key: 'tile74', value: {color: 'black' , score: 10}}},
            {set: {key: 'tile75', value: {color: 'black' , score: 11}}},
            {set: {key: 'tile76', value: {color: 'black' , score: 12}}},
            {set: {key: 'tile77', value: {color: 'black' , score: 13}}},

            {set: {key: 'tile78',  value: {color: 'orange' , score:  1}}},
            {set: {key: 'tile79',  value: {color: 'orange' , score:  2}}},
            {set: {key: 'tile80',  value: {color: 'orange' , score:  3}}},
            {set: {key: 'tile81',  value: {color: 'orange' , score:  4}}},
            {set: {key: 'tile82',  value: {color: 'orange' , score:  5}}},
            {set: {key: 'tile83',  value: {color: 'orange' , score:  6}}},
            {set: {key: 'tile84',  value: {color: 'orange' , score:  7}}},
            {set: {key: 'tile85',  value: {color: 'orange' , score:  8}}},
            {set: {key: 'tile86',  value: {color: 'orange' , score:  9}}},
            {set: {key: 'tile87',  value: {color: 'orange' , score: 10}}},
            {set: {key: 'tile88',  value: {color: 'orange' , score: 11}}},
            {set: {key: 'tile89',  value: {color: 'orange' , score: 12}}},
            {set: {key: 'tile90',  value: {color: 'orange' , score: 13}}},
            {set: {key: 'tile91',  value: {color: 'orange' , score:  1}}},
            {set: {key: 'tile92',  value: {color: 'orange' , score:  2}}},
            {set: {key: 'tile93',  value: {color: 'orange' , score:  3}}},
            {set: {key: 'tile94',  value: {color: 'orange' , score:  4}}},
            {set: {key: 'tile95',  value: {color: 'orange' , score:  5}}},
            {set: {key: 'tile96',  value: {color: 'orange' , score:  6}}},
            {set: {key: 'tile97',  value: {color: 'orange' , score:  7}}},
            {set: {key: 'tile98',  value: {color: 'orange' , score:  8}}},
            {set: {key: 'tile99',  value: {color: 'orange' , score:  9}}},
            {set: {key: 'tile100', value: {color: 'orange' , score: 10}}},
            {set: {key: 'tile101', value: {color: 'orange' , score: 11}}},
            {set: {key: 'tile102', value: {color: 'orange' , score: 12}}},
            {set: {key: 'tile103', value: {color: 'orange' , score: 13}}},

            {set: {key: 'tile104', value: {color: 'joker' , score: 0}}},
            {set: {key: 'tile105', value: {color: 'joker' , score: 0}}},

            // 5. set shuffle keys
            {shuffle: {
                keys: [
                    "tile0" , "tile1" , "tile2" , "tile3" , "tile4" , "tile5" , "tile6" , "tile7" , "tile8" , "tile9" ,
                    "tile10", "tile11", "tile12", "tile13", "tile14", "tile15", "tile16", "tile17", "tile18", "tile19",
                    "tile20", "tile21", "tile22", "tile23", "tile24", "tile25", "tile26", "tile27", "tile28", "tile29",
                    "tile30", "tile31", "tile32", "tile33", "tile34", "tile35", "tile36", "tile37", "tile38", "tile39",
                    "tile40", "tile41", "tile42", "tile43", "tile44", "tile45", "tile46", "tile47", "tile48", "tile49",
                    "tile50", "tile51", "tile52", "tile53", "tile54", "tile55", "tile56", "tile57", "tile58", "tile59",
                    "tile60", "tile61", "tile62", "tile63", "tile64", "tile65", "tile66", "tile67", "tile68", "tile69",
                    "tile70", "tile71", "tile72", "tile73", "tile74", "tile75", "tile76", "tile77", "tile78", "tile79",
                    "tile80", "tile81", "tile82", "tile83", "tile84", "tile85", "tile86", "tile87", "tile88", "tile89",
                    "tile90", "tile91", "tile92", "tile93", "tile94", "tile95", "tile96", "tile97", "tile98", "tile99",
                    "tile100", "tile101", "tile102", "tile103", "tile104", "tile105" ]}
            }

        ];

        // 7. set tile's visibility to players
        var visibility = [
            {setVisibility: {key: 'tile0',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile1',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile2',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile3',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile4',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile5',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile6',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile7',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile8',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile9',  visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile10', visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile11', visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile12', visibleToPlayerIndices: [0]}},
            {setVisibility: {key: 'tile13', visibleToPlayerIndices: [0]}},

            {setVisibility: {key: 'tile14', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile15', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile16', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile17', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile18', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile19', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile20', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile21', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile22', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile23', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile24', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile25', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile26', visibleToPlayerIndices: [1]}},
            {setVisibility: {key: 'tile27', visibleToPlayerIndices: [1]}},

            {setVisibility: {key: 'tile28', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile29', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile30', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile31', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile32', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile33', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile34', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile35', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile36', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile37', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile38', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile39', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile40', visibleToPlayerIndices: [2]}},
            {setVisibility: {key: 'tile41', visibleToPlayerIndices: [2]}},

            {setVisibility: {key: 'tile42', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile43', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile44', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile45', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile46', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile47', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile48', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile49', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile50', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile51', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile52', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile53', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile54', visibleToPlayerIndices: [3]}},
            {setVisibility: {key: 'tile55', visibleToPlayerIndices: [3]}}
        ];
        move = move.concat( visibility.slice(0, 14 * nPlayers) );

        return move;
    }

    function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_service.isMoveOk( {
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(true);
    }

    function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_service.isMoveOk( {
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(false);
    }

    describe("Corner case unit tests", function(){
        it ("[Right] check initial move", function() {
            var nPlayers = 2;
            expectMoveOk(0, defaultState, getInitMove(nPlayers));
        });

        it ("[Wrong] null move ", function(){
            expectIllegalMove(0, {}, null);
        });
        
        it ("[Wrong] empty move ", function(){
            expectIllegalMove(0, {}, []);
        });

    });

    describe("Two Players Mode", function() {

        var nPlayers = 2;
        var state = {};
        var initialMove;

        beforeEach(function twoPlayerMode() {
            initialMove = getInitMove(nPlayers);
            state.turnIndex = 0;
            state.trace = initialMove[2].set.value;
            state.board = initialMove[3].set.value;
            state.deltas = initialMove[4].set.value;
            for (var i = 0; i < 106; i++) {
                state['tile' + i] = _service.getTileByIndex(i);
            }
        });

        describe("[INIT]", function(){

            it ("[Right] initialize the game", function(){
                var turnIndexBeforeMove = 0;
                var stateBefore = {};
                stateBefore.nplayers = 2;
                var move = getInitMove(2);
                expectMoveOk(turnIndexBeforeMove, stateBefore, move);

            });

            it ("[Wrong] only 2 - 4 players are allowed to play the game.", function(){
                var stateBefore = {};
                stateBefore.nplayers = 5;
                var move = getInitMove(5);
                expectIllegalMove(0, stateBefore, move);

                stateBefore.nplayers = -2;
                move = getInitMove(-2);
                expectIllegalMove(0, stateBefore, move);
            });
        });

        describe("[PICK]", function() {

            beforeEach(function setMoveType(){
                state.type = "PICK";
            });

            function pickMoveTemplate(playerIndex, tileToPick) {
                var traceAfter = angular.copy(state.trace);
                traceAfter.nexttile = tileToPick + 1;
                return [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "PICK"}},
                    {set: {key: 'board', value: state.board}},
                    {set: {key: 'deltas', value: []}},     // pick move will clear delta history
                    {set: {key: 'trace', value: traceAfter}},
                    {setVisibility: {key: 'tile' + tileToPick, visibleToPlayerIndices: [playerIndex]}}
                ];
            }

            it ("[Right] player0 picks one tile from tile pool as his first move", function() {
                var stateBefore = angular.copy(state);
                var playerIndex = 0;
                var pickMove = pickMoveTemplate(playerIndex, 28);
                var boardExpect = [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    // p1 picks 28 from tile pool AND pick move triggers sort function to player's tiles
                    [13, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,0,28],
                    [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                ];
                pickMove[2].set.value = boardExpect;

                expectMoveOk(playerIndex, stateBefore, pickMove);

            });

            it ("[Right] player1 picks one tile from tile pool as his move", function() {
                var stateBefore = angular.copy(state);
                var playerIndex = 1;
                var pickMove = pickMoveTemplate(playerIndex, 28);
                var boardExpect = [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12, 13],
                    [14,15,16,17,18,19,20,21,22,23,24,25,26,27,28] // p2 picks 28 from tile pool
                ];
                pickMove[2].set.value = boardExpect;

                expectMoveOk(playerIndex, stateBefore, pickMove);

            });

            it ("[Right] player1 picks last tile from tool and then game is tied", function() {
                var stateBefore = angular.copy(state);
                stateBefore.trace.nexttile = 105;
                var move = pickMoveTemplate(0, 105);
                move[0] = {endMatch: {endMatchScores: [0, 0]}};
                move[2].set.value[6] = [13,1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,0,105],
                    /* ! tile index should be [0,106] ! */
                    expectMoveOk(0, stateBefore, move);

            });

            it ("[Wrong] picking invalid tile", function() {
                var stateBefore = angular.copy(state);
                var move = pickMoveTemplate(0, 28);

                /* ! picking 'undefined' !*/
                move[5].setVisibility.key = undefined;
                expectIllegalMove(0, stateBefore, move);

                /*! picking 'card', not 'tile' !*/
                move[5].setVisibility.key = 'card28';
                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] player can only pick tile next available", function() {
                var stateBefore = angular.copy(state);
                var move = pickMoveTemplate(0, 28);

                // should pick tile28
                stateBefore.trace.nexttile = 28;

                move[5].setVisibility.key = 'tile30';
                expectIllegalMove(0, stateBefore, move);

                move[5].setVisibility.key = 'tile27';
                expectIllegalMove(0, stateBefore, move);

                move[5].setVisibility.key = 'tile-1';
                expectIllegalMove(0, stateBefore, move);
            });

            it ("[Wrong] player cannot pick tile if he sent tiles to board and did not retrieve them back in this turn.", function(){
                var stateBefore = angular.copy(state);
                state.board[0][0] = 13;
                state.board[6] = [0,1,2,3,4,5,6,7,8,9,10,11,12];
                state.deltas = [{from: {row: 6, col: 13}, to: {row: 0, col: 0}, tileIndex: 13}];
                var move = pickMoveTemplate(0, 28);
                expectIllegalMove(0, stateBefore, move);
            });

            it ("[Wrong] player cannot mess up 'able-to-meld' board if he decides to pick tile", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                // after several moves, board is messed up.
                // because [9,10],[18,19],[20],[21] are not valid sets
                stateBefore.board = [
                    //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [-1,-1, 9,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,18,19,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,20,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12, 13],
                    [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                ];
                var move = pickMoveTemplate(playerIndex,28);

                expectIllegalMove(playerIndex, stateBefore, move);
            });

            it ("[Wrong] player cannot mess up 'able-to-meld' board", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore.board = [
                    // (1,2,3) is 'runs'  (21,34,60) is 'groups'
                    /*! (22,35,62) is neither 'runs' nor 'groups' !*/
                    [-1,-1,1,2,3,-1,-1,21,34,60,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,22,35,62,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,61,104,105,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12, 13],
                    [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                ];

                var move = pickMoveTemplate(playerIndex,28);

                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] after game is over, cannot pick anymore", function() {
                var stateBefore = angular.copy(state);
                stateBefore.trace.nexttile = 106;
                var move = pickMoveTemplate(1, 106);
                /* ! tile index should be [0,106] ! */
                expectIllegalMove(1, stateBefore, move);

            });
        });

        describe("[MOVE]", function() {
            function moveMoveTemplate(playerIndex, boardExpect, deltasExpect, tileToMove, visibleTo) {
                return [
                    {setTurn: {turnIndex: playerIndex}},        // this move will not change turnIndex
                    {set: {key: 'type', value: "MOVE"}},
                    {set: {key: 'board', value: boardExpect}},
                    {set: {key: 'deltas', value: deltasExpect}},
                    {setVisibility: {key: 'tile' + tileToMove, visibleToPlayerIndices: visibleTo}}
                ];
            }

            it ("[Right] player0 sends his tile to board after player1 picks one tile and shifts turn", function(){
                var playerIndex = 0;

                var stateBefore = angular.copy(state);

                var boardExpect = [
                   // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [ 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    // p1 sends tile0 to board[0][0]
                    [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],
                    [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                ];
                var tileToMove = 0;

                var deltasExpect = angular.copy(stateBefore.deltas);
                deltasExpect.push({from: {row: 6, col: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, boardExpect, deltasExpect, tileToMove,null);

                expectMoveOk(playerIndex, stateBefore, move);

            });

            it ("[Right] player0 continues to send his tile to board after he sent another tile in current turn", function() {
                var stateBefore = angular.copy(state);
                // simulating in last move, tile0 was sent to board[0][0]
                stateBefore.board[0][0] = 0;
                stateBefore.board[6][0] = -1;

                var playerIndex = 0;

                var boardExpect = [
                    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [ 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    // p1 sends tile13 to board[1][1]
                    [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,-1],
                    [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                ];

                var deltasExpect = angular.copy(stateBefore.deltas);
                var tileToMove = 13;
                deltasExpect.push({from: {row: 6, col: 13}, to: {row: 1, col: 1}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, boardExpect, deltasExpect, tileToMove,null);

                expectMoveOk(playerIndex, stateBefore, move);
            });

            it ("[Right] player1 performs a series of moves", function() {
                var playerIndex = 1;
                var stateBefore = angular.copy(state);

                // [1st move] tile14:  board[7][0]  -> board[0][0] (from hand to game board)
                var boardExpect = [
                    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [14,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 0
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 1
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 2
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 3
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 4
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 5
                    // p1 sends tile0 to board[1][1]
                    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],              // 6
                    [-1,15,16,17,18,19,20,21,22,23,24,25,26,27]               // 7
                ];

                var deltasExpect = angular.copy(stateBefore.deltas);
                var tileToMove = 14;
                deltasExpect.push({from: {row: 7, col: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, boardExpect, deltasExpect, tileToMove,null);

                expectMoveOk(playerIndex, stateBefore, move);

                // [2nd move] tile15: board[7][1] -> board[0][1] (from hand to game board)
                var stateBefore2 = angular.copy(state);
                stateBefore2.board = boardExpect;
                stateBefore2.deltas = deltasExpect;

                var boardExpect2 = [
                    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [14,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 0
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 1
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 2
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 3
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 4
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 5
                    // p1 sends tile0 to board[1][1]
                    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],              // 6
                    [-1,-1,16,17,18,19,20,21,22,23,24,25,26,27]               // 7
                ];
                var deltasExpect2 = angular.copy(stateBefore2.deltas);

                tileToMove = 15;
                deltasExpect2.push({from: {row: 7, col: 1}, to: {row: 0, col: 1}, tileIndex: tileToMove} );
                var move2 = moveMoveTemplate(playerIndex, boardExpect2, deltasExpect2, tileToMove,null);
                expectMoveOk(playerIndex, stateBefore2, move2);

                // [3rd move] tile14: board[0][0] -> board[5][5] (from game board to game board)
                var stateBefore3 = angular.copy(stateBefore2);
                stateBefore3.board = boardExpect2;
                stateBefore3.deltas = deltasExpect2;

                var boardExpect3 = [
                    //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [-1,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 0
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 1
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 2
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 3
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 4
                    [-1,-1,-1,-1,-1,14,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 5
                    // p1 sends tile0 to board[1][1]
                    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],              // 6
                    [-1,-1,16,17,18,19,20,21,22,23,24,25,26,27]               // 7
                ];
                var deltasExpect3 = angular.copy(stateBefore3.deltas);

                tileToMove = 14;
                deltasExpect3.push({from: {row: 0, col: 0}, to: {row: 5, col: 5}, tileIndex: tileToMove} );
                var move3 = moveMoveTemplate(playerIndex, boardExpect3, deltasExpect3, tileToMove,null);
                expectMoveOk(playerIndex, stateBefore3, move3);


                // [4th move] tile15: board[0][1] -> board[7][0] (From game board to hand)
                var stateBefore4 = angular.copy(stateBefore3);
                stateBefore4.board = boardExpect3;
                stateBefore4.deltas = deltasExpect3;

                var boardExpect4 = [
                    //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 0
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 1
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 2
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 3
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 4
                    [-1,-1,-1,-1,-1,14,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 5
                    [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],              // 6
                    [15,-1,16,17,18,19,20,21,22,23,24,25,26,27]               // 7
                ];
                var deltasExpect4 = angular.copy(stateBefore4.deltas);

                tileToMove = 15;
                deltasExpect4.push({from: {row: 0, col: 1}, to: {row: 7, col: 0}, tileIndex: tileToMove} );
                var move4 = moveMoveTemplate(playerIndex, boardExpect4, deltasExpect4, tileToMove, [1]);
                expectMoveOk(playerIndex, stateBefore4, move4);


            });

            it ("[Wrong] Send: sending undefined tile", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                var boardExpect = [
                    //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                    [ 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 0
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 1
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 5
                    [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],             // 6
                    [14,15,16,17,18,19,20,21,22,23,24,25,26,27]              // 7
                ];
                var deltasExpect = angular.copy(stateBefore.deltas);

                var tileToMove = undefined;
                var move = moveMoveTemplate(playerIndex, boardExpect, deltasExpect, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                tileToMove = "tileUnknown";
                move = moveMoveTemplate(playerIndex, boardExpect, deltasExpect, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] checkPositionWithinBoard for from ", function() {
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                var board = stateBefore.board;
                var deltas = stateBefore.deltas;

                var tileToMove = 0;

                deltas = angular.copy(stateBefore.deltas);
                // [!] from.col = undefined -> fail
                deltas.push({from: {row: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );
                var move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] from.row = -1 -> out of board's boundary -> fail
                deltas.push({from: {row: -1, col: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] from.row = 8 -> out of board's boundary -> fail
                deltas.push({from: {row: 8, col: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] from.col = -1 -> out of board's boundary -> fail
                deltas.push({from: {row: 0, col: -1}, to: {row: 0, col: 0}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] from.col = -1 -> out of board's boundary -> fail
                deltas.push({from: {row: 0, col: 20}, to: {row: 0, col: 0}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] From: sending tile29 but tile29 does not belong to player", function () {
                var stateBefore = angular.copy(state);
                var playerIndex = 1;
                var board = stateBefore.board;
                var deltas = stateBefore.deltas;
                board[7] = [1,2,3];

                var tileToMove = 29;
                deltas.push({from: {row: 7, col: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);

                // [!] player does not have tile29 in hand, so if he sent tile29, it should fail
                expectIllegalMove(playerIndex, stateBefore, move);
            });

            it ("[Wrong] From: an empty position", function() {
                var stateBefore = angular.copy(state);

                var playerIndex = 1;
                var board = stateBefore.board;
                var deltas = stateBefore.deltas;

                board[7] = [-1,1,2,3];

                // [!] cannot send from an empty position (-1 means empty position on board)
                var tileToMove = -1;
                deltas.push({from: {row: 7, col: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] checkPositionWithinBoard for to", function() {
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                var board = stateBefore.board;
                var deltas = stateBefore.deltas;

                var tileToMove = 0;
                var move;

                deltas = angular.copy(stateBefore.deltas);
                // [!] to.col = undefined -> fail
                deltas.push({from: {row: 6, col: 0}, to: {row: 0 }, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] to.row = -1 -> out of board's boundary -> fail
                deltas.push({from: {row: 6, col: 0}, to: {col: 0}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] to.row = 8 -> out of board's boundary -> fail
                deltas.push({from: {row: 6, col: 0}, to: {row: 8, col: 0}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] to.col = 21 -> out of board's boundary -> fail
                deltas.push({from: {row: 6, col: 0}, to: {row: 0, col: 20}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

                deltas = angular.copy(stateBefore.deltas);
                // [!] to.col = -1 -> out of board's boundary -> fail
                deltas.push({from: {row: 6, col: 0}, to: {row: 0, col: -1}, tileIndex: tileToMove} );
                move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);
                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] To: a non-empty position", function() {
                var stateBefore = angular.copy(state);

                var playerIndex = 1;
                var board = stateBefore.board;
                var deltas = stateBefore.deltas;
                //[!] board[0][0] is occupied by tile1, so no tile can be sent here
                board[0][0] = 1;
                board[7] = [1,2,3];

                var tileToMove = 1;
                deltas.push({from: {row: 7, col: 0}, to: {row: 0, col: 0}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] move tiles on board sent by other players when this player has not finished initial meld", function() {
                var stateBefore = angular.copy(state);
                var playerIndex = 1;
                var board = stateBefore.board;
                var deltas = stateBefore.deltas;

                board[0][0] = 18;
                var tileToMove = 18;

                //[!] tile18 was sent by other players -> move tile18 -> fail
                deltas.push({from: {row: 0, col: 0}, to: {row: 1, col: 1}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Right] move tiles on board sent by other players when this player has finished initial meld", function() {
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore.trace.initial[playerIndex] = true;
                stateBefore.board[0][0] = 18;

                var board = angular.copy(stateBefore.board);
                var deltas = angular.copy(stateBefore.deltas);

                var tileToMove = 18;
                board[0][0] = -1;
                board[1][1] = 18;

                //[!] tile18 was sent by other players -> move tile18 -> fail
                deltas.push({from: {row: 0, col: 0}, to: {row: 1, col: 1}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, board, deltas, tileToMove,null);

                expectMoveOk(playerIndex, stateBefore, move);

            });

            it ("[Wrong] Send: game is over, you cannot move any more.", function(){
                var playerIndex = 1;

                var stateBefore = angular.copy(state);
                // player0 has no tiles left in hand, he is the winner, game should end
                stateBefore.board[6] = [];
                // player1 still has tile15 in hand
                stateBefore.board[7] = [15];

                var tileToMove = 15;

                var deltasExpect = angular.copy(stateBefore.deltas);
                deltasExpect.push({from: {row: 7, col: 0}, to: {row: 1, col: 1}, tileIndex: tileToMove} );

                var move = moveMoveTemplate(playerIndex, stateBefore.board, deltasExpect, tileToMove,null);

                expectIllegalMove(playerIndex, stateBefore, move);

            });

        });

        describe("MELD move unit tests", function(){

            beforeEach(function setTiles(){
                for (var i = 0; i < 106; i++) {
                    state['tile' + i] = _service.getTileByIndex(i);
                }
            });

            function defaultMeldMove(playerIndex) {
                var meldMove = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];
                return meldMove;
            }

            it ("[Right] player1 scores 30 by one 'groups' for his initial meld, ", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,15,16,17,18,19,20,21,23,24,25]
                };
                // 'tile22', {color: 'blue',  score: 10}
                // 'tile35', {color: 'red' ,  score: 10}
                // 'tile61', {color: 'black', score: 10}
                state.tilesSentToBoardThisTurn = [22,61,35];   // has already sent tile 22, tile61, and tile 35 to baord.
                stateBefore.board[1] = [-1,-1,22,35,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,15,16,17,18,19,20,21,23,24,25]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectMoveOk(playerIndex, stateBefore, move);

            });

            it ("[Right] player1 scores 30 by combination of 'runs' and 'groups' for his initial meld, ", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,19,20,22,23,24,25]
                };
                // has already sent tile 15,16,17,18,21,34,60 to board
                // 'tile15', {color: 'blue',  score:  3}
                // 'tile16', {color: 'blue',  score:  4}
                // 'tile17', {color: 'blue',  score:  5}
                // 'tile18', {color: 'blue',  score:  6}
                // 'tile21', {color: 'blue',  score:  9}
                // 'tile34', {color: 'red' ,  score:  9}
                // 'tile60', {color: 'black', score:  9}
                stateBefore.tilesSentToBoardThisTurn = [15,16,34,60,21,17,18];
                stateBefore.board[1] = [-1,-1,21,34,60,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
                stateBefore.board[3] = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,15,16,17,18];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,19,20,22,23,24,25]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectMoveOk(playerIndex, stateBefore, move);

            });

            it ("[Right] player0 scores 36 by one 'runs' for his initial meld", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [0,1,2,3,4,5,6,7,8,9,13]
                };
                stateBefore.tilesSentToBoardThisTurn = [11,12,10];
                // tile10: {color: "blue" , score: 11}
                // tile11: {color: "blue" , score: 12}
                // tile12: {color: "blue" , score: 13}
                stateBefore.board[0] = [-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,1,2,3,4,5,6,7,8,9,13]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectMoveOk(0, stateBefore, move);

            });

            it ("[Right] player0's another meld after initial meld", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : true,
                    tiles    : [0,1,2,3,4,5,6,7,8,13]
                };
                stateBefore.tilesSentToBoardThisTurn = [9];
                stateBefore.board = [
                    [-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,87,35,61, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,1,2,3,4,5,6,7,8,13]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectMoveOk(0, stateBefore, move);

            });

            it ("[Right] player1 melds with joker after initial meld", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : true,
                    tiles    : [17,18,19,20,21,23,24,25]
                };
                stateBefore.tilesSentToBoardThisTurn = [14,16,105,15];
                stateBefore.board = [
                    [-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,87,105,61,22,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,14,15,16,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [17,18,19,20,21,23,24,25]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectMoveOk(playerIndex, stateBefore, move);
            });

            it ("[Right] player0 melds with two jokers in one group", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : true,
                    tiles    : [0,3,5,6,7,8,13]
                };
                stateBefore.tilesSentToBoardThisTurn = [4,2];
                stateBefore.board = [
                    [-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,87,35,61, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [1, 2,105, 4,104,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,3,5,6,7,8,13]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectMoveOk(0, stateBefore, move);

            });

            it ("[Wrong] player0 needs more than 30 score for his initial meld", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore.player0 = {
                    initial  : false,
                    tiles    : [0,      4,5,6,7,8,9,10,11,12,13]
                };
                stateBefore.tilesSentToBoardThisTurn = [1,2,3];
                stateBefore.board = [
                    [-1, 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                ];

                var move = [
                    {setTurn: {turnIndex: 1}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,      4,5,6,7,8,9,10,11,12,13]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] player1 tries to meld with wrong number of tiles", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore['player' + playerIndex] = {
                    initial  : true,
                    tiles    : [0,    3,4,5,6,7,8,9,10,11,12,13]
                };
                stateBefore.tilesSentToBoardThisTurn = [2,1];
                stateBefore.board[0] = [-1,2,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = defaultMeldMove();
                move[3].set.value.tiles    = [0,3,4,5,6,7,8,9,10,11,12,13];
                move[3].set.value.lastTurn = [0,3,4,5,6,7,8,9,10,11,12,13];

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] tiles in 'runs' should have the same color", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore['player' + playerIndex] = {
                    initial  : true,
                    tiles    : [0,1,2,3,4,5,6,7,8,9,      12,13   ]
                };
                stateBefore.tilesSentToBoardThisTurn = [64,11,10];
                // tile10: {color: "blue" , score: 11}
                // tile10: {color: "blue" , score: 12}
                // tile64: {color: "black", score: 13}   /* !! should have "blue" color to make a 'runs' !! */
                stateBefore.board[3] = [-1,10,11,64,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = defaultMeldMove(playerIndex);
                move[3].set.value.tiles = [0,1,2,3,4,5,6,7,8,9,12,13];
                move[3].set.value.lastTurn = [0,1,2,3,4,5,6,7,8,9,12,13];

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] tiles in 'runs' should have the consecutive number order", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore['player' + playerIndex] = {
                    initial  : true,
                    tiles    : [0,1,2,3,4,5,6,7,  9,      12,13]
                };
                stateBefore.tilesSentToBoardThisTurn = [11,8,10];
                // tile10: {color: "blue" , score: 11}
                // tile11: {color: "blue" , score: 12}
                // tile64: {color: "black", score: 13}   /* !! should have "blue" color to make a 'runs' !! */
                stateBefore.board[5] = [8,10,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = defaultMeldMove(playerIndex);
                move[3].set.value.tiles = [0,1,2,3,4,5,6,7,9,12,13];

                expectIllegalMove(playerIndex, stateBefore, move);

                // tile10: {color: "blue" , score: 11}
                // tile11: {color: "blue" , score: 12}
                // tile24: {color: "blue",  score: 12}   /* !! should have score:13 or score:10 to make a 'runs' !! */
                stateBefore['player' + playerIndex].tiles    = [0,1,2,3,4,5,6,7,8,9,      12,13   ];
                stateBefore['player' + playerIndex].lastTurn = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,24];
                stateBefore.board[5] = [10,11,24,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] tiles in 'groups' should have the same score", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,15,16,17,18,19,20,21,   23,24,25]
                };
                stateBefore.tilesSentToBoardThisTurn = [35,22,60];
                // 'tile22', {color: 'blue',  score: 10}
                // 'tile35', {color: 'red' ,  score: 10}
                // 'tile60', {color: 'black', score:  9}   /*!! should have score 10 to make a 'groups' !!*/
                stateBefore.board[2] = [-1,-1,35,22,60,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,15,16,17,18,19,20,21,   23,24,25]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}

                ];

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] tiles in 'groups' should have different colors with each other" , function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,15,16,17,18,19,20,21,   23,24,25]
                };
                stateBefore.tilesSentToBoardThisTurn = [22,48,35];
                // 'tile22', {color: 'blue',  score: 10}
                // 'tile35', {color: 'red' ,  score: 10}
                // 'tile48', {color: 'red' ,  score: 10}  /* !! cannot have color 'red' to make a 'groups' !! */
                stateBefore.board[3] = [-1,-1,35,22,48,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,15,16,17,18,19,20,21,   23,24,25]
                    }}},
                    {set: {key: "tilesSentToBoardThisTurn", value: []}}
                ];

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] score in initial meld should be at least 30", function(){

                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    // player sent tile14,tile15,tile16,tile35,tile36 to board in current turn.
                    tiles    : [         17,18,19,20,21,22,23,24,25      ]
                };
                stateBefore.tilesSentToBoardThisTurn = [15,16,14,61,35];

                // 'tile14', {color: 'blue',  score:  2}
                // 'tile15', {color: 'blue',  score:  3}
                // 'tile16', {color: 'blue',  score:  4}
                // 'tile9',  {color: 'blue',  score: 10} /*!! this tile was sent to board by opponent !!*/
                // 'tile35', {color: 'red' ,  score: 10}
                // 'tile61', {color: 'black', score: 10}
                /* !! sets = {9,35,61} cannot count as score because player has not finished initial meld,
                      all tiles in 'sets' to be scored should from the same player.!! */
                stateBefore.board[3] = [-1,-1,9,35,61,-1,-1,14,15,16,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [17,18,19,20,21,22,23,24,25]
                    }}},
                    {set: {key: "tilesSentToBoardThisTurn", value: []}}
                ];

                expectIllegalMove(playerIndex, stateBefore, move);
            });

            it ("[Wrong] player0 sent no tiles to board but want to meld", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore["player" + playerIndex] = {
                    initial  : true,
                    tiles    : [14,15,16,17,18,19,20,21,22,23,24,25,35,61]
                };
                stateBefore.tilesSentToBoardThisTurn = [];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,15,16,17,18,19,20,21,22,23,24,25,35,61]
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectIllegalMove(playerIndex, stateBefore, move);
            });

        });

        describe("UNKNOWN move unit tests", function(){
            it ("[Wrong] unknown move type ", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                expectIllegalMove(playerIndex, stateBefore, [
                    {setTurn: {turnIndex: playerIndex}},
                    {set: {key: 'type', value: "WHAT?"}}
                ]);
            });
        });

        describe("Ending game unit tests", function(){

            beforeEach(function setTiles(){
                for (var i = 0; i < 106; i++) {
                    state['tile' + i] = _service.getTileByIndex(i);
                }
            });

            it ("[Right] player0 wins the game", function() {
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                stateBefore.tilesSentToBoardThisTurn = [17,9,8];
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    tiles   : []
                };
                var playerIndexBefore = 1 - playerIndex;
                stateBefore["player" + playerIndexBefore] = {
                    initial : true,
                    // 'tile14': {color:'blue',score:  2}
                    // 'tile15': {color:'blue',score:  3}
                    tiles   : [14,15]
                };

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [10,104,105,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                var move = [
                    {endMatch: {endMatchScores:[5, -5]}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : []
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                ];

                expectMoveOk(playerIndex, stateBefore, move);
            });

            it ("[Right] player1 wins the game, player0 still holds joker in hand", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                // player1 sent tile9 to board in this turn and has no tiles left in hand.
                stateBefore.tilesSentToBoardThisTurn = [9];
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    tiles   : []
                };
                var playerIndexBefore = 1 - playerIndex;
                stateBefore["player" + playerIndexBefore] = {
                    initial : true,
                    // 'tile14': {color:'blue',score:  2}
                    // 'tile15': {color:'blue',score:  3}
                    // 'tile104': {color:'joker',score: 0}
                    // joker's score is 30 when calculating ending score
                    tiles   : [14,15,104]
                };

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1],
                    [105,10,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                expectMoveOk(playerIndex, stateBefore, [
                    {endMatch: {endMatchScores:[-35, 35]}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial:  true,
                        tiles   : []
                    }}},
                    {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                    ]);
            });

            it ("[Wrong] cannot move any more when someone wins the game.", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                stateBefore.tilesSentToBoardThisTurn = [];
                var playerIndexBefore = 1 - playerIndex;
                stateBefore["player" + playerIndexBefore] = {
                    initial : true,
                    tiles   : []
                };
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    // 'tile14': {color:'blue',score:  2}
                    // 'tile15': {color:'blue',score:  3}
                    // 'tile104': {color:'joker',score:0}
                    tiles   : [14,15,104]
                };

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [10,105,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];


                expectIllegalMove(playerIndex, stateBefore, [
                        {setTurn: {turnIndex: 1 - playerIndex}},
                        {set: {key: 'type', value: "MELD"}},
                        {set: {key: 'player' + playerIndex, value: {
                            initial:  true,
                            tiles   : []
                        }}},
                        {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                    ]
                );
            });

            it ("[Right] game maybe not over even if all tiles are sent to players", function(){
                var playerIndex = 0;
                var stateBefore = angular.copy(state);
                // all tiles are sent to players
                stateBefore.nexttile = 106;

                stateBefore.tilesSentToBoardThisTurn = [];
                var playerIndexBefore = 1 - playerIndex;
                stateBefore["player" + playerIndexBefore] = {
                    initial : true,
                    // player can send tile to board
                    tiles   : [2]
                };
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    tiles   : [14]
                };

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1, 3, 4, 5, 6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [10,105,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];


                expectIllegalMove(playerIndex, stateBefore, [
                        {setTurn: {turnIndex: 1 - playerIndex}},
                        {set: {key: 'type', value: "MELD"}},
                        {set: {key: 'player' + playerIndex, value: {
                            initial:  true,
                            tiles   : []
                        }}},
                        {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                    ]
                );

            });

            it ("[Wrong] cannot move after game is tied", function(){
                var playerIndex = 1;
                var stateBefore = angular.copy(state);
                // all tiles are sent to players
                stateBefore.nexttile = 106;

                stateBefore.tilesSentToBoardThisTurn = [];
                var playerIndexBefore = 1 - playerIndex;
                stateBefore["player" + playerIndexBefore] = {
                    initial : true,
                    tiles   : [2]
                };
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    tiles   : [14]
                };

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1, 4, 5, 6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [10,105,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];


                expectIllegalMove(playerIndex, stateBefore, [
                        {setTurn: {turnIndex: 1 - playerIndex}},
                        {set: {key: 'type', value: "MELD"}},
                        {set: {key: 'player' + playerIndex, value: {
                            initial:  true,
                            tiles   : []
                        }}},
                        {set: {key: 'tilesSentToBoardThisTurn', value: []}}
                    ]
                );
            });

        });

    });

});
