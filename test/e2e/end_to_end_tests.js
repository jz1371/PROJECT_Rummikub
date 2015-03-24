describe('myApp', function() {

    var rowsInBoard = 6;
    var colsInRow = 18;

    beforeEach(function () {
        var url  = "game.html";
        // Load the game page
        browser.get(url);
    });

    var tiles = {};

    function defineTileByIndex (tileIndex) {
        var state = {
            tile0 : {color: 'blue'  , score:  1},
            tile1 : {color: 'blue'  , score:  2},
            tile2 : {color: 'blue'  , score:  3},
            tile3 : {color: 'blue'  , score:  4},
            tile4 : {color: 'blue'  , score:  5},
            tile5 : {color: 'blue'  , score:  6},
            tile6 : {color: 'blue'  , score:  7},
            tile7 : {color: 'blue'  , score:  8},
            tile8 : {color: 'blue'  , score:  9},
            tile9 : {color: 'blue'  , score: 10},
            tile10: {color: 'blue'  , score: 11},
            tile12: {color: 'blue'  , score: 13},
            tile13: {color: 'blue'  , score:  1},
            tile14: {color: 'blue'  , score:  2},
            tile15: {color: 'blue'  , score:  3},
            tile16: {color: 'blue'  , score:  4},
            tile17: {color: 'blue'  , score:  5},
            tile18: {color: 'blue'  , score:  6},
            tile19: {color: 'blue'  , score:  7},
            tile20: {color: 'blue'  , score:  8},
            tile21: {color: 'blue'  , score:  9},
            tile22: {color: 'blue'  , score: 10},
            tile23: {color: 'blue'  , score: 11},
            tile24: {color: 'blue'  , score: 12},
            tile25: {color: 'blue'  , score: 13},

            tile26: {color: 'red' , score:  1},
            tile27: {color: 'red' , score:  2},
            tile28: {color: 'red' , score:  3},
            tile29: {color: 'red' , score:  4},
            tile30: {color: 'red' , score:  5},
            tile31: {color: 'red' , score:  6},
            tile32: {color: 'red' , score:  7},
            tile33: {color: 'red' , score:  8},
            tile34: {color: 'red' , score:  9},
            tile35: {color: 'red' , score: 10},
            tile36: {color: 'red' , score: 11},
            tile37: {color: 'red' , score: 12},
            tile38: {color: 'red' , score: 13},
            tile39: {color: 'red' , score:  1},
            tile40: {color: 'red' , score:  2},
            tile41: {color: 'red' , score:  3},
            tile42: {color: 'red' , score:  4},
            tile43: {color: 'red' , score:  5},
            tile44: {color: 'red' , score:  6},
            tile45: {color: 'red' , score:  7},
            tile46: {color: 'red' , score:  8},
            tile47: {color: 'red' , score:  9},
            tile48: {color: 'red' , score: 10},
            tile49: {color: 'red' , score: 11},
            tile50: {color: 'red' , score: 12},
            tile51: {color: 'red' , score: 13},

            tile52: {color: 'black' , score:  1},
            tile53: {color: 'black' , score:  2},
            tile54: {color: 'black' , score:  3},
            tile55: {color: 'black' , score:  4},
            tile56: {color: 'black' , score:  5},
            tile57: {color: 'black' , score:  6},
            tile58: {color: 'black' , score:  7},
            tile59: {color: 'black' , score:  8},
            tile60: {color: 'black' , score:  9},
            tile61: {color: 'black' , score: 10},
            tile62: {color: 'black' , score: 11},
            tile63: {color: 'black' , score: 12},
            tile64: {color: 'black' , score: 13},
            tile65: {color: 'black' , score:  1},
            tile66: {color: 'black' , score:  2},
            tile67: {color: 'black' , score:  3},
            tile68: {color: 'black' , score:  4},
            tile69: {color: 'black' , score:  5},
            tile70: {color: 'black' , score:  6},
            tile71: {color: 'black' , score:  7},
            tile72: {color: 'black' , score:  8},
            tile73: {color: 'black' , score:  9},
            tile74: {color: 'black' , score: 10},
            tile75: {color: 'black' , score: 11},
            tile76: {color: 'black' , score: 12},
            tile77: {color: 'black' , score: 13},

            tile78: {color: 'orange' , score:  1},
            tile79: {color: 'orange' , score:  2},
            tile80: {color: 'orange' , score:  3},
            tile81: {color: 'orange' , score:  4},
            tile82: {color: 'orange' , score:  5},
            tile83: {color: 'orange' , score:  6},
            tile84: {color: 'orange' , score:  7},
            tile85: {color: 'orange' , score:  8},
            tile86: {color: 'orange' , score:  9},
            tile87: {color: 'orange' , score: 10},
            tile88: {color: 'orange' , score: 11},
            tile89: {color: 'orange' , score: 12},
            tile90: {color: 'orange' , score: 13},
            tile91: {color: 'orange' , score:  1},
            tile92: {color: 'orange' , score:  2},
            tile93: {color: 'orange' , score:  3},
            tile94: {color: 'orange' , score:  4},
            tile95: {color: 'orange' , score:  5},
            tile96: {color: 'orange' , score:  6},
            tile97: {color: 'orange' , score:  7},
            tile98: {color: 'orange' , score:  8},
            tile99: {color: 'orange' , score:  9},
            tile100: {color: 'orange' , score: 10},
            tile101: {color: 'orange' , score: 11},
            tile102: {color: 'orange' , score: 12},
            tile103: {color: 'orange' , score: 13},

            tile104: {color: 'joker' , score: 0},
            tile105: {color: 'joker' , score: 0},
        };
        return state["tile" + tileIndex];
    }

    function getBoardDiv(row, col) {
        return element(by.id('e2e_test_board_div_' + row + 'x' + col));
    }

    function getBoardTile(row, col, tileKind) {
        return element(by.id('e2e_test_' + tileKind + '_' + row + 'x' + col));
    }

    function getTileIndexByAttribute(tile, attr) {
        return tile.element(by.css('.test-hidden')).getAttribute(attr);
    }

    function getTileKind(tileIndex) {
        return tiles["tile" + tileIndex].color;
    }

    function expectBoardTile(row, col, tileIndex) {
        if (tileIndex === -1 || tileIndex > 105 || tileIndex < 0) {
            expectNoTile(row, col);
        } else {
            var tileKind = getTileKind(tileIndex);
            console.log("kind: " + tileKind);
            if (tileKind !== undefined) {
                expect(getBoardTile(row, col, "joker").isPresent()).toBe(tileKind === "joker" ? true : false);
                expect(getBoardTile(row, col, "nonjoker").isPresent()).toBe(tileKind !== "joker" ? true : false);
            }
        }
    }

    /**
     * Expect no tile appears at board[row][col]
     *
     * @param row
     * @param col
     */
    function expectNoTile(row, col) {
        expect(getBoardTile(row, col, 'nonjoker').isPresent()).toBe(false);
        expect(getBoardTile(row, col, 'joker').isPresent()).toBe(false);
    }

    function expectBoard(board) {
        for(var row = 0; row < rowsInBoard; row++) {
            for (var col = 0; col < colsInRow; col++) {
                expectBoardTile(row, col, board[row][col]);
            }
        }
    }

    function clickBoardCellAndExpectTile(row, col, tileIndex) {
        var cell = getBoardDiv(row, col);
        cell.click();
        expectBoardTile(row, col, tileIndex);
    }

    /* click the index-th tile in current player's hand */
    function clickHandTile(index) {
        var tileWrapper = element(by.id("e2e_test_wrapper_" + index));
        tileWrapper.click();
        return element(by.id("e2e_test_hand_" + index));
    }

    function clickHandArea() {
        return element(by.id("player-panel")).click();
    }

    function storeTile(tileIndex, color) {
        tiles["tile" + tileIndex] = {color: color};
    }


    function setMatchState(matchState, playMode) {
        browser.executeScript(function(matchStateInJson, playMode) {
            var stateService = window.e2e_test_stateService;
            stateService.setMatchState(angular.fromJson(matchStateInJson));
            stateService.setPlayMode(angular.fromJson(playMode));
            angular.element(document).scope().$apply(); // to tell angular that things changes.
        }, JSON.stringify(matchState), JSON.stringify(playMode));
    }

    function getDefaultBoard() {
        // initially each position is occupied by -1,
        // which indicates no tile is placed there.
        var board = [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        ];
        return board;
    }

    describe('[setup]', function() {

        it('web should have a title', function(){
            expect(browser.getTitle()).toEqual('Rummikub');
        });

        it('board should be empty', function () {
            expectBoard(getDefaultBoard());
        });

    });

    describe("[send one tile from hand to board]", function(){

         it("should succeed if clicking ont tile in hand and then click one empty position on board", function(){

            var index = Math.floor((Math.random() * 14) + 1) - 1;   // could be random number [0, tilesInHand.length]

            //var tileToSend = element(by.id("e2e_test_hand_" + index));
            var tileToSend = clickHandTile(index);

            tileToSend.getAttribute("tile-index").then(function(attr){

                var tileIndex = attr;

                tileToSend.getAttribute("color").then(function(color){

                    //tiles["tile" + tileIndex] = {color: attr};
                    storeTile(tileIndex, color);

                    // click one empty position on board
                    var row = 1;
                    var col = 1;
                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    var board = getDefaultBoard();
                    board[row][col] = tileIndex;

                    expectBoardTile(row, col, tileIndex);

                });
            });
        });

        it("should ignore clicking on a non-empty cell", function(){

            var index = Math.floor((Math.random() * 14) + 1) - 1;   // could be random number [0, tilesInHand.length]

            //var tileToSend = element(by.id("e2e_test_hand_" + index));
            var tileToSend = clickHandTile(index);

            tileToSend.getAttribute("tile-index").then(function(attr){

                tileToSend.getAttribute("color").then(function(color){
                    var tileIndex = attr;

                    //tiles["tile" + tileIndex] = {color: attr};
                    storeTile(tileIndex, color);

                    // click one empty position on board
                    var row = 1;
                    var col = 1;

                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    var board = getDefaultBoard();
                    board[row][col] = tileIndex;

                    expectBoardTile(row, col, tileIndex);

                });
            });;
        });
    });

    describe("[retrieve one tile from board to player]", function(){

        it("should succeed retrieve tile sent in this turn", function() {

            var index = Math.floor((Math.random() * 14) + 1) - 1;   // could be random number [0, tilesInHand.length]

            // 1. send one tile to board
            // 1.1 activate one tile in hand
            var tileToSend = clickHandTile(index);

            tileToSend.getAttribute("tile-index").then(function(tileIndex){

                tileToSend.getAttribute("color").then(function(color){

                    storeTile(tileIndex, color);

                    // 1.2 send tile to board
                    var row = 1;
                    var col = 1;
                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    var tilesInHand = element.all(by.repeater("tileIndex in curPlayer"));
                    expect(tilesInHand.count()).toEqual(13);

                    //2. then retrieve it back

                    // 2.1 click one tile from board
                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    // 2.2 click hand area to retrieve it
                    //clickHandArea();
                    clickHandArea();

                    //var board = getDefaultBoard();

                    expectBoardTile(row, col, -1);

                    // one more tile back to hand
                    expect(tilesInHand.count()).toEqual(14);

                });
            });
        });

        it("should fail retrieve from empty board position", function() {

            var index = Math.floor((Math.random() * 14) + 1) - 1;

            var tileToSend = clickHandTile(index);

            tileToSend.getAttribute("tile-index").then(function(tileIndex){

                tileToSend.getAttribute("color").then(function(color){

                    storeTile(tileIndex, color);

                    var row = 1;
                    var col = 1;
                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    var tilesInHand = element.all(by.repeater("tileIndex in curPlayer"));
                    expect(tilesInHand.count()).toEqual(13);

                    //2. then retrieve it back

                    // 2.1 click one tile from empty position
                    clickBoardCellAndExpectTile(row + 1, col + 1, -1);

                    // 2.2 click hand area to retrieve it
                    //clickHandArea();
                    clickHandArea();

                    var board = getDefaultBoard();
                    board[row][col] = tileIndex;

                    // no change at board[row][col]
                    expectBoardTile(row, col, tileIndex);

                    expectBoardTile(row + 1, col + 1, -1);

                    // no change for tiles in hand
                    expect(tilesInHand.count()).toEqual(13);

                });
            });
        });

    });// end of describe [retrieve]

    describe("[replace one tile from board to board", function() {

        it("should succeed replace", function () {

            var index = Math.floor((Math.random() * 14) + 1) - 1;

            var tileToSend = clickHandTile(index);

            tileToSend.getAttribute("tile-index").then(function (tileIndex) {

                tileToSend.getAttribute("color").then(function (color) {

                    storeTile(tileIndex, color);

                    //var row = Math.floor((Math.random() * 6) + 1) - 1;
                    //var col = Math.floor((Math.random() * 18) + 1) - 1;
                    var row = 2;
                    var col = 2;
                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    var tilesInHand = element.all(by.repeater("tileIndex in curPlayer"));
                    expect(tilesInHand.count()).toEqual(13);

                    //2. then replace to another position on board

                    // 2.1 pick this original tile
                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    // 2.2 replace to new empty position
                    clickBoardCellAndExpectTile(row + 1, col + 1, tileIndex);

                    var board = getDefaultBoard();
                    board[row + 1][col + 1] = tileIndex;

                    // no change at board[row][col]
                    expectBoardTile(row + 1, col + 1, tileIndex);

                    expectBoardTile(row, col, -1);

                });
            });
        });

        it("should ignore replacing to occupied position", function () {

            var index = Math.floor((Math.random() * 14) + 1) - 1;

            // 1.1 pick one tile to send
            var tileToSend = clickHandTile(index);

            tileToSend.getAttribute("tile-index").then(function (tileIndex) {

                tileToSend.getAttribute("color").then(function (color) {

                    storeTile(tileIndex, color);

                    //var row = Math.floor((Math.random() * 6) + 1) - 1;
                    //var col = Math.floor((Math.random() * 18) + 1) - 1;
                    var row = 2;
                    var col = 2;
                    // 1.2 pick one position to send to
                    clickBoardCellAndExpectTile(row, col, tileIndex);

                    //2. send another tile to board
                    var index2 = index;
                    while (index2 === index) {
                        index2 = Math.floor((Math.random() * 13) + 1) - 1;
                    }

                    var tileToSend2 = clickHandTile(index2);

                    tileToSend2.getAttribute("tile-index").then(function (tileIndex2) {

                        tileToSend2.getAttribute("color").then(function (color2) {
                            storeTile(tileIndex2, color2);
                            var row2 = 5;
                            var col2 = 5;

                            // 2.2 pick one position to send to
                            clickBoardCellAndExpectTile(row2, col2, tileIndex2);

                            // 3.1 pick this original tile
                            clickBoardCellAndExpectTile(row, col, tileIndex);

                            // 3.2 replace to occupied position
                            clickBoardCellAndExpectTile(row2, col2, tileIndex2);

                            var board = getDefaultBoard();
                            board[row][col] = tileIndex;
                            board[row2][col2] = tileIndex2;

                            // no change at board[row][col]
                            expectBoardTile(row, col, tileIndex);

                            expectBoardTile(row2, col2, tileIndex2);

                        });
                    });
                });
            });
        });

        iit("shold ignore picking empty board position to replace", function () {

            var index = Math.floor((Math.random() * 14) + 1) - 1;

            // 1. picking an empty position in board
            var row = 2;
            var col = 2;
            clickBoardCellAndExpectTile(row, col, -1);

            // 2. picking another empty position in board
            var row2 = 2;
            var col2 = 2;
            clickBoardCellAndExpectTile(row2, col2, -1);

            expectBoardTile(row, col, -1);

            expectBoardTile(row2, col2, -1);
            
        });

    });



});
