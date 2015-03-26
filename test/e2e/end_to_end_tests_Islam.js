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
 *      // before below step, change the test target in 'spec' in test/protractor.conf.js file
 *      $  ../node_modules/protractor/bin/protractor protractor.conf.js
 *
 * -----------------------------------------------------------------------------
 * @author:
 * @date  : 2015.03.25
 */

describe('myApp', function(){

    'use strict';

    var rowsInBoard = 6;
    var colsInRow = 18;

    beforeEach(function () {
        // assuming in the steps described in above 'Usage'
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
     ** **         Tests start here        ** **
     *******************************************/

    /**
     * Suite to test setup condition
     */
    describe("[setup]", function () {
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

        it("[no!]", function(){

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

        it("[no!]", function(){

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

        it("[no!]", function(){

        });
    });


    /********************************************
     ** **           Helper Functions       ** **
     ********************************************/

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


    function getRandom(boundary) {
        return Math.floor(Math.random() * boundary + 1) - 1;
    }

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
     * initially each position is occupied by -1,
     * which indicates no tile is placed there.
     * @returns {*[]}
     */
    function getEmptyBoard () {
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


});
