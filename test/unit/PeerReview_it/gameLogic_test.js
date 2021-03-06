/**
 * File: gameLogic_test.js
 * ------------------------------------------
 * This can be used as the starting skeleton for test.
 * ------------------------------------------
 */
describe("Rummikub Unit Tests", function() {

    var _service;
    var initMove = [];
    var nPlayers = 4;
    var defaultState = {nplayers: nPlayers};

    beforeEach(module("myApp"));

    function getInitMove(nPlayers) {
        var move = [
            // 1. set game turn
            {setTurn: {turnIndex: 0}},

            // 2. set move type
            {set: {key: 'type' , value: "INIT"}},

            {set: {key: 'tilesSentToBoardThisTurn', value: []}},

            // 3. set game board
            {set: { key: 'board', value: [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                ]}
            },

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

        // 6. set game players
        var players = [
            {set: {key: 'player0', value: {initial: false, tiles: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13] }}},
            {set: {key: 'player1', value: {initial: false, tiles: [14,15,16,17,18,19,20,21,22,23,24,25,26,27] }}},
            {set: {key: 'player2', value: {initial: false, tiles: [28,29,30,31,32,33,34,35,36,37,38,39,40,41] }}},
            {set: {key: 'player3', value: {initial: false, tiles: [42,43,44,45,46,47,48,49,50,51,52,53,54,55] }}}
        ];
        for (var i = 0; i < nPlayers; i++) {
            move.push(players[i]);
        }

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

    beforeEach(inject(function (gameLogic) {
        _service = gameLogic;
    }));

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

    it("Initial hand should be random, this test checks that for two initial states that change", function (){

        expect(_service.getInitialMove(0, 4)).not.toEqual(_service.getInitialMove(0,4));

    })

    /* By jz */
    // possible test scenario for above test.
    fit("Initial hand should be random, this test checks that for two initial states that change", function (){
        expect(_service.getInitialMove(0, 4)).toEqual(_service.getInitialMove(0,4));
    })

    it("Change the values of a tile and submit a move should be illegal", function(){
        var initialState = _service.getInitialMove(0, 4);
        //Illegally change a tile in the players hand (board now inconsistant
        var newState = [];
        angular.copy(initialState, newState);
        newState[4] = {set: {key:"tile0", value:{color:'joker', score:0}}};
        console.log('initialTile')
        console.log(newState[4]);
        newState[1] = {set: {key: 'type', value: 'SEND'}};
        newState[2] = {set: {key:'tilesSentToBoardThisTurn', value: ['tile0']}}

        expectIllegalMove(0,initialState, newState)

    });
    var nPlayers = 2;
    var state = {};
    var initialMove;

    beforeEach(function twoPlayerMode() {
        initialMove = getInitMove(nPlayers);
        state.tilesSentToBoardThisTurn = initialMove[2].set.value;
        state.board = initialMove[3].set.value;
        state.player0 = initialMove[111].set.value;
        state.player1 = initialMove[112].set.value;
        state.nplayers = 2;
        state.nexttile = 28;
    });

    it ("Expect error when changing players before turn declared complete", function() {
        var stateBefore = state;
        // player sent tile 26 to board
        state.board = [
            [-1,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
        state.player1 = {
            initial : false,
            tiles   : [14,15,16,17,18,19,20,21,22,23,24,25,27]
        };
        state.tilesSentToBoardThisTurn = [26];

        expectIllegalMove(1, stateBefore, [
            {setTurn: {turnIndex: 0}}, //Change happened here
            {set: {key: "type", value: "SEND"}},
            {set: {key: 'todelta', value: {tile: 27, row: 0, col: 0}}},  // set turn index to other player
            {set: {key: 'player1', value: {
                initial : false,
                tiles   : [14,15,16,17,18,19,20,21,22,23,24,25]
            }}},
            {set: {key: 'tilesSentToBoardThisTurn', value: [26,27]}},
            {set: {key: 'board', value: [
                [27,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            ]}},
            {setVisibility: {key: 'tile27', visibleToPlayerIndices: [0]}}
        ]);
    });


    it ("Expect error when randomly removing tiles form a players hand", function() {
        var stateBefore = state;
        // player sent tile 26 to board
        state.board = [
            [-1,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
        state.player1 = {
            initial : false,
            tiles   : [14,15,16,17,18,19,20,21,22,23,24,25,27]
        };
        state.tilesSentToBoardThisTurn = [26];

        expectIllegalMove(1, stateBefore, [
            {setTurn: {turnIndex: 1}}, //Change happened here
            {set: {key: "type", value: "SEND"}},
            {set: {key: 'todelta', value: {tile: 27, row: 0, col: 0}}},  // set turn index to other player
            {set: {key: 'player1', value: {
                initial : false,
                tiles   : [14,20,21,22,23,24,25] //Change made here
            }}},
            {set: {key: 'tilesSentToBoardThisTurn', value: [26,27]}},
            {set: {key: 'board', value: [
                [27,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            ]}},
            {setVisibility: {key: 'tile27', visibleToPlayerIndices: [0]}}
        ]);
    });

    it ("Expect an error when placing non-consecutive tiles on the board", function() {
        var stateBefore = state;
        // player sent tile 26 to board
        state.board = [
            [-1,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
        state.player1 = {
            initial : false,
            tiles   : [14,15,16,17,18,19,20,21,22,23,24,25,27]
        };
        state.tilesSentToBoardThisTurn = [26];

        expectIllegalMove(1, stateBefore, [
            {setTurn: {turnIndex: 1}}, //Change happened here
            {set: {key: "type", value: "SEND"}},
            {set: {key: 'todelta', value: {tile: 27, row: 0, col: 0}}},  // set turn index to other player
            {set: {key: 'player1', value: {
                initial : false,
                tiles   : [15,16,18,20,21,22,23,24,25] //Change made here
            }}},
            {set: {key: 'tilesSentToBoardThisTurn', value: [26,27,14,17,19]}},
            {set: {key: 'board', value: [
                [27,26,14,17,19,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            ]}},
            {setVisibility: {key: 'tile27', visibleToPlayerIndices: [0]}}
        ]);
    });

    it ("Expect an error changing state to Meld after the game has begun", function() {
        var stateBefore = state;
        // player sent tile 26 to board
        state.board = [
            [-1,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
        state.player1 = {
            initial : false,
            tiles   : [14,15,16,17,18,19,20,21,22,23,24,25,27]
        };
        state.tilesSentToBoardThisTurn = [26];

        expectIllegalMove(1, stateBefore, [
            {setTurn: {turnIndex: 1}}, //Change happened here
            {set: {key: "type", value: "MELD"}},
            {set: {key: 'todelta', value: {tile: 27, row: 0, col: 0}}},  // set turn index to other player
            {set: {key: 'player1', value: {
                initial : false,
                tiles   : [14,15,16,17,18,19,20,21,22,23,24,25] //Change made here
            }}},
            {set: {key: 'tilesSentToBoardThisTurn', value: [26,27]}},
            {set: {key: 'board', value: [
                [27,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            ]}},
            {setVisibility: {key: 'tile27', visibleToPlayerIndices: [0]}}
        ]);
    });

    it ("Expect move ok, send a single tile to the board to win", function() {
        var stateBefore = state;
        // player sent tile 26 to board
        state.board = [
            [-1,26,27,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
        state.player1 = {
            initial : false,
            tiles   : [25]
        };
        state.tilesSentToBoardThisTurn = [25];

        expectMoveOk(1, stateBefore, [
            {setTurn: {turnIndex: 1}}, //Change happened here
            {set: {key: "type", value: "MELD"}},
            {set: {key: 'todelta', value: {tile: 25, row: 0, col: 0}}},  // set turn index to other player
            {set: {key: 'player1', value: {
                initial : false,
                tiles   : [25]
            }}},
            {set: {key: 'tilesSentToBoardThisTurn', value: [25,26,27]}},
            {set: {key: 'board', value: [
                [25,26,27,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            ]}},
            {setVisibility: {key: 'tile25', visibleToPlayerIndices: [0]}}
        ]);
    });

    /* By: jz */
    // possible scenario for above unit test if it is "SEND" move
    fit ("Expect move ok, send a single tile to the board to win", function() {
        var stateBefore = state;
        // player sent tile 26 to board
        state.board = [
            [-1,26,27,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
        state.player1 = {
            initial : true,
            tiles   : [25]    /* player1 still holds tile25 in hand */
        };
        state.tilesSentToBoardThisTurn = [26]; /* player1 sent tile26 to board in last move */

        expectMoveOk(1, stateBefore, [
            {setTurn: {turnIndex: 1}},  /* next move should still be player1 */
            {set: {key: "type", value: "SEND"}},
            {set: {key: 'todelta', value: {tile: 25, row: 0, col: 0}}},  // set turn index to other player
            {set: {key: 'player1', value: {
                initial : true,
                tiles   : []   /* after sending tile25 to board, player1 has no tile left in hand */
            }}},
            {set: {key: 'tilesSentToBoardThisTurn', value: [26, 25]}},  /* player1 sent tile25 after sending tile26 */
            {set: {key: 'board', value: [
               [25,26,27,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            ]}},
            {setVisibility: {key: 'tile25', visibleToPlayerIndices: [0]}}
        ]);
    });

     /* By: jz */
    // possible scenario for unit test at Line 456 if it is "MELD" move
    beforeEach(function setTiles(){
        /* need to set tile in state */
            for (var i = 0; i < 106; i++) {
                state['tile' + i] = _service.getTileByIndex(i);
            }
    });

    fit ("Expect move ok, send a single tile to the board to win", function() {
        // game state after making the move in last unit test. (i.e. sending tile25 to board)
        var stateBefore = state;
            //{set: {key: 'tile25', value: {color: 'blue'  , score: 13}}},
            //{set: {key: 'tile26', value: {color: 'red' , score:  1}}},
            //{set: {key: 'tile27', value: {color: 'red' , score:  2}}},
            // -> {tile25, tile26, tile27 is qualified for meld
        state.board = [
            [25,26,27,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
        state.player1 = {
            initial : true,  
            tiles   : []     /* player1 has no tile left in hand */
        };
        state.player0 = {
            initial : true,
            tiles: [0]
        }
        state.tilesSentToBoardThisTurn = [26,25];    /* player1 sent tile25 to board in last move */

        expectIllegalMove(1, stateBefore, [
            {endMatch: {endMatchScores:[-1, 1]}}, /* player1 will win the match after he melds */
            {set: {key: "type", value: "MELD"}},
            {set: {key: 'player1', value: {
                initial : true,
                tiles   : []   /* after sending tile25 to board, player1 has no tile left in hand */
            }}},
            {set: {key: 'tilesSentToBoardThisTurn', value: []}},  /* after successful meld, tilesSentToBoardThisTurn is cleared */
            ]
            );
    });
});
