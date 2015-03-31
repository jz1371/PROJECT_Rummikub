/**
 * File: test/e2e/end_to_end_tests.js
 * -----------------------------------------------------------------------------
 * Usage: (assuming at the root of project)
 *
 *      $ sudo npm install
 *      $ sudo npm install -g grunt-cli
 *      $ ./node_modules/http-server/bin/http-server --cors -a localhost -p 1371
 *      $ ./node_modules/protractor/bin/webdriver-manager update
 *      $ ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update
 *      $ cd test
 *      $  ../node_modules/protractor/bin/protractor protractor.conf.js
 *
 * -----------------------------------------------------------------------------
 * @author: Jingxin Zhu
 * @date  : 2015.03.25
 */


//TODO: move helper functions to testHelper.js as a module
//var helper = require('../testHelper.js');

describe('myApp', function(){

    'use strict';

    var rowsInBoard = 6;
    var colsInRow = 18;

    beforeEach(function () {

        // !! assuming in the steps described in above 'Usage'
        // port 1371 is binded.
        var baseUrl = 'http://localhost:1371/app/';

        // uncomment below to test actual page
        //var baseUrl = 'http://jz1371.github.io/PROJECT_Rummikub/app/';

        var gameHtml = "game.html";
        browser.get(baseUrl + gameHtml);
    });

    /** ****************************************
     ***    operations on #board-panel       ***
     *******************************************/

    function getBoardDiv(row, col) {
        return element(by.id('e2e_test_board_div_' + row + 'x' + col));
    }

    function getBoardTile(row, col, tileIndex) {
        return element(by.id('e2e_test_board_tile_' + tileIndex + '_' + row + 'x' + col));
    }

    /**
     * Tile should be displayed if its tileIndex is not -1, otherwise should not.
     * @param row
     * @param col
     * @param tileIndex
     */
    function expectBoardTile(row, col, tileIndex) {
        expect(getBoardTile(row, col, tileIndex).isDisplayed()).toBe(tileIndex !== -1 ? true : false);
    }

    function expectBoard(board) {
        for(var i = 0; i < rowsInBoard; i++) {
            for (var j = 0; j < colsInRow; j++) {
                expectBoardTile(i, j, board[i][j]);
            }
        }
    }

    function clickBoardDivAndExpectTile(row, col, tileIndex) {
        getBoardDiv(row, col).click();
        expectBoardTile(row, col, tileIndex);
    }


    /** ****************************************
     ***  operations on #player-panel        ***
     *******************************************/

    function getHandDiv(index) {
        return element(by.id('e2e_test_hand_div_' + index));
    }

    function getHandTile(tileIndex) {
        return element(by.id('e2e_test_hand_tile_' + tileIndex));
    }

    /**
     * Clicks on the index-th tile in player's hand and get that tile
     *
     * @param index index of tile in player's hand (not the tileIndex of tile, tile at index=2 in hand may have tileIndex = 5)
     * @returns {*}
     */
    function clickHandTileAndGetTile(index) {
        getHandDiv(index).click();
        return element(by.id('e2e_test_hand_div_' + index)).element(by.css("div[id^=e2e_test_hand_tile_"));
    }

    function clickHandArea() {
        element(by.id('player-panel')).click();
    }

    /**
     * Expect or not tileIndex appears in player's hand.
     * @param tileIndex
     * @param expected true of false
     */
    function expectHandTile(tileIndex, expected) {
        expect(getHandTile(tileIndex).isPresent()).toBe(expected);
    }

    function clickHandAreaAndExpectTile(tileIndex) {
        // before click it is not in player's hand
        expectHandTile(tileIndex, false);
        element.all(by.repeater("tileIndex in curPlayer")).count().then(function(countBefore){

            clickHandArea();

            // after click, it shows in player's hand
            expectHandTile(tileIndex, true);

            var tilesInHandAfter = element.all(by.repeater("tileIndex in curPlayer"));

            // player's tiles add by one
            expect(tilesInHandAfter.count()).toEqual(countBefore + 1);

        });
    }

    /** ****************************************
     ***   operations on game buttons        ***
     *******************************************/
    /**
     *
     * @param btnId (currently, we have buttons with id = 'pickbtn', 'meldbtn'
     */
    function clickButtonById(btnId) {
        element(by.id(btnId)).click();
    }

    function expectTilesLeft(tilesLeft) {
        expect(element(by.id('tiles-left')).getText()).toEqual(tilesLeft);
    }


    /** ****************************************
     ** **         Tests start here        ** **
     *******************************************/

    /**
     * Suite to test setup condition
     */
    describe("[setup]", function () {

        it('should have a title', function () {
            expect(browser.getTitle()).toEqual('Rummikub');
        });

        it("should have an empty board", function(){
            var board = getEmptyBoard();
            expectBoard(board);
        });

    });

    /**
     * Suite to test 'send' move: send one tile from player's hand to board
     */
    describe("[send]", function(){

        it("[yes] send one tile to empty position on board ", function(){
            // 1. click one tile in hand
            var index = getRandomTileFromHand();
            var tileToSend = clickHandTileAndGetTile(index);
            tileToSend.getAttribute("id").then(function(id){
                var tileIndex = parseTileIndexFromId(id);

                // 2. click one empty position in board to send to
                var row = getRandom(rowsInBoard);
                var col = getRandom(colsInRow);

                // that tile should show on board
                clickBoardDivAndExpectTile(row, col, tileIndex);

                // that tile should leave from hand
                expectHandTile(tileIndex, false);

                // expect board
                var board = getEmptyBoard();
                board[row][col] = tileIndex;

                expectBoard(board);

            });
        });

        it("[ignored!] send tile to occupied position on board", function(){
            // 1. click one tile in hand
            var index = 1;
            var tileToSend = clickHandTileAndGetTile(index);
            tileToSend.getAttribute("id").then(function(id){
                var tileIndex = parseTileIndexFromId(id);

                // 2. click one empty position in board to send to
                var row = getRandom(rowsInBoard);
                var col = getRandom(colsInRow);

                // that tile should show on board
                clickBoardDivAndExpectTile(row, col, tileIndex);

                // that tile should leave from hand
                expectHandTile(tileIndex, false);

                // expect board
                var board = getEmptyBoard();
                board[row][col] = tileIndex;

                // 3. send another tile to the same position
                // since previous index1 was sent by previous move, the new index1 tile
                // will have different tileIndex with the one sent in last move.
                var index2 = 1;
                var tileToSend2 = clickHandTileAndGetTile(index2);
                tileToSend2.getAttribute('id').then(function(id2) {

                    var tileIndex2 = parseTileIndexFromId(id2);
                    // same position as previous send move
                    var row2 = row;
                    var col2 = col;

                    clickBoardDivAndExpectTile(row2, col2, tileIndex);

                    expectBoard(board);

                    // tileIndex2 still in player's hand
                    expectHandTile(tileIndex2, true);

                });

            });
        });

        it ('[ignored!] send nothing to board', function(){

            clickBoardDivAndExpectTile(0, 0, -1);

            // no tile should show there
            expectBoardTile(0, 0, -1);

        });
    });

    /**
     * Suite to test 'replace' move: replace one tile from one position in board to another position in board.
     */
    describe("[replace]", function () {

        it("[yes] replace one tile existed on board to one empty position in board", function(){
            // 1. send one tile to board (which will be moved later)
            var index = getRandomTileFromHand();
            var tileToSend = clickHandTileAndGetTile(index);
            tileToSend.getAttribute("id").then(function(id){

                var tileIndex = parseTileIndexFromId(id);

                // 2. click one empty position in board to send to
                var row = getRandom(rowsInBoard);
                var col = getRandom(colsInRow);

                clickBoardDivAndExpectTile(row, col, tileIndex);

                // 3. click on that tile
                clickBoardDivAndExpectTile(row, col, tileIndex);

                // 4. click one empty position in board
                var row2 = getAnotherRandom(row, rowsInBoard);
                var col2 = getAnotherRandom(col, colsInRow);

                // that tile should show in new position on board
                clickBoardDivAndExpectTile(row2, col2, tileIndex);


                // that tile should not on original position on board
                expectBoardTile(row, col, -1);

            });
        });

        it("[ignored] replace nothing to another postion in board", function(){
            // no tile at board[0][0]
            var row = 0;
            var col = 0;
            expectBoardTile(row, row, -1);

            clickBoardDivAndExpectTile(row, col, -1);

            // no tile at board[2][2], so it is a valid position to send for an existing tile
            expectBoardTile(2, 2, -1);

            // since no tile was at board[0][0], nothing was replaced to board[2][2]
            clickBoardDivAndExpectTile(2, 2, -1);

        });

        it("[ingored] replace to an occupied position", function(){
            // 1.1. send one tile to board (which will be moved later)
            var index = 4;
            var tileToSend = clickHandTileAndGetTile(index);
            tileToSend.getAttribute("id").then(function(id){
                var tileIndex = parseTileIndexFromId(id);
                // 1.2. click one empty position in board to send to
                var row = getRandom(rowsInBoard);
                var col = getRandom(colsInRow);
                clickBoardDivAndExpectTile(row, col, tileIndex);

                // 2. send another tile to board
                var index2 = 4;
                var tileToSend2 = clickHandTileAndGetTile(index2);
                tileToSend2.getAttribute('id').then(function(id2) {
                    var tileIndex2 = parseTileIndexFromId(id2);
                    var row2 = getAnotherRandom(row, rowsInBoard);
                    var col2 = getAnotherRandom(col, colsInRow);
                    clickBoardDivAndExpectTile(row2, col2, tileIndex2);

                    // 3. replace tileIndex1 to position where tileIndex2 occupies
                    clickBoardDivAndExpectTile(row, col, tileIndex);

                    clickBoardDivAndExpectTile(row2, col2, tileIndex2);

                    // both tiles are not moved
                    expectBoardTile(row, col, tileIndex);

                    expectBoardTile(row2, col2, tileIndex2);

                });

            });

        });
    });

    /**
     * Suite to test 'retrieve' move: retrieve one tile from board to player's hand
     */
    describe("[retrieve]", function () {

        it("[yes] retrieve one tile sent by player in this turn from board back to player ", function(){
            // 1. send one tile to board (which will be retrieved later)
            var index = getRandomTileFromHand();
            var tileToSend = clickHandTileAndGetTile(index);
            tileToSend.getAttribute("id").then(function(id){

                var tileIndex = parseTileIndexFromId(id);

                // 2. click one empty position in board to send to
                var row = getRandom(rowsInBoard);
                var col = getRandom(colsInRow);

                clickBoardDivAndExpectTile(row, col, tileIndex);

                // 3. click on that tile
                clickBoardDivAndExpectTile(row, col, tileIndex);

                // 4. click player area to retrieve
                clickHandAreaAndExpectTile(tileIndex);

                // that tile should not on board any more
                expectBoardTile(row, col, -1);

            });
        });

        it("[ignored] retrieve from empty position on board", function(){
            var row = 3;
            var col = 3;
            expectBoardTile(row, col, -1);  // no tile at board[3][3]

            clickHandArea();   // click hand area to retrieve

            expectBoardTile(row, col, -1);

            expectHandTile(-1, false);  // it is not in hand

        });
    });

    /**
     * Suite to test 'pick' button
     */
    describe("[pick]", function(){
        it ('[yes] player picks ont tile when no tiles sent to board by him in this turn', function(){

            expect(element(by.id('tiles-left')).getText()).toEqual('78');

            clickButtonById('pickbtn');

            expect(element(by.id('tiles-left')).getText()).toEqual('77');

            clickButtonById('pickbtn');

            expect(element(by.id('tiles-left')).getText()).toEqual('76');

        });

        it ('[no!] after sent one tile to board then cannot pick tile in this turn', function(){
            // 1. click one tile in hand
            var index = getRandomTileFromHand();
            var tileToSend = clickHandTileAndGetTile(index);
            tileToSend.getAttribute("id").then(function(id){
                var tileIndex = parseTileIndexFromId(id);

                // 2. click one empty position in board to send to
                var row = getRandom(rowsInBoard);
                var col = getRandom(colsInRow);

                // that tile should show on board
                clickBoardDivAndExpectTile(row, col, tileIndex);

                // that tile should leave from hand
                expectHandTile(tileIndex, false);

                // expect board
                var board = getEmptyBoard();
                board[row][col] = tileIndex;


                // before click pick button
                expectTilesLeft("78");

                clickButtonById("pickbtn");

                // not changed since pick should be ignored.
                expectTilesLeft("78");


            });

        });
    });

    /**
     * Suite to test ending scenarios
     */
    describe("[setmatch]", function () {

        /**
         * player0:  lastState -> sends tile52 -> currentState -> [click meld and win]
         */
        it('can start from a match that is about to end, and win', function(){

            // player0 is faced with lastState before he makes send move
            var lastState = getInitialState();
            var lastStateBoard = [
                // [tile0 - tile12] -> [blue1 - blue13]
                // [tile13,tile26] -> [blue1, red1]
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,-1,-1,-1,-1,-1], // 0
                [-1,-1,-1,13,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 1
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  // 5
            ];
            lastState.board = lastStateBoard;
            lastState.player0 = {initial: true, tiles: [52]};
            lastState.tilesSentToBoardThisTurn = [13,26];

            // player0 make a send move
            var playerIndex = 0;
            var currentStateBoard = setBoard( [{row: 1, col: 5, tileIndex: 52}], lastStateBoard);
            var sendMove = [
                {setTurn: {turnIndex: playerIndex}},
                {set: {key: 'type', value: "SEND"}},
                {set: {key: 'todelta', value: {tile: 52, row: 1, col: 5}}},
                {set: {key: 'player' + playerIndex, value: { initial: true, tiles: [] }}},
                {set: {key: 'tilesSentToBoardThisTurn', value: [13,26,52]}},
                {set: {key: 'board', value: currentStateBoard}},
                {setVisibility: {key: 'tile52', visibleToPlayerIndices: [1 - playerIndex]}}
            ];

            // get current state
            var setting = [
                {key: 'board', value: currentStateBoard},
                {key: 'player0', value: {initial: true, tiles: []}},
                {key: 'tilesSentToBoardThisTurn', value: [13,26,52]}
            ];
            var currentState = updateGameState(setting, lastState);

            // turnIndexBeforeMove               turnIndex
            //       |            \                 *
            //       +             \                |
            //   lastState  --> lastMove  -->  currentState
            var matchState = {
                turnIndexBeforeMove: 0,
                lastState: lastState,
                lastMove: sendMove,
                currentState: currentState,
                turnIndex: 0,
                endMatchScores: null,
                lastVisibleTo: {},
                currentVisibleTo: {}
            };

            setMatchState(matchState, 'passAndPlay');

            expectBoard(currentStateBoard);

            clickButtonById('meldbtn');   // player0 clicks the meld button and win!

            expectBoard(currentStateBoard);

        });

        it('cannot playe if it is not your turn', function(){
            // player0 is faced with lastState before he makes send move
            var lastState = getInitialState();
            var lastStateBoard = [
                // [tile0 - tile12] -> [blue1 - blue13]
                // [tile13,tile26] -> [blue1, red1]
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,-1,-1,-1,-1,-1], // 0
                [-1,-1,-1,13,26,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 1
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  // 5
            ];
            lastState.board = lastStateBoard;
            lastState.player0 = {initial: true, tiles: [52]};
            lastState.tilesSentToBoardThisTurn = [13,26];

            // player0 make a send move
            var playerIndex = 0;
            var currentStateBoard = setBoard( [{row: 1, col: 5, tileIndex: 52}], lastStateBoard);
            var sendMove = [
                {setTurn: {turnIndex: playerIndex}},
                {set: {key: 'type', value: "SEND"}},
                {set: {key: 'todelta', value: {tile: 52, row: 1, col: 5}}},
                {set: {key: 'player' + playerIndex, value: { initial: true, tiles: [] }}},
                {set: {key: 'tilesSentToBoardThisTurn', value: [13,26,52]}},
                {set: {key: 'board', value: currentStateBoard}},
                {setVisibility: {key: 'tile52', visibleToPlayerIndices: [1 - playerIndex]}}
            ];

            // get current state
            var setting = [
                {key: 'board', value: currentStateBoard},
                {key: 'player0', value: {initial: true, tiles: []}},
                {key: 'tilesSentToBoardThisTurn', value: [13,26,52]}
            ];
            var currentState = updateGameState(setting, lastState);

            // turnIndexBeforeMove               turnIndex
            //       |            \                 *
            //       +             \                |
            //   lastState  --> lastMove  -->  currentState
            var matchState = {
                turnIndexBeforeMove: 0,
                lastState: lastState,
                lastMove: sendMove,
                currentState: currentState,
                turnIndex: 0,
                endMatchScores: null,
                lastVisibleTo: {},
                currentVisibleTo: {}
            };

            setMatchState(matchState, 1);

            expectBoard(currentStateBoard);

            clickButtonById('pickbtn');  // player1 cannot pick since not his turn

            clickButtonById('meldbtn');   // player0 clicks the meld button and win!

            expectBoard(currentStateBoard);

        });

        /**
         * player0 lastState(endMatch) -> [click meld button] should be ignored
         */
        it('can start from a match that ended', function(){

            var lastState = getInitialState();
            var lastStateBoard = [
                // [tile0 - tile12] -> [blue1 - blue13]
                // [tile13,tile26,tile52] -> [blue1, red1, black1]
                //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
                [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,-1,-1,-1,-1,-1], // 0
                [-1,-1,-1,13,26,52,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 1
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  // 5
            ];
            lastState.board = lastStateBoard;
            lastState.player0 = {initial: true, tiles: []};
            lastState.tilesSentToBoardThisTurn = [13,26,52];

            // player0 make a meld move
            var playerIndex = 0;
            var lastMove = [
                {endMatch: {endMatchScores:[93, -93]}},
                {set: {key: 'type', value: "MELD"}},
                {set: {key: 'player' + playerIndex, value: {
                    initial  : true,
                    tiles    : []
                }}},
                {set: {key: 'tilesSentToBoardThisTurn', value: []}}
            ];

            var setting = [
                {key: 'tilesSentToBoardThisTurn', value: []}
            ];
            var currentState = updateGameState(setting, lastState);

            // turnIndexBeforeMove               turnIndex
            //       |            \                 *
            //       +             \                |
            //   lastState  --> lastMove  -->  currentState
            var matchState = {
                turnIndexBeforeMove: 0,
                turnIndex: -2,
                endMatchScores: [93, -93],
                lastState: lastState,
                lastMove: lastMove,
                currentState: currentState,
                lastVisibleTo: {},
                currentVisibleTo: {}
            };

            setMatchState(matchState, 'passAndPlay');


            clickButtonById('meldbtn');

            clickButtonById('pickbtn');

            expectBoard(lastStateBoard);

        });

    });



    /********************************************
     ** **           Helper Functions       ** **
     ********************************************/

    /**
     * set game state manually.
     * @param matchState
     * @param playMode playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
     * or a number representing the playerIndex (-2 for viewer, 0 for white player, 1 for black player, etc)
     */
    function setMatchState(matchState, playMode) {
        browser.executeScript(function(matchStateInJson, playMode) {
            var stateService = window.e2e_test_stateService;
            stateService.setMatchState(angular.fromJson(matchStateInJson));
            stateService.setPlayMode(angular.fromJson(playMode));
            angular.element(document).scope().$apply(); // to tell angular that things changes.
        }, JSON.stringify(matchState), JSON.stringify(playMode));
    }

    /**
     * deep clone one object without copying its reference. (similar to angular.copy)
     * @param obj
     * @returns {*}
     */
    function clone(obj) {
        if (null == obj || "object" !== typeof obj) {
            return obj;
        }
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    }

    /**
     * get one random tile from player's hand
     *
     *   e.g get the 1st, 2nd, 3rd, ... tile from hand
     *
     * @param length length of tiles in player's hand
     * @returns {number} index of tile in player's hand
     */
    function getRandomTileFromHand(length) {
        var len = length === undefined ? 14 : length;
        return Math.floor(Math.random() * len + 1) - 1;
    }

    /**
     * get a random number within boundary.
     * e.g. boundary = 5, a random number comes from [0, 4]
     *
     * @param boundary
     * @returns {number}
     */
    function getRandom(boundary) {
        return Math.floor(Math.random() * boundary + 1) - 1;
    }

    /**
     * get another random number other than given number within boundary.
     *
     * @param posToAvoid
     * @param boundary
     * @returns {*}
     */
    function getAnotherRandom(posToAvoid, boundary) {
        var  another = posToAvoid;
        while (another === posToAvoid) {
            another = getRandom(boundary);
        }
        return another;
    }

    /**
     * parse tileIndex from given div id,
     * return tileIndex for valid tile ([0,104]), return -1 otherwise.
     *
     * @param id
     * @returns {Number}
     */
    function parseTileIndexFromId(id) {
        var idPrefix = "e2e_test_hand_tile_";
        var tileIndex = parseInt(id.substring(idPrefix.length));
        return !isNaN(tileIndex) && tileIndex >= 0 && tileIndex < 105 ? tileIndex : -1;
    }


    /**
     * set the board based on given settings.
     *
     * @param tilesArray array of setting, each setting is {row: *, col: *, tileIndex: *}
     * @returns {*[]}
     */
    function setBoard(tilesArray, board) {
        var gameBoard = board !== undefined ? board : getEmptyBoard();
        var newBoard = [];
        for (var i = 0; i < rowsInBoard; i++) {
            newBoard.push([]);
            for (var j = 0; j < colsInRow; j++) {
                newBoard[i].push(gameBoard[i][j]);
            }
        }
        for (var ii = 0; ii < tilesArray.length; ii++) {
            var tile = tilesArray[ii];
            newBoard[tile.row][tile.col] = tile.tileIndex;
        }
        return newBoard;
    }

    /**
     * Return the state after finishing initial move, (tiles not shuffled)
     * @returns {{}}
     */
    function getInitialState() {
        var state = {};
        state.player0 =  {
            initial: false,
            tiles: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13]
        };
        state.player1 = {
            initial: false,
            tiles: [14,15,16,17,18,19,20,21,22,23,24,25,26,27]
        };
        state.board = getEmptyBoard();
        state.tilesSentToBoardThisTurn = [];
        state.nplayers = 2;
        state.nexttile = 28;

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

    /**
     * set match state based on given setting.
     *
     * @param setting array of setting operation, each operation is {key: *, value: *}
     * @param state state before setting
     * @returns {*} state after setting
     */
    function updateGameState(setting, stateBefore) {
        var state = stateBefore !== undefined ? clone(stateBefore) : getInitialState();
        for (var i = 0; i < setting.length; i++) {
            var key = setting[i].key;
            var value = setting[i].value;
            state[key] = value;
        }
        return state;
    }

    function getEmptyBoard () {
        var board = [
            //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 0
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 1
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 2
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 3
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], // 4
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  // 5
        ];
        return board;
    }


});
