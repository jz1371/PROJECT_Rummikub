/**
 * Created by Wenzhao on 3/2/15.
 */
/**
 * Created by Wenzhao on 3/2/15.
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


    describe("PICK move unit tests", function() {

        beforeEach(function setMoveType(){
            state.type = "PICK";
        });

        function defaultPickMove(playerIndex) {
            // player0 picks one tile28 from tile pool
            var pickMove = [
                {setTurn: {turnIndex: (1 - playerIndex)}},
                {set: {key: 'type', value: "PICK"}},
                {setVisibility: {key: 'tile28', visibleToPlayerIndices: [playerIndex]}},
                {
                    set: {
                        key: 'player' + playerIndex, value: {
                            initial : false,
                            tiles   : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,28]
                        }
                    }
                },
                {set: {key: 'nexttile', value: 29}}
            ];
            return pickMove;
        }

        it ("[Wrong] player0 must pick or meld during the first turn", function() {
            var stateBefore = state;
            stateBefore.nexttile = 30;

            expectMoveOk(0, stateBefore, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'type', value: "PICK"}},
                {setVisibility: {key: 'tile30', visibleToPlayerIndices: [0]}},
                {set: {key: 'player0', value: {
                    initial : false,
                    tiles   : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,30]
                }}},
                {set: {key: 'nexttile', value: 31}}
            ]);

        });

    });



    describe("SEND move unit tests", function() {
        function defaultSendMove(playerIndex) {
            var sendMove = [
                // player0 sends tile 13 from his rack to board
                {setTurn: {turnIndex: playerIndex}},
                {set: {key: 'type', value: "SEND"}},
                {set: {key: 'todelta', value: {tile: 13, row: 0, col: 0}}},
                {set: {key: 'player' + playerIndex, value: {
                    initial : false,
                    tiles   : [0,1,2,3,4,5,6,7,8,9,10,11,12]
                }}},
                {set: {key: 'tilesSentToBoardThisTurn', value: [13]}},
                {set: {key: 'board', value: [
                    [13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ]}},
                {setVisibility: {key: 'tile13', visibleToPlayerIndices: [(1 - playerIndex)]}}
            ];
            return sendMove;
        }

        it ("[Right] player1 sends his tile to board after player0 picks one tile and shifts turn", function(){
            var playerIndex = 1;
            var stateBefore = state;

            var move = defaultSendMove(playerIndex);

            expectMoveOk(playerIndex, stateBefore, move);

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

        it ("[Right] player0 melds with two jokers in one group", function(){
            var playerIndex = 0;
            var stateBefore = state;
            stateBefore["player" + playerIndex] = {
                initial  : true,
                tiles    : [0,3,5,6,7,8,13]
            };
            stateBefore.tilesSentToBoardThisTurn = [2];
            stateBefore.board = [
                [-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,87,35,61, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [1,-1,105, 2,104,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
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

    });
});







