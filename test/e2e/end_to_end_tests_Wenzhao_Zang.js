describe('myApp', function() {

    var rowsInBoard = 6;
    var colsInRow = 18;

    beforeEach(function () {
        var url  = "game.html";
        // Load the game page
        browser.get(url);
    });

    function getBoardDiv(row, col) {
        return element(by.id('e2e_test_board_div_' + row + 'x' + col));
    }

    function getTile(tileIndex) {
        return element(by.id('e2e_test_tile_' + tileIndex));
    }

    function setMatchState(matchState, playMode) {
        browser.executeScript(function(matchStateInJson, playMode) {
            var stateService = window.e2e_test_stateService;
            stateService.setMatchState(angular.fromJson(matchStateInJson));
            stateService.setPlayMode(angular.fromJson(playMode));
            angular.element(document).scope().$apply(); // to tell angular that things changes.
        }, JSON.stringify(matchState), JSON.stringify(playMode));
    }


    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Rummikub');
    });

    describe('[setup]', function() {

        it ('board should be empty', function() {
            // Find the element with id 'board' - this will
            // find the <div id="board">!</div> element.
            var board = element(by.id('board'));

            // Find all elements inside '#board' with ng-repeat matching 'row in [] | range: rows'' - this will
            // find the <div id='board'> <div ng-repeat="row in [] | range: rows'> 1 </div> </div>
            var rows = board.all(by.repeater('row in [] | range: rows'));
            expect(rows.count()).toEqual(9);

            for (var i = 0; i < 9; i++) {
                var firstRow = rows.get(i);
                var num = firstRow.all(by.repeater('col in [] | range: cols')).count();
                expect(num).toBe(10);
            }
        });

        it('test', function() {
            var tilesInHand = element.all(by.repeater("tileIndex in curPlayer"));
            //expect(tilesInHand.count()).toEqual(14);
            var pickBtn = element(by.id("pick"));
            // player0 picks one tile to his hand, then curPlayer changes to player1
            pickBtn.click();

            pickBtn.click();
            var afterTilesInHand = element.all(by.repeater('tileIndex in curPlayer'));
            expect(afterTilesInHand.count()).toEqual(15);


        });

    });
});
