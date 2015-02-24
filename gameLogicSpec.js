describe("Rummikub Unit Tests", function() {

    var _service;
    var nPlayers = 2;
    var defaultState = {nplayers: nPlayers};
    var initMove = [];

    beforeEach(module("myApp"));

    function getInitMove(nPlayers) {
        var move = [
            // 1. set game turn
            {setTurn: {turnIndex: 0}},

            // 2. set move type
            {set: {key: 'type' , value: "INIT"}},

            // 3. set game board
            {set: { key: 'board', value: [
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
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
            {set: {key: 'player0', value: {
                initial: false,
                tiles: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],
                lastTurn: []}}},
            {set: {key: 'player1', value: {initial: false, tiles: [14,15,16,17,18,19,20,21,22,23,24,25,26,27], lastTurn: []}}},
            {set: {key: 'player2', value: {initial: false, tiles: [28,29,30,31,32,33,34,35,36,37,38,39,40,41], lastTurn: []}}},
            {set: {key: 'player3', value: {initial: false, tiles: [42,43,44,45,46,47,48,49,50,51,52,53,54,55], lastTurn: []}}}
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
            {setVisibility: {key: 'tile55', visibleToPlayerIndices: [3]}},
        ];
        move = move.concat( visibility.slice(0, 14 * nPlayers) );

        return move;
    }

    beforeEach(inject(function (gameLogicService) {
        _service = gameLogicService;
        initMove = getInitMove(nPlayers);
    }));


    /**
     *
     * @param turnIndexBeforeMove
     * @param stateBeforeMove dictionary of state.
     * @param move array of operations in the move.
     */
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

    it ("[Right] check initial move", function() {
        expectMoveOk(0, defaultState, initMove);
    });

    //it ("[Wrong] initialize game with wrong number of players", function() {
    //    defaultState.nplayers = -1;
    //    expectIllegalMove(0, defaultState, initMove);
    //    defaultState.nplayers = 5;
    //    expectIllegalMove(0, defaultState, initMove);
    //});

    it ("[Wrong] only player0 can play the initial move", function() {
        expectIllegalMove(1, defaultState, initMove);
        expectIllegalMove(6, defaultState, initMove);
    });

    describe("Two Players Mode", function() {
        nPlayers = 2;
        var state = {};
        var initialMove;

        beforeEach(function twoPlayerMode() {
            initialMove = getInitMove(nPlayers);
            state.board = initialMove[2].set.value;
            state.player0 = initialMove[110].set.value;
            state.player1 = initialMove[111].set.value;
            state.nplayers = 2;
            state.nexttile = 28;
        });

        describe("INIT move unit tests", function(){
            it ("[Right] initialize the game", function(){
                var playerIndex = 0;
                var stateBefore = {};
                stateBefore.nplayers = 2;
                var move = getInitMove(2);
                expectMoveOk(playerIndex, stateBefore, move);

            });
        });

        describe("PICK move unit tests", function() {

            function defaultPickMove() {
                // player0 picks one tile28 from tile pool
                var pickMove = [
                    {setTurn: {turnIndex: 1}},
                    {set: {key: 'type', value: "PICK"}},
                    {setVisibility: {key: 'tile28', visibleToPlayerIndices: [0]}},
                    {
                        set: {
                            key: 'player0', value: {
                                initial : false,
                                tiles   : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,28],
                                lastTurn: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                            }
                        }
                    },
                    {set: {key: 'nexttile', value: 29}}
                ];
                return pickMove;
            }

            it ("[Right] player0 picks one tile from tile pool as his first move", function() {
                var stateBefore = state;

                expectMoveOk(0, stateBefore, [
                    {setTurn: {turnIndex: 1}},
                    {set: {key: 'type', value: "PICK"}},
                    {setVisibility: {key: 'tile28', visibleToPlayerIndices: [0]}},
                    {
                        set: {
                            key: 'player0', value: {
                                initial : false,
                                tiles   : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,28],
                                lastTurn: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                            }
                        }
                    },
                    {set: {key: 'nexttile', value: 29}}
                ]);

            });

            it ("[Right] player1 picks one tile from tile pool as his move", function() {
                var stateBefore = state;
                stateBefore.nexttile = 29;

                expectMoveOk(1, stateBefore, [
                    {setTurn: {turnIndex: 0}},
                    {set: {key: 'type', value: "PICK"}},
                    {setVisibility: {key: 'tile29', visibleToPlayerIndices: [1]}},
                    {
                        set: {
                            key: 'player1', value: {
                                initial : false,
                                tiles   : [14,15,16,17,18,19,20,21,22,23,24,25,26,27,29],
                                lastTurn: [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                            }
                        }
                    },
                    {set: {key: 'nexttile', value: 30}}
                ]);

            });

            it ("[Wrong] player cannot pick tile while trying to meld", function() {
                var move = defaultPickMove();

                state.type = "SEND";
                expectIllegalMove(0, state, move);

                state.type = "RETRIEVE";
                expectIllegalMove(0, state, move);

                state.type = "REPLACE";
                expectIllegalMove(0, state, move);

            });

            it ("[Wrong] not picking any tile while deciding to pick", function() {

                var stateBefore = state;
                var move = defaultPickMove();
                move[2].setVisibility.key = undefined;

                expectIllegalMove(0, stateBefore, move);

                move[2].setVisibility.key = 'card28';
                expectIllegalMove(0, stateBefore, move);


            });

            it ("[Wrong] player1 cannot pick tile from tile pool when pool is empty", function() {
                state.type = "PICK";
                state.nexttile = 106;
                var move = defaultPickMove();

                expectIllegalMove(1, state, move);

            });

            it ("[Wrong] player can only pick tile next available", function() {
                var stateBefore = state;
                var move = defaultPickMove();

                stateBefore.nexttile = 28;

                move[2].setVisibility.key = 'tile30'
                expectIllegalMove(0, stateBefore, move);

                move[2].setVisibility.key = 'tile27'
                expectIllegalMove(0, stateBefore, move);
            });

        });

        describe("SEND move unit tests", function() {
            /* // player0 sends tile 13 from his rack to board
             * {setTurn: {turnIndex: 0}},
             * {set: {key: 'type', value: "SEND"}},
             * {set: {key: 'todelta'  , value: {tile: 13, row: 0, col: 0}}},
             * {set: {key: 'player0'  , value: {initial: true, tiles: [1,2,..12], lastTurn:[1,2,3,..13]}}},
             * {set: {key: 'board'    , value: [[13,-1,-1,..],[-1,-1,..-1],...]}},
             * {setVisibility: {key: 'tile13' , visibleToPlayerIndices: [1]}}
             */
            function defaultSendMove() {
                var sendMove = [
                    // player0 sends tile 13 from his rack to board
                    {setTurn: {turnIndex: 0}},
                    {set: {key: 'type', value: "SEND"}},
                    {set: {key: 'todelta', value: {tile:13, row: 0, col: 0}}},
                    {set: {key: 'player0', value: {
                        initial : false,
                        tiles   : [0,1,2,3,4,5,6,7,8,9,10,11,12],
                        lastTurn: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                    }}},
                    {set: {key: 'board', value: [
                        [13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    ]}},
                    {setVisibility: {key: 'tile13', visibleToPlayerIndices: [1]}}
                ];
                return sendMove;
            }

            it ("[Right] player0 sends his tile to board after player1 picks one tile and shifts turn", function(){
                var stateBefore = state;
                stateBefore.turnfinish = true;

                var move = defaultSendMove();

                expectMoveOk(0, stateBefore, move);

            });

            it ("[Right] player0 sends his tile to board after he sent another tile in current turn", function() {
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore.player0.tiles    = [0,1,2,3,4,5,6,7,8,9,10,11,12];
                stateBefore.player0.lastTurn = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];

                expectMoveOk(0, stateBefore,[
                    {setTurn: {turnIndex: 0}},
                    {set: {key: 'type', value: "SEND"}},
                    {set: {key: 'todelta', value: {tile:9, row: 0, col: 1}}},  // sending tile 9
                    {set: {key: 'player0', value: {
                        initial : false,
                        tiles   : [0,1,2,3,4,5,6,7,8,  10,11,12],
                        lastTurn: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                    }}},
                    {set: {key: 'board', value: [
                        [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    ]}},
                    {setVisibility: {key: 'tile9', visibleToPlayerIndices: [1]}}
                ]);
            });

            it ("[Right] player1 sends his tile to board after he sent another tile in current turn", function() {
                var stateBefore = state;
                state.turnfinish = false;
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
                    tiles   : [14,15,16,17,18,19,20,21,22,23,24,25,27],
                    lastTurn: [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                };

                expectMoveOk(1, stateBefore, [
                    {setTurn: {turnIndex: 1}},
                    {set: {key: "type", value: "SEND"}},
                    {set: {key: 'todelta', value: {tile: 27, row: 0, col: 0}}},  // sending tile27
                    {set: {key: 'player1', value: {
                        initial : false,
                        tiles   : [14,15,16,17,18,19,20,21,22,23,24,25],         // sending tile27 after send tile26
                        lastTurn: [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                    }}},
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

            it ("[Wrong] Send: sending undefined tile", function(){
                var stateBefore = state;
                var move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {row: 0, col: 0}}};

                expectIllegalMove(0, stateBefore, move);
            });

            it ("[Wrong] Send: sending tile29 but you should send your own tile: [0,1,2,3]", function () {
                var stateBefore = state;
                state.player0.tiles = [0,1,2,3];    // tiles that player holding before move

                var move = defaultSendMove();
                move[2].set.value.tile = 29;        // tile that player is to send in the move
                expectIllegalMove(0, stateBefore, move);

                move = defaultSendMove();
                move[2].set.value.tile = 'x29';      // tile to send in the move
                expectIllegalMove(0, stateBefore, move);
            });

            it ("[Wrong] checkPositionWithinBoard: (row, col) = (undefined, undefined) is undefined", function() {
                var stateBefore = state;
                var move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1}}};
                expectIllegalMove(0, stateBefore, move);

                move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1, col: 0}}};
                expectIllegalMove(0, stateBefore, move);

                move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1, row: 0}}};
                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] checkPositionWithinBoard: (row, col) = (undefined, undefined) is undefined", function() {
                var stateBefore = state;
                var move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1}}};
                expectIllegalMove(0, stateBefore, move);

                move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1, col: 0}}};
                expectIllegalMove(0, stateBefore, move);

                move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1, row: 0}}};
                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] checkPositionWithinBoard: position out Of board, [row: -1, col: 0]", function() {
                var stateBefore = state;
                var move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1, row: -1, col: 0}}};

                expectIllegalMove(0, stateBefore, move);
            });

            it ("[Wrong] checkPositionWithinBoard: position out Of board, [row: 1, col: 22]", function() {
                var stateBefore = state;
                var move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1, row: 1, col: 22}}};
                move[3].set.value.tiles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];

                expectIllegalMove(0, stateBefore, move);
            });

            it ("[Wrong] Send: board[1,1] is already occupied by tile32, you cannot send to this non-empty position in board.", function() {
                var stateBefore = state;
                state.board[1][1] = 32;         // tile32 is already in board[1][1]
                var move = defaultSendMove();
                move[2] = {set: {key: 'todelta', value: {tile: 1, row: 1, col: 1}}};
                move[3].set.value.tiles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];

                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] Send: game is over, you cannot move any more.", function(){
                var stateBefore = state;
                state.player0.tiles = [];

                var move = defaultSendMove();
                move[2].set.value.tile = 1;

                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] player0 finishes his turn and shifts turn to player1, player1 should change tiles in lastTurn after he sent tile to board ", function() {
                var stateBefore = state;
                stateBefore.turnfinish = true;
                stateBefore.player1 = {
                    initial : false,
                    tiles   : [14,15,16,17,      20],
                    lastTurn: [14,15,16,17,18,19,20]
                };
                stateBefore.board = [
                    [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,18,19,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                ];

                expectIllegalMove(1, stateBefore, [
                    {setTurn: {turnIndex: 1}},
                    {set: {key: 'type', value: "SEND"}},
                    {set: {key: 'todelta', value: {tile:15, row: 2, col: 0}}},  // sending tile 15
                    {set: {key: 'player1', value: {
                        initial : false,
                        tiles   : [14,   16,17,      20],
                        lastTurn: [14,15,16,17,18,19,20]    /*!!! should be [14,15,16,17,20] !!!*/
                    }}},
                    {set: {key: 'board', value: [
                        [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,18,19,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    ]}},
                    {setVisibility: {key: 'tile15', visibleToPlayerIndices: [0]}}
                ]);
            });

            it ("[Wrong] player1 sent tile18 to board, and then sent tile14 to board, so tiles in player1's lastTurn should not change", function(){
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore.board = [
                    [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,18,19,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                ];
                stateBefore.player1 = {
                    initial : false,
                    tiles   : [14,   16,17,      20],
                    lastTurn: [14,15,16,17,      20]
                };

                expectIllegalMove(1, stateBefore, [
                    {setTurn: {turnIndex: 1}},
                    {set: {key: 'type', value: "SEND"}},
                    {set: {key: 'todelta', value: {tile:14, row: 2, col: 3}}},  // sending tile 14
                    {set: {key: 'player1', value: {
                        initial : false,
                        tiles   : [      16,17,      20],
                        lastTurn: [   15,16,17,      20]      /*!!! should be [14,15,16,17,20]  !!!*/
                    }}},
                    {set: {key: 'board', value: [
                        [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,18,19,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [15,-1,-1,14,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    ]}},
                    {setVisibility: {key: 'tile14', visibleToPlayerIndices: [0]}}
                ]);
            });

        });

        describe("RETRIEVE move unit tests", function(){

            function defaultRetrieveMove(playerIndex) {
                var retrieveMove = [
                    // player0 retrieves tile9 from board
                    {setTurn: {turnIndex: playerIndex}},
                    {set: {key: 'type', value: "RETRIEVE"}},
                    {set: {key: 'fromdelta', value: {tile: 9, row: 0, col: 1}}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial : false,
                        tiles   : [0,1,2,3,4,5,6,7,8,  10,11,12,13,9],
                        lastTurn: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                    }}},
                    {set: {key: 'board', value: [
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,22,23,24,25,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    ]}},
                    {setVisibility: {key: 'tile9', visibleToPlayerIndices: [playerIndex]}}
                ];
                return retrieveMove;
            }

            it ("[Right] player0 retrieves tile from board", function(){
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore.board = [
                    [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,22,23,24,25,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];
                stateBefore.player0.tiles    = [0,1,2,3,4,5,6,7,8,  10,11,12,13];
                stateBefore.player0.lastTurn = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];  // tile9 belongs to player0 before this turn

                expectMoveOk(0, stateBefore, defaultRetrieveMove(0));

            });

            it ("[Wrong] checkPositionWithinBoard: position out of board.", function(){
                var playerIndex = 0;
                var stateBefore = state;

                var move = defaultRetrieveMove(playerIndex);
                move[2].set.value = {tile: 9, row: -1, col: 0};
                expectIllegalMove(playerIndex, stateBefore, move);

                move = defaultRetrieveMove(playerIndex);
                move[2].set.value = {tile: 9, row: 2, col: -5};
                expectIllegalMove(playerIndex, stateBefore, move);
            });

            it ("[Wrong] Retrieve: no tile in board[0][0]", function (){
                var playerIndex = 1;
                var stateBefore = state;
                state.board = [
                    [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,22,23,24,25,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                var move = defaultRetrieveMove(1);
                move[2] = {set: {key: 'fromdelta', value: {tile: 9, row: 0, col: 0}}};

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] Retrieve: retrieving tile, but you should retrieve your own tile", function(){
                var stateBefore = state;
                stateBefore.player1.tiles    = [15,16,17,18,19];
                stateBefore.player1.lastTurn = [15,16,17,18,19];
                state.board = [
                    [-1, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,22,23,24,25,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                var playerIndex = 1;
                var move = defaultRetrieveMove(playerIndex);
                move[2].set.value = {tile: 9, row: 0, col: 1};

                expectIllegalMove(1, stateBefore, move);
            });

        });

        describe("REPLACE move unit tests", function () {

            function defaultReplaceMove(playerIndex) {
                var replaceMove = [
                    {setTurn: {turnIndex: playerIndex}},
                    {set: {key: 'type', value: "REPLACE"}},
                    {set: {key: 'board', value: [
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    ]}},
                    {set: {key: 'fromdelta', value: {row: 0, col: 0}}},
                    {set: {key: 'todelta', value: {row: 0, col: 1}}},
                ];
                return replaceMove;
            }

            it ("[Right] player0 replaces tile5 from board[0][0] to board[1][1] before player0 finishes initial meld", function(){
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.board = [
                    [ 5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                ];
                stateBefore.player0 = {
                    initial : false,
                    tiles   : [0,1,2,3,4,  6,7,8,9,10,11,12,13],
                    lastTurn: [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                };

                var move = defaultReplaceMove(playerIndex);
                move[2].set.value = [
                    [-1, 5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                ];
                move[3] = {set: {key: 'fromdelta', value: {row: 0, col: 0}}};
                move[4] = {set: {key: 'todelta',   value: {row: 0, col: 1}}};

                expectMoveOk(playerIndex, stateBefore, move);

            });

            it ("[Right] player1 replaces tile18 from board[2][2] to board[1][1] after he finishes initial meld", function() {
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.player1.initial = true;
                stateBefore.board[2][2] = 18;

                var move = defaultReplaceMove(playerIndex);
                move[2].set.value[2][2] = -1;  // board[2][2]
                move[2].set.value[1][1] = 18;  // board[1][1]
                move[3] = {set: {key: 'fromdelta', value: {row: 2, col: 2}}};
                move[4] = {set: {key: 'todelta',   value: {row: 1, col: 1}}};

                expectMoveOk(playerIndex, stateBefore, move);
            });

            it ("[Wrong] checkPositionWithininBoard: ", function(){
                var playerIndex = 1;
                var stateBefore = state;
                var move = defaultReplaceMove(playerIndex);

                move[3] = {set: {key: 'fromdelta', value: { col: 5}}};
                expectIllegalMove(playerIndex, stateBefore, move);

                move[3] = {set: {key: 'fromdelta', value: { row: 5}}};
                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] Replace: no tile in board[5][5]", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.board[5][5] = -1;

                var move = defaultReplaceMove(playerIndex);
                move[3] = {set: {key: 'fromdelta', value: {row: 5, col: 5}}};

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] checkPositionWithinBoard: ", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.board[0][0] = 1;
                var move = defaultReplaceMove(playerIndex);

                move[4] = {set: {key: 'todelta', value: {row: 18, col: 5}}};
                expectIllegalMove(playerIndex, stateBefore, move);

                move[4] = {set: {key: 'todelta', value: {row: 5, col: 20}}};
                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] Replace: board[4][3] has been occupied with tile10", function(){
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.board[0][0] = 18;
                stateBefore.board[4][3] = 10;

                var move = defaultReplaceMove(playerIndex);
                move[3] = {set: {key: 'fromdelta', value: {row: 0, col: 0}}};
                move[4] = {set: {key: 'todelta', value: {row: 4, col: 3}}};

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] Replace: moving tile", function(){
                var playerIndex  = 1;
                var stateBefore = state;
                stateBefore.player1 = {initial: false, tiles: [14,15,16,17,18,19,20,21,22,23,24,25,26,27]};
                var move = defaultReplaceMove(playerIndex);

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
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
                        lastTurn : [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                    }}}
                ];
                return meldMove;
            }

            it ("[Right] player1 scores 30 by one 'groups' for his initial meld, ", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,15,16,17,18,19,20,21,   23,24,25,     ],
                    lastTurn : [14,15,16,17,18,19,20,21,22,23,24,25,35,61]
                };
                stateBefore.board[1] = [-1,-1,22,35,61,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,15,16,17,18,19,20,21,   23,24,25],
                        lastTurn : [14,15,16,17,18,19,20,21,   23,24,25]
                    }}}
                ];

                expectMoveOk(playerIndex, stateBefore, move);

            });

            it ("[Right] player1 scores 30 by combination of 'runs' and 'groups' for his initial meld, ", function(){
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,            19,20,   22,23,24,25     ],
                    lastTurn : [14,15,16,17,18,19,20,21,22,23,24,25,34,60]
                };
                stateBefore.board[1] = [-1,-1,21,34,60,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
                stateBefore.board[3] = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,15,16,17,18]

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,            19,20,   22,23,24,25     ],
                        lastTurn : [14,            19,20,   22,23,24,25     ]
                    }}}
                ];

                expectMoveOk(playerIndex, stateBefore, move);

            });

            it ("[Right] player0 scores 36 by one 'runs' for his initial meld", function(){
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [0,1,2,3,4,5,6,7,8,9,         13],
                    lastTurn : [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                };
                stateBefore.board[0] = [-1,10,11,12,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,1,2,3,4,5,6,7,8,9,         13],
                        lastTurn : [0,1,2,3,4,5,6,7,8,9,         13]
                    }}}
                ];

                expectMoveOk(0, stateBefore, move);

            });

            it ("[Right] player0's another meld after initial meld", function(){
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : true,
                    tiles    : [0,1,2,3,4,5,6,7,8,  13],
                    lastTurn : [0,1,2,3,4,5,6,7,8,9,13]
                };
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
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,1,2,3,4,5,6,7,8,13],
                        lastTurn : [0,1,2,3,4,5,6,7,8,13]
                    }}}
                ];

                expectMoveOk(0, stateBefore, move);

            });

            it ("[Right] player1 melds with joker after initial meld", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : true,
                    tiles    : [         17,18,19,20,21,23,24,25    ],
                    lastTurn : [14,15,16,17,18,19,20,21,23,24,25,105]
                };
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
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [         17,18,19,20,21,23,24,25    ],
                        lastTurn : [         17,18,19,20,21,23,24,25    ]
                    }}}
                ];

                expectMoveOk(playerIndex, stateBefore, move);
            });

            it ("[Wrong] player0 needs more than 30 score for his initial meld", function(){
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore.player0 = {
                    initial  : false,
                    tiles    : [0,      4,5,6,7,8,9,10,11,12,13],
                    lastTurn : [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                }
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
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [0,      4,5,6,7,8,9,10,11,12,13],
                        lastTurn : [0,      4,5,6,7,8,9,10,11,12,13]
                    }}}
                ];

                expectIllegalMove(0, stateBefore, move);

            });

            it ("[Wrong] player1 tries to meld with wrong number of tiles", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore['player' + playerIndex] = {
                    initial  : true,
                    tiles    : [0,    3,4,5,6,7,8,9,10,11,12,13],
                    lastTurn : [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                }
                stateBefore.board[0] = [-1,2,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];


                var move = defaultMeldMove();
                move[3].set.value.tiles    = [0,3,4,5,6,7,8,9,10,11,12,13];
                move[3].set.value.lastTurn = [0,3,4,5,6,7,8,9,10,11,12,13];


                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] tiles in 'runs' should have the same color", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore['player' + playerIndex] = {
                    initial  : true,
                    tiles    : [0,1,2,3,4,5,6,7,8,9,      12,13   ],
                    lastTurn : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,64]
                }
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
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore['player' + playerIndex] = {
                    initial  : true,
                    tiles    : [0,1,2,3,4,5,6,7,  9,      12,13],
                    lastTurn : [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
                }
                // tile10: {color: "blue" , score: 11}
                // tile11: {color: "blue" , score: 12}
                // tile64: {color: "black", score: 13}   /* !! should have "blue" color to make a 'runs' !! */
                stateBefore.board[5] = [8,10,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = defaultMeldMove(playerIndex);
                move[3].set.value.tiles = [0,1,2,3,4,5,6,7,9,12,13];
                move[3].set.value.lastTurn = [0,1,2,3,4,5,6,7,9,12,13];

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
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,15,16,17,18,19,20,21,   23,24,25,     ],
                    lastTurn : [14,15,16,17,18,19,20,21,22,23,24,25,35,60]
                };
                // 'tile22', {color: 'blue',  score: 10}
                // 'tile35', {color: 'red' ,  score: 10}
                // 'tile60', {color: 'black', score:  9}   /*!! should have score 10 to make a 'groups' !!*/
                stateBefore.board[2] = [-1,-1,35,22,60,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,15,16,17,18,19,20,21,   23,24,25],
                        lastTurn : [14,15,16,17,18,19,20,21,   23,24,25]
                    }}}
                ];

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] tiles in 'groups' should have different colors with each other" , function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    tiles    : [14,15,16,17,18,19,20,21,   23,24,25,     ],
                    lastTurn : [14,15,16,17,18,19,20,21,22,23,24,25,35,48]
                };
                // 'tile22', {color: 'blue',  score: 10}
                // 'tile35', {color: 'red' ,  score: 10}
                // 'tile48', {color: 'red' ,  score: 10}  /* !! cannot have color 'red' to make a 'groups' !! */
                stateBefore.board[3] = [-1,-1,35,22,48,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

                var move = [
                    {setTurn: {turnIndex: 1 - playerIndex}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [14,15,16,17,18,19,20,21,   23,24,25],
                        lastTurn : [14,15,16,17,18,19,20,21,   23,24,25]
                    }}}
                ];

                expectIllegalMove(playerIndex, stateBefore, move);

            });

            it ("[Wrong] score in initial meld should be at least 30", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial  : false,
                    // player sent tile14,tile15,tile16,tile35,tile36 to board in current turn.
                    tiles    : [         17,18,19,20,21,22,23,24,25      ],
                    lastTurn : [14,15,16,17,18,19,20,21,22,23,24,25,35,61]
                };

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
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial  : true,
                        tiles    : [17,18,19,20,21,22,23,24,25],
                        lastTurn : [17,18,19,20,21,22,23,24,25]
                    }}}
                ];

                expectIllegalMove(playerIndex, stateBefore, move);
            });

        });

        describe("UNKNOWN move unit tests", function(){
            it ("[Wrong] unknown move type ", function(){
                var playerIndex = 0;
                var stateBefore = state;
                expectIllegalMove(playerIndex, stateBefore, [
                    {setTurn: {turnIndex: playerIndex}},
                    {set: {key: 'type', value: "WHAT?"}}
                ]);
            });
        });

        describe("WINNING unit tests", function(){

            beforeEach(function setTiles(){
                for (var i = 0; i < 106; i++) {
                    state['tile' + i] = _service.getTileByIndex(i);
                }
            });

            it ("[Right] player0 wins the game", function() {
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    tiles   : []  ,
                    lastTurn: [7,8,9]
                }
                stateBefore["player" + (1-playerIndex)] = {
                    initial : true,
                    // 'tile14': {color:'blue',score:  2}
                    // 'tile15': {color:'blue',score:  3}
                    tiles   : [14,15],
                    lastTurn: [14,15]
                }

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [10,104,105,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                expectMoveOk(playerIndex, stateBefore, [
                    {endMatch: {endMatchScores:[5,-5]}},
                    {set: {key: 'type', value: "MELD"}},
                    {set: {key: 'turnfinish', value: true}},
                    {set: {key: 'player' + playerIndex, value: {
                        initial:  true,
                        tiles   : [],
                        lastTurn: []
                    }}}]
                );
            });

            it ("[Right] player1 wins the game, player0 still holds joker in hand", function(){
                var playerIndex = 0;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    tiles   : []  ,
                    lastTurn: [7,8,9]
                }
                stateBefore["player" + (1-playerIndex)] = {
                    initial : true,
                    // 'tile14': {color:'blue',score:  2}
                    // 'tile15': {color:'blue',score:  3}
                    // 'tile104': {color:'joker',score:0}
                    tiles   : [14,15,104],
                    lastTurn: [14,15,104]
                }

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [105,10,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                expectMoveOk(playerIndex, stateBefore, [
                        {endMatch: {endMatchScores:[35,-35]}},
                        {set: {key: 'type', value: "MELD"}},
                        {set: {key: 'turnfinish', value: true}},
                        {set: {key: 'player' + playerIndex, value: {
                            initial:  true,
                            tiles   : [],
                            lastTurn: []
                        }}}]
                );
            });

            it ("[Wrong] cannot move any more when someone wins the game.", function(){
                var playerIndex = 1;
                var stateBefore = state;
                stateBefore.turnfinish = false;
                stateBefore["player" + (1 - playerIndex)] = {
                    initial : true,
                    tiles   : []  ,
                    lastTurn: []
                }
                stateBefore["player" + playerIndex] = {
                    initial : true,
                    // 'tile14': {color:'blue',score:  2}
                    // 'tile15': {color:'blue',score:  3}
                    // 'tile104': {color:'joker',score:0}
                    tiles   : [14,15,104],
                    lastTurn: [14,15,104]
                }

                stateBefore.board = [
                    [-1, 7, 8, 9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [10,105,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,16,17,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                ];

                expectIllegalMove(playerIndex, stateBefore, [
                        {setTurn: {turnIndex: (1 - playerIndex)}},
                        {set: {key: 'type', value: "MELD"}},
                        {set: {key: 'turnfinish', value: true}},
                        {set: {key: 'player' + playerIndex, value: {
                            initial:  true,
                            tiles   : [],
                            lastTurn: []
                        }}}]
                );
            });

        });

    });

});
