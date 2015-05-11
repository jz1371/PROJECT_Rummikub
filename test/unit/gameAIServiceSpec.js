/**
 *  File: test/unit/gameAIServiceSpec.js
 *  -----------------------------------------------
 *  Usage: (assuming at the project root initially)
 *
 *     $ cd test
 *     $ ../node_modules/karma/bin/karma start
 *
 *     Or for globally installed karma
 *
 *     $ cd test
 *     $ karma start
 *
 *  -----------------------------------------------
 *  @author: Jingxin Zhu
 *  @date  : 2015.04.07
 */


describe("AI service", function() {

    'use strict';

    var _aiService;
    var _gameLogic;

    beforeEach(module('myApp'));

    beforeEach(inject(function(gameAIService, gameLogicService) {
        _aiService = gameAIService;
        _gameLogic = gameLogicService;
    }));

    function getDefaultState() {
        var state = {};
        state.trace = {nplayers: 2, initial: [false, false], nexttile: 28};
        state.board = [
            //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 0
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 1
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 5
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
            [14,15,16,17,18,19,20,21,22,23,24,25,26]
        ];
        state.deltas = [];
        state.type = "INIT";

        state.tile0 = {color: 'blue'  , score:  1};
        state.tile1 = {color: 'blue'  , score:  2};
        state.tile2 = {color: 'blue'  , score:  3};
        state.tile3 = {color: 'blue'  , score:  4};
        state.tile4 = {color: 'blue'  , score:  5};
        state.tile5 = {color: 'blue'  , score:  6};
        state.tile6 = {color: 'blue'  , score:  7};
        state.tile7 = {color: 'blue'  , score:  8};
        state.tile8 = {color: 'blue'  , score:  9};
        state.tile9 = {color: 'blue'  , score: 10};
        state.tile10 = {color: 'blue'  , score: 11};
        state.tile11 = {color: 'blue'  , score: 12};
        state.tile12 = {color: 'blue'  , score: 13};
        state.tile13 = {color: 'blue'  , score:  1};
        state.tile14 = {color: 'blue'  , score:  2};
        state.tile15 = {color: 'blue'  , score:  3};
        state.tile16 = {color: 'blue'  , score:  4};
        state.tile17 = {color: 'blue'  , score:  5};
        state.tile18 = {color: 'blue'  , score:  6};
        state.tile19 = {color: 'blue'  , score:  7};
        state.tile20 = {color: 'blue'  , score:  8};
        state.tile21 = {color: 'blue'  , score:  9};
        state.tile22 = {color: 'blue'  , score: 10};
        state.tile23 = {color: 'blue'  , score: 11};
        state.tile24 = {color: 'blue'  , score: 12};
        state.tile25 = {color: 'blue'  , score: 13};

        state.tile26 = {color: 'red' , score:  1};
        state.tile27 = {color: 'red' , score:  2};
        state.tile28 = {color: 'red' , score:  3};
        state.tile29 = {color: 'red' , score:  4};
        state.tile30 = {color: 'red' , score:  5};
        state.tile31 = {color: 'red' , score:  6};
        state.tile32 = {color: 'red' , score:  7};
        state.tile33 = {color: 'red' , score:  8};
        state.tile34 = {color: 'red' , score:  9};
        state.tile35 = {color: 'red' , score: 10};
        state.tile36 = {color: 'red' , score: 11};
        state.tile37 = {color: 'red' , score: 12};
        state.tile38 = {color: 'red' , score: 13};
        state.tile39 = {color: 'red' , score:  1};
        state.tile40 = {color: 'red' , score:  2};
        state.tile41 = {color: 'red' , score:  3};
        state.tile42 = {color: 'red' , score:  4};
        state.tile43 = {color: 'red' , score:  5};
        state.tile44 = {color: 'red' , score:  6};
        state.tile45 = {color: 'red' , score:  7};
        state.tile46 = {color: 'red' , score:  8};
        state.tile47 = {color: 'red' , score:  9};
        state.tile48 = {color: 'red' , score: 10};
        state.tile49 = {color: 'red' , score: 11};
        state.tile50 = {color: 'red' , score: 12};
        state.tile51 = {color: 'red' , score: 13};

        state.tile52 = {color: 'black' , score:  1};
        state.tile53 = {color: 'black' , score:  2};
        state.tile54 = {color: 'black' , score:  3};
        state.tile55 = {color: 'black' , score:  4};
        state.tile56 = {color: 'black' , score:  5};
        state.tile57 = {color: 'black' , score:  6};
        state.tile58 = {color: 'black' , score:  7};
        state.tile59 = {color: 'black' , score:  8};
        state.tile60 = {color: 'black' , score:  9};
        state.tile61 = {color: 'black' , score: 10};
        state.tile62 = {color: 'black' , score: 11};
        state.tile63 = {color: 'black' , score: 12};
        state.tile64 = {color: 'black' , score: 13};
        state.tile65 = {color: 'black' , score:  1};
        state.tile66 = {color: 'black' , score:  2};
        state.tile67 = {color: 'black' , score:  3};
        state.tile68 = {color: 'black' , score:  4};
        state.tile69 = {color: 'black' , score:  5};
        state.tile70 = {color: 'black' , score:  6};
        state.tile71 = {color: 'black' , score:  7};
        state.tile72 = {color: 'black' , score:  8};
        state.tile73 = {color: 'black' , score:  9};
        state.tile74 = {color: 'black' , score: 10};
        state.tile75 = {color: 'black' , score: 11};
        state.tile76 = {color: 'black' , score: 12};
        state.tile77 = {color: 'black' , score: 13};

        state.tile78 = {color: 'orange' , score:  1};
        state.tile79 = {color: 'orange' , score:  2};
        state.tile80 = {color: 'orange' , score:  3};
        state.tile81 = {color: 'orange' , score:  4};
        state.tile82 = {color: 'orange' , score:  5};
        state.tile83 = {color: 'orange' , score:  6};
        state.tile84 = {color: 'orange' , score:  7};
        state.tile85 = {color: 'orange' , score:  8};
        state.tile86 = {color: 'orange' , score:  9};
        state.tile87 = {color: 'orange' , score: 10};
        state.tile88 = {color: 'orange' , score: 11};
        state.tile89 = {color: 'orange' , score: 12};
        state.tile90 = {color: 'orange' , score: 13};
        state.tile91 = {color: 'orange' , score:  1};
        state.tile92 = {color: 'orange' , score:  2};
        state.tile93 = {color: 'orange' , score:  3};
        state.tile94 = {color: 'orange' , score:  4};
        state.tile95 = {color: 'orange' , score:  5};
        state.tile96 = {color: 'orange' , score:  6};
        state.tile97 = {color: 'orange' , score:  7};
        state.tile98 = {color: 'orange' , score:  8};
        state.tile99 = {color: 'orange' , score:  9};
        state.tile100 = {color: 'orange' , score: 10};
        state.tile101 = {color: 'orange' , score: 11};
        state.tile102 = {color: 'orange' , score: 12};
        state.tile103 = {color: 'orange' , score: 13};

        state.tile104 = {color: 'joker' , score: 0};
        state.tile105 = {color: 'joker' , score: 0};

        return state;

    }

    function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk( {
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(true);
    }

    function expectMeldOk(playerIndex, stateAfter, moveExpected) {

        var actualMove = _gameLogic.createMeldMove(playerIndex, stateAfter);

        //console.log("act: " + JSON.stringify(actualMove));

        //console.log("exp: " + JSON.stringify(moveExpected));

        expect(angular.equals(actualMove, moveExpected)).toBe(true);

    }

    function expectPickOk(playerIndex, stateBefore, moveExpected) {

        var actualMove = _gameLogic.createPickMove(playerIndex, stateBefore);

        //console.log("act: " + JSON.stringify(actualMove));

        //console.log("exp: " + JSON.stringify(moveExpected));

        expect(angular.equals(actualMove, moveExpected)).toBe(true);
    }

    function updateGameStateAfterAIMove(stateBefore, aiMove) {
        var stateAfter = angular.copy(stateBefore);
        stateAfter.board  = aiMove[2].set.value;
        stateAfter.deltas = aiMove[3].set.value;
        stateAfter.trace  = aiMove[4].set.value;
        return stateAfter;
    }

    it ("[computer makes winning move by sending group to board]", function() {
        var playerIndex = 0;

        /**** Stage I: game state before computer making move */
        var stateBefore = getDefaultState();
        // computer has tile10, tile11, tile12 in hand, and can meld with them
        stateBefore.board = [
            //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 0
            [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1], // 1
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 5
            [10,11,12], // {tile10: blue11}, {tile11: blue12}, {tile12: blue13}
            [14,15]
        ];

        /**** Stage II: computer make ai move */
        // ai move will send tile10, tile11, tile12 from player's hand to board
        var move = _aiService.createComputerMove(0, stateBefore);
        expectMoveOk(playerIndex, stateBefore, move);

        /**** Stage III: after last ai move, computer will make a meld move to finish this turn */
        var stateAfter = updateGameStateAfterAIMove(stateBefore, move);
        var boardExpect = [
            [10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 0
            [0,1,2, 3, 4, 5, 6, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1],    // 1
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],  // 5
            [],
            // {tile14: blue2}, {tile15: blue3} -> endScore = blue2 + blue3 = 5
            [14,15]
        ];
        var traceExpect = {nexttile: 28, nplayers: 2, initial: [true, false]};

        expectMoveOk(playerIndex, stateAfter, [
            {endMatch: {endMatchScores: [5, -5]}}, // tiles left in player1' hand
            {set: {key: "type", value: "MELD"}},
            {set: {key: "board", value: boardExpect}},
            {set: {key: "deltas", value: []}},
            {set: {key: "trace", value: traceExpect}}
        ]);
    });

    it ("[computer makes winning move by sending run]", function() {

        var stateBefore = getDefaultState();
        stateBefore.board = [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [9, 35, 61],// {tile9: blue10}, {tile35: red10}, {tile12: black10}
            [14,15]
        ];

        var aiMove = _aiService.createComputerMove(0, stateBefore);
        expectMoveOk(0, stateBefore, aiMove);

        var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

        var boardExpect = [
            [ 9,35,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [],
            [14,15]
        ];
        var traceExpect = {nexttile: 28, nplayers: 2, initial: [true, false]};

        expectMeldOk(0, stateAfter, [
            {endMatch: {endMatchScores: [5, -5]}}, // tiles left in player1' hand
            {set: {key: "type", value: "MELD"}},
            {set: {key: "board", value: boardExpect}},
            {set: {key: "deltas", value: []}},
            {set: {key: "trace", value: traceExpect}}
        ]);

    });

    it ('[computer chooses to send tiles to meld when it can]', function() {

        var stateBefore = getDefaultState();
        stateBefore.board = [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [1,2,3,4],
            [35,36,37,38,39] // tile35: red10, tile36: red11, tile37: red12, tile38: red13
        ];

        var aiMove = _aiService.createComputerMove(1, stateBefore);
        expectMoveOk(1, stateBefore, aiMove);

        var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

        var boardExpect = [
            [35,36,37,38,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [1,2,3,4],
            [39]
        ];
        var traceExpect = {nexttile: 28, nplayers: 2, initial: [false, true]};

        expectMeldOk(1, stateAfter, [
            {setTurn: {turnIndex: 0}},
            {set: {key: "type", value: "MELD"}},
            {set: {key: "board", value: boardExpect}},
            {set: {key: "deltas", value: []}},
            {set: {key: "trace", value: traceExpect}}
        ]);

    });

    it('[computer has to pick one more tile when no tiles in hand can meld', function(){

        var playerIndex = 1;

        var stateBefore = getDefaultState();
        stateBefore.board = [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [1,2,3,4],
            [35,37,38] // tile35: red10, tile36: red11, tile38: red13
        ];

        // computer cannot meld using tiles in his hand,
        // so computer has to pick one more tile to his hand
        var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
        expectMoveOk(1, stateBefore, aiMove);

        expectPickOk(1, stateBefore, aiMove);

    });

    it("[computere sends two sets to board]", function () {

        var playerIndex = 1;

        var stateBefore = getDefaultState();
        stateBefore.board = [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [1,2,3,4],
            // tile7: blue8, tile8: blue9, tile9: blue10
            // tile35: red10, tile36: red11, tile37: red12
            [35,36,37, 7, 8, 9, 28]
        ];

        var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
        expectMoveOk(playerIndex, stateBefore, aiMove);

        var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

        var boardExpect = [
            [7, 8, 9, -1,35,36,37,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [1,2,3,4],
            // tile7: blue8, tile8: blue9, tile9: blue10
            // tile35: red10, tile36: red11, tile37: red12
            [28]
        ];

        var traceExpect = {nexttile: 28, nplayers: 2, initial: [false,true]};

        expectMeldOk(playerIndex, stateAfter, [
            {setTurn: {turnIndex: 1 - playerIndex}},
            {set: {key: 'type', value: "MELD"}},
            {set: {key: 'board', value: boardExpect}},
            {set: {key: 'deltas', value: []}},
            {set: {key: 'trace', value: traceExpect}}
        ]);

    });
    
    describe("[right position to send tiles]", function () {

        it ("player1 sending winning tiles to first qualified positions on board", function() {
            var playerIndex = 1;

            var stateBefore = getDefaultState();
            stateBefore.board = [
                // since board[0][0] - board[0][2] have been occupied
                // computer will send tiles to position after board[0][2]
                [ 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [9],
                [35,36,37] // tile35: red10, tile36: red11, tile37: red12
            ];

            var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
            expectMoveOk(playerIndex, stateBefore, aiMove);

            var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

            var boardExpect = [
                [ 1, 2, 3,-1,35,36,37,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [9], // tile9: blue10 => score: 10
                []
            ];
            var traceExpect = {nexttile: 28, nplayers: 2, initial: [false, true]};

            expectMeldOk(playerIndex, stateAfter, [
                {endMatch: {endMatchScores: [-10, 10]}}, // tiles left in player1' hand
                {set: {key: "type", value: "MELD"}},
                {set: {key: "board", value: boardExpect}},
                {set: {key: "deltas", value: []}},
                {set: {key: "trace", value: traceExpect}}
            ]);
        });

        it ("player0 finds the position to send at the end of row", function() {
            var playerIndex = 0;

            var stateBefore = getDefaultState();
            stateBefore.board = [
                // since board[0][0] - board[0][2] have been occupied
                // computer will send tiles to position starting at board[0][15]

                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1,-1,-1, 4, 5, 6,-1,-1, 7, 8, 9,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [35,36,37,39], // tile35: red10, tile36: red11, tile37: red12
                [9]
            ];

            var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
            expectMoveOk(playerIndex, stateBefore, aiMove);

            var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

            var boardExpect = [
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1,-1,-1, 4, 5, 6,-1,-1, 7, 8, 9,-1,35,36,37],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [39],
                [9]
            ];
            var traceExpect = {nexttile: 28, nplayers: 2, initial: [true, false]};

            expectMeldOk(playerIndex, stateAfter, [
                {setTurn: {turnIndex: 1 - playerIndex}},
                {set: {key: "type", value: "MELD"}},
                {set: {key: "board", value: boardExpect}},
                {set: {key: "deltas", value: []}},
                {set: {key: "trace", value: traceExpect}}
            ]);
        });

        it ("player0 finds the position at the next row", function() {
            var playerIndex = 0;

            var stateBefore = getDefaultState();
            stateBefore.board = [
                // since board[0][0] - board[0][2] have been occupied
                // computer will send tiles to position starting at board[1][0]

                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1,-1,-1, 4, 5, 6,-1,-1, 7, 8, 9,10,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [35,36,37,39], // tile35: red10, tile36: red11, tile37: red12
                [9]
            ];

            var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
            expectMoveOk(playerIndex, stateBefore, aiMove);

            var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

            var boardExpect = [
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1,-1,-1, 4, 5, 6,-1,-1, 7, 8, 9,10,-1,-1,-1],
                [35,36,37,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [39],
                [9]
            ];
            var traceExpect = {nexttile: 28, nplayers: 2, initial: [true, false]};

            expectMeldOk(playerIndex, stateAfter, [
                {setTurn: {turnIndex: 1 - playerIndex}},
                {set: {key: "type", value: "MELD"}},
                {set: {key: "board", value: boardExpect}},
                {set: {key: "deltas", value: []}},
                {set: {key: "trace", value: traceExpect}}
            ]);
        });

        it ("player0 finds right positions for multiple sets", function() {
            var playerIndex = 0;

            var stateBefore = getDefaultState();
            stateBefore.board = [
                // since board[0][0] - board[0][2] have been occupied
                // computer will send tiles to position starting at board[1][0]

                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1,-1,-1, 4, 5, 6,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [35,36,37,39, 7, 8, 9], // tile35: red10, tile36: red11, tile37: red12
                [9]
            ];

            var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
            expectMoveOk(playerIndex, stateBefore, aiMove);

            var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

            var boardExpect = [
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1,-1,-1, 4, 5, 6,-1, 7, 8, 9,-1,35,36,37,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [39],
                [9]
            ];
            var traceExpect = {nexttile: 28, nplayers: 2, initial: [true, false]};

            expectMeldOk(playerIndex, stateAfter, [
                {setTurn: {turnIndex: 1 - playerIndex}},
                {set: {key: "type", value: "MELD"}},
                {set: {key: "board", value: boardExpect}},
                {set: {key: "deltas", value: []}},
                {set: {key: "trace", value: traceExpect}}
            ]);
        });

        it ("player0 finds the position at the next row", function() {
            var playerIndex = 0;

            var stateBefore = getDefaultState();
            // no place on board to send tiles, so computer has to pick one more tile
            stateBefore.board = [
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1,-1,-1, 4, 5, 6,-1,-1, 7, 8, 9,10,-1,-1,-1],
                [-1,-1,-1,13,14,15,-1,-1,-1,-1,16,17,18,-1,-1,19,20,21],
                [-1,-1,22,23,24,25,-1,-1,-1,-1,26,27,28,29,30,-1,-1,-1],
                [-1,-1,-1,31,32,33,34,-1,-1,-1,-1,35,36,37,38,-1,-1,-1],
                [-1,-1,39,40,41,42,-1,-1,-1,-1,43,44,45,46,47,-1,-1,-1],
                [-1,-1,-1,48,49,50,51,-1,-1,-1,-1,52,53,54,55,-1,-1,-1],
                [35,36,37,39], // tile35: red10, tile36: red11, tile37: red12
                [9]
            ];

            var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);

            expectPickOk(0, stateBefore, aiMove);

        });

    });

    describe("[initial meld]", function () {
        it ("player1 cannot send tiles that score less than 30 when he has not finished initial meld", function() {
            var playerIndex = 1;

            var stateBefore = getDefaultState();
            stateBefore.board = [
                [ 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [9],
                [4,5,6] // tile4: blue5, tile5: blue6, tile6: blue7 -> score: 18
            ];

            // computer has to pick, since tiles in hand score less than 30
            var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
            expectMoveOk(playerIndex, stateBefore, aiMove);

            expectPickOk(playerIndex, stateBefore, aiMove);

        });

        it ("player0 can send tiles score less than 30 when he has finished initial meld", function() {
            var playerIndex = 0;

            var stateBefore = getDefaultState();
            stateBefore.board = [
                [ 1, 2, 3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [4,5,6], // tile4: blue5, tile5: blue6, tile6: blue7 -> score: 18
                [9]
            ];

            stateBefore.trace.initial[playerIndex] = true;

            // computer can send tile4-tile6, since he has finished initial meld
            var aiMove = _aiService.createComputerMove(playerIndex, stateBefore);
            expectMoveOk(playerIndex, stateBefore, aiMove);

            var stateAfter = updateGameStateAfterAIMove(stateBefore, aiMove);

            var boardExpect = [
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 1, 2, 3,-1, 4, 5, 6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [],
                [9] // tile9: blue10 -> score: 10
            ];
            var traceExpect = {nexttile: 28, nplayers: 2, initial: [true, false]};

            expectMeldOk(playerIndex, stateAfter, [
                {endMatch: {endMatchScores: [10, -10]}}, // tiles left in player1' hand
                {set: {key: "type", value: "MELD"}},
                {set: {key: "board", value: boardExpect}},
                {set: {key: "deltas", value: []}},
                {set: {key: "trace", value: traceExpect}}
            ]);

        });


    });

});

