'use strict';

// Declare app level module which depends on filters, and services
//var myApp = angular.module('myApp', [
//    'ngAnimate',
//    'ngTouch',
//  'ngRoute',
//    'ui.bootstrap'
//  //'myApp.filters.filters',
//  //'myApp.services.gameLogicService',
//  //  'myApp.controllers.gameCtrl',
//  //  'myApp.controllers.gameAlertCtrl',
//  //'myApp.directives'
//]).
//config(['$routeProvider', function($routeProvider) {
//  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
//  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
//  $routeProvider.otherwise({redirectTo: '/view2'});
//}]);

angular.module('myApp',['ngTouch', 'ui.bootstrap']);
;angular.module('myApp').controller('ModalDemoCtrl', ['$scope','$modal','$log',function ($scope, $modal, $log) {

    'use strict';

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'help.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('myApp').controller('ModalInstanceCtrl',['$scope','$modalInstance','items', function ($scope, $modalInstance, items) {

    'use strict';
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

angular.module('myApp').controller('CarouselDemoCtrl',['$scope', function ($scope) {
    'use strict';
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/300',
            text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    for (var i=0; i<4; i++) {
        $scope.addSlide();
    }
    slides.push({
        image: 'img/joker-red.png',
        text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
}]);
;/**
 * File: app/js/controllers/gameCtrl.js
 * ------------------------------------
 * @author: Jingxin Zhu
 * @date:   2015.03.10
 * ------------------------------------
 */

(function() {

    'use strict';

    /**
     **************************************************************************************
     * I. Elements in $scope
     *
     **************************************************************************************
     */
    angular.module('myApp').controller('GameCtrl',
    ['$scope', '$log', '$window', '$animate', '$timeout', 'stateService', 'gameService', 'gameLogicService',
    function($scope, $log, $window,  $animate, $timeout, stateService ,gameService, gameLogicService ) {

        var allowDragAndDrop = true;

        // to allow manipulating game state in e2e tests
        window.e2e_test_stateService = stateService;


        var debugMode = true;
        var gameEnd = false;

        var gameBoardRows = 6;
        var gameBoardCols = 18;

        $scope.rows = 6;
        $scope.cols = 18;

        var animationEnded = false;
        //var canMakeMove = false;
        var isComputerTurn = false;
        //var state = null;
        var turnIndex = null;

        var draggingLines = document.getElementById("draggingLines");
        var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
        var verticalDraggingLine = document.getElementById("verticalDraggingLine");

        var myDrag = document.getElementById("MyDrag");

        var gameArea = document.getElementById("gameArea");
        var draggingStartedRowCol = null; // The {row: YY, col: XX} where dragging started.
        var draggingPiece = null;
        var nextZIndex = 200;

        var boardPanel = document.getElementById("board-panel");
        var handPanel = document.getElementById("hand-panel");
        var hand = document.getElementById("hand-ul");

        function isWithinElement(x, y, element) {
            var offset = element.getBoundingClientRect();
            return x >= offset.left && x < offset.right &&
                y >= offset.top && y <= offset.bottom;
        }

        function handleDragEvent(type, clientX, clientY) {
            if (!$scope.isYourTurn) {
                return;
            }

            if (!isWithinElement(clientX, clientY, gameArea)) {
                if (debugMode) {
                    draggingLines.style.display = "none";
                }
                return;
            } else {
                var pos = getDraggingTilePosition(clientX, clientY);
                if (type === "touchstart" ) {
                    // drag started
                    if (pos &&  $scope.board[pos.row][pos.col] !== -1) {
                        // starting from game board or player hand and is a valid tile
                        var row = pos.row;
                        var col = pos.col;
                        draggingStartedRowCol = {row: row, col: col};
                        draggingPiece = document.getElementById("MyPiece" + draggingStartedRowCol.row + "x" + draggingStartedRowCol.col);
                        if (draggingPiece) {
                            draggingPiece.style['z-index'] = ++nextZIndex;
                        }
                    }
                }
                if (!draggingPiece) {
                    return;
                }
                if (type === "touchend") {
                    // drag end
                    if (pos) {
                        var from = draggingStartedRowCol;
                        var to = {row: pos.row, col: pos.col};
                        dragDone(from, to);
                    }
                } else {
                    // Drag continue
                    if (pos) {
                        var container = getTileContainerSize(pos);
                        $scope.$apply(function () {
                            var tileIndex = $scope.board[draggingStartedRowCol.row][draggingStartedRowCol.col];
                            var tile = $scope.state['tile' + tileIndex];
                            $scope.tileIndex = tileIndex;
                            $scope.drag_color = tile.color;
                            $scope.drag_score = tile.score;
                            $scope.tile = tile;
                        });

                        //gameAreaLeft = document.getElementById("board").offsetLeft;

                        draggingLines.style.display = "inline";
                        myDrag.style.display = "inline";
                        myDrag.style.width = container.width + "px";

                        var gameAreaLeft = container.left - gameArea.offsetLeft;
                        myDrag.style.left = gameAreaLeft + "px";
                        //console.log("drag left: " + myDrag.style.left);
                        //console.log("game left: " + gameAreaLeft);
                        myDrag.style.paddingBottom= container.height + "px";
                        myDrag.style.top = container.top + "px";

                        var centerXY = {x: container.width / 2 + gameAreaLeft - 15, y: container.top + container.height / 2};
                        //console.log("center: " + "here" );
                        setDraggingLines(centerXY);

                    }
                }
            }

            if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
                draggingLines.style.display = "none";
                myDrag.style.display = "none";

                draggingStartedRowCol = null;
                draggingPiece = null;
            }
        }

        function getTileContainerSize(pos) {
            if (pos) {
                var row = pos.row;
                var col = pos.col;
                if ( row >= 0 && row < gameBoardRows ||        // from game baord
                    row === gameBoardRows + $scope.turnIndex &&   // from player's hand
                    col >= 0 && col < $scope.board[row].length )
                {
                    var container = document.getElementById("MyPiece" + row + "x" + col).parentElement.getBoundingClientRect();
                    return container;
                } else {
                    return undefined;
                }

            } else {
                return undefined;
            }

        }

        function setDraggingLines(centerXY) {
            if (centerXY !== undefined) {
                verticalDraggingLine.setAttribute("x1", centerXY.x);
                verticalDraggingLine.setAttribute("x2", centerXY.x);
                horizontalDraggingLine.setAttribute("y1", centerXY.y);
                horizontalDraggingLine.setAttribute("y2", centerXY.y);
            }
        }

        /**
         *
         * @param clientX the absolute x position in window
         * @param clientY the absolute y position in window
         * @returns {{row: number, col: number}}
         */
        function getDraggingTilePosition(clientX, clientY) {

            //if (isWithinElement(clientX, clientY, boardPanel)) {
            //    $log.info("board");
            //} else if (isWithinElement(clientX, clientY, handPanel)) {
            //    // clicking tile in hand
            //    var leftEdge = document.getElementById("hand").getBoundingClientRect().left;
            //    $log.info("hand left: " + leftEdge);
            //}

            var x = clientX - boardPanel.parentElement.offsetLeft;
            var y = clientY - boardPanel.offsetTop;
            var row = -1;
            var col = -1;
            if (x > 0 && y > 0 && x < boardPanel.clientWidth && y < boardPanel.clientHeight) {
                // dragging in board panel
                //$log.info("width: " + boardPanel.clientWidth);
                //$log.info("x: " + x);
                row = Math.floor(gameBoardRows * y / boardPanel.clientHeight);
                col = Math.floor(gameBoardCols * x / boardPanel.clientWidth);
                $log.info("row: " + row);
                $log.info("col: " + col);
            } else {
                var windowOffset = handPanel.getBoundingClientRect();
                x = clientX - windowOffset.left;
                y = clientY - windowOffset.top;
                if (x > 0 && y > 0 && x < handPanel.clientWidth && y < handPanel.clientHeight) {
                    //row = gameBoardRows + $scope.turnIndex +  Math.floor(gameBoardRows * y / handPanel.clientHeight);
                    row = gameBoardRows + $scope.turnIndex;
                    col = Math.floor($scope.board[row].length * x / handPanel.clientWidth);
                    $log.info("row: " + row);
                    $log.info("col: " + col);
                }
            }
            return row !== -1 ? {row: row, col: col} : null ;
        }

        function dragDone(from, to) {
            $scope.$apply(function () {
                try {
                    $scope.boardCellClicked(from.row, from.col);
                    $scope.boardCellClicked(to.row, to.col);
                    var msg = "Dragged to " + to.row + "x" + to.col;
                    $log.info(msg);
                    $scope.msg = msg;
                }catch(e) {
                    // illegal move, restore
                    $log.info(e.message);
                    /* return immediately! */
                    $scope.debug = e.message;
                    return;
                }
            });
        }

        function sendComputerMove() {
            //gameService.makeMove(gameLogicService.getPossibleMoves($scope.state, $scope.turnIndex)[0]);

            gameService.makeMove(gameLogicService.createPickMove($scope.turnIndex, $scope.state));

            //var items = gameLogicService.getPossibleMoves($scope.state, $scope.turnIndex);
            //gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
            //$scope.debug = "computer picks one tile";
            //$scope.turnInfo = "Your turn";
        }

        $scope.shouldSlowlyAppear = function () {
            return $scope.activeTile !== undefined;
        };

        /**
         *
         * @param params (object) {yourPlayerIndex: (int),
         *                         stateAfterMove: *,
         *                         turnIndexAfterMove: *,
         *                         playersInfo: [{playerId: (int)},{}]}
         */
        function updateUI(params) {

            animationEnded = false;

            // initialize move
            //if (isEmptyObj(params.stateAfterMove)) {
            if (isEmptyObj(params.stateAfterMove) && !params.stateBeforeMove &&
                params.turnIndexBeforeMove ===0 &&  params.turnIndexAfterMove === 0) {
                var playerIndex = 0;
                var nPlayers = 2;
                //var nPlayers = params.playersInfo.length;
                try {
                    var move = gameLogicService.createInitialMove(playerIndex, nPlayers);
                    /* let player0 initializes the game. */
                    params.yourPlayerIndex = 0;
                    gameService.makeMove(move);
                } catch (e) {
                    $log.info(e.message);
                }
                return;
            }

            $scope.isYourTurn = params.turnIndexAfterMove >=0 &&          // -1 means game end, -2 means game viewer
            params.yourPlayerIndex === params.turnIndexAfterMove;     // it's my turn
            turnIndex = params.turnIndexAfterMove;

            gameEnd = params.turnindexAfterMove === -1;
            $scope.yourPlayerIndex = params.yourPlayerIndex;
            $scope.turnIndex = params.turnIndexAfterMove;
            $scope.state = params.stateAfterMove;
            $scope.board = params.stateAfterMove.board;
            $scope.nexttile = params.stateAfterMove.trace.nexttile;
            $scope.playerHand = $scope.board[$scope.rows + $scope.turnIndex];

            // disable sort feature when empty slots left in board
            // because sort will reset player hand
            $scope.sortDisabled = false;
            for (var i = 0; i < $scope.playerHand.length; i++) {
                if ($scope.playerHand[i] === -1) {
                    $scope.sortDisabled = true;
                    break;
                }
            }

            if ($scope.isYourTurn) {
                //var opponentIndex = 1 - $scope.turnIndex;
                //$scope.opponent_top = params.stateAfterMove["player" + opponentIndex].tiles;
                //$scope.curPlayer = params.stateAfterMove["player" + $scope.turnIndex].tiles;
            }

            // Is it the computer's turn?
            isComputerTurn = $scope.isYourTurn &&
            params.playersInfo[params.yourPlayerIndex].playerId  === '';
            if(isComputerTurn) {
                $scope.isYourTurn = false; // to make sure the UI won't send another move.
                // Waiting 0.5 seconds to let the move animation finish; if we call aiService
                // then the animation is paused until the javascript finishes.
                $timeout(sendComputerMove, 500);
                $scope.debug = "Computer makes pick move";
            }

        }

        $scope.boardCellClicked = function(row, col) {
            $log.info(["Clicked on cell:", row, col]);
            $scope.debug = "click board cell: (" + row + "," + col + ")";
            if ( $scope.isYourTurn === false ) {
                return;
            }
            if (row === -1 || col === -1) {
                return;
            }
            try {
                if ($scope.activeTile === undefined) {
                    // no tile has been activated
                    if ($scope.board[row][col] !== -1) {
                        // clicking a tile to activate it
                        $scope.activeTile = $scope.board[row][col];
                        $scope.from = {row: row, col: col};
                        $scope.debug = "picking Tile" + $scope.activeTile + " (" +
                        getTileByIndex($scope.activeTile).color +
                        "," + getTileByIndex($scope.activeTile).score +
                        " from: (" + row + "," + col + ")";
                    }
                } else {
                    $scope.debug = "row: " + row + " col: " + col + " here: " + $scope.board[row][col];
                    // some tile has been activated before clicking
                    if ($scope.board[row][col] === -1) {
                        // clicking an empty position to send tile to
                        $scope.to = {row: row, col: col};
                        var delta = {tileIndex: $scope.activeTile, from: $scope.from, to: $scope.to};
                        $scope.debug = "index: " + delta.tileIndex;
                        var move = gameLogicService.createMoveMove($scope.turnIndex, $scope.state, delta);
                        gameService.makeMove(move);
                    }
                    clearActiveTile();
                }
                // In case the board is not updated
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            } catch (e) {
                clearActiveTile();
                $scope.debug = e.message;
                $log.info(e);
                return false;
            }
        };

        /**
         * click current player area to retrieve tile from board back to hand
         */
        $scope.curPlayerAreaClicked = function() {
            if (!$scope.isYourTurn) {
                return;
            }
            if ($scope.activeTile !== undefined &&
                $scope.from !== undefined &&
                $scope.from.row >= 0 && $scope.from.row < $scope.rows) {

                // if one tile inside board is activated then we are expecting a 'retrieve' move
                var from = $scope.from;
                try {
                    var to = {row: $scope.rows + $scope.turnIndex, col: findFirstEmptyColumnInHand($scope.playerHand)};
                    var delta = {tileIndex: $scope.activeTile, from: from, to: to};
                    var move = gameLogicService.createMoveMove($scope.turnIndex, $scope.state, delta);
                    gameService.makeMove(move);
                } catch (e) {
                    $scope.debug = e.message;
                }
                clearActiveTile();
            }
        };

        function findFirstEmptyColumnInHand(playerHand) {
            for (var i = 0; i < playerHand.length; i++) {
                if (playerHand[i] === -1) {
                    return i;
                }
            }
            return -1;
        }

        $scope.shouldShowTileOnBoard = function (row, col) {
            // -1 stands for empty position on board
            return $scope.board !== undefined && $scope.board[row][col] !== -1;
        };

        $scope.notJoker = function (tileIndex) {
            var tile = getTileByIndex(tileIndex);
            return tile !== undefined && tile.color !== 'joker';
        };

        $scope.isJoker = function(tileIndex) {
            var tile = getTileByIndex(tileIndex);
            return tile !== undefined && tile.color === 'joker';
        };

        $scope.getTileColor = function(tileIndex) {
            var tile = getTileByIndex(tileIndex);
            return tile !== undefined ? tile.color : "";
        };

        $scope.getTileScore = function(tileIndex) {
            var tile = getTileByIndex(tileIndex);
            return tile !== undefined ? tile.score : "";
        };


        /** ****************************************
         *********      Button Controls    *********
         *******************************************/
        $scope.pickBtnClicked = function() {
            if ($scope.isYourTurn) {
                try {
                    var move = gameLogicService.createPickMove($scope.turnIndex, $scope.state);
                    gameService.makeMove(move);
                    // reset sort
                    $scope.sortType = "sort";
                    $scope.debug = "pick one tile";
                } catch (e) {
                    $scope.debug = e.message;
                }
            }
        };

        $scope.meldBtnClicked = function() {
            if ($scope.isYourTurn) {
                try {
                    var move = gameLogicService.createMeldMove($scope.turnIndex, $scope.state);
                    gameService.makeMove(move);
                    // reset sort
                    $scope.sortType = "sort";
                } catch (e) {
                    $scope.debug = e.message;
                }
            }
        };

        $scope.undoBtnClicked = function () {
            if ($scope.isYourTurn) {
                try {
                    var undo = gameLogicService.createSingleUndoMove($scope.turnIndex, $scope.state);
                    gameService.makeMove(undo);
                    //var deltas = $scope.state.deltas;
                    //var length = deltas.length;
                    //for (var i = length - 1; i >= 0; i--) {
                    //    var undo = gameLogicService.createSingleUndoMove($scope.turnIndex, $scope.state);
                    //    gameService.makeMove(undo);
                    //    // disable sort function during undo process
                    //    $scope.sortDisabled= true;
                    //}
                    $scope.sortType = "sort";
                } catch (e) {
                }
            }
        };

        $scope.undoAllBtnClicked = function () {
            if ($scope.isYourTurn) {
                try {
                    //var undos = gameLogicService.createUndoAllMove($scope.turnIndex, $scope.state);
                    //gameService.makeMove(undos);
                    //$scope.sortType = "sort";
                } catch (e) {
                }
            }
        };

        $scope.sortType = "sort";
        $scope.setSortTypeBtnClicked = function () {
            if (gameEnd) {
                return;
            }
            var type = $scope.sortType;
            var playerRow = getCurrentPlayerRow();
            var playerHand = $scope.board[playerRow];
            var nextType;
            try {
                switch (type) {
                    case "set":
                        nextType = "123";
                        break;
                    case "sort":
                    case "123":
                        type = "score";
                        nextType = "color";
                        break;
                    case "color":
                        nextType = "set";
                        break;
                    default:
                        nextType = "123";
                }
                var move = gameLogicService.createSortMove($scope.turnIndex, $scope.state, type);
                gameService.makeMove(move);
                $scope.sortType = nextType;
            } catch (e) {
                $log.info(e);
            }
        };

        $scope.getTileDataValue = function(tileIndex) {
            var dataValue = "";
            var tile = getTileByIndex(tileIndex);
            if ( tile !== undefined) {
                dataValue = tile.color + " " + tile.score;
            }
            return dataValue;
        };

        $scope.canDrag = function (tileIndex) {
            return !!($scope.isYourTurn && getTileByIndex(tileIndex) !== undefined);
        };


        //TODO:
        //function sortTiles() {
        //}

        /* ================= Helper Functions =================== */
        function isEmptyObj(obj) {

            // null and undefined are "empty"
            if (obj === null) {
                return true;
            }

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    {
                return false;
            }
            if (obj.length === 0)  {
                return true;
            }

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Returns tile object if tileIndex is valid and tile exists.
         * @param tileIndex
         * @returns {*} {score: int, color: string}
         */
        function getTileByIndex(tileIndex) {
            // In case the board is not updated
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            if (tileIndex !== undefined && $scope.state['tile' + tileIndex] !== undefined) {
                return $scope.state['tile' + tileIndex];
            }
            return undefined;
        }

        $scope.getTileByIndex = getTileByIndex;

        function clearActiveTile() {
            $scope.activeTile = undefined;
            $scope.activeOrigin = undefined;
            $scope.from = undefined;
            $scope.to = undefined;
        }

        //$scope.start = 0;
        //$scope.getRangeNumber = function(from) {
        //
        //    if (!$scope.$$phase) {
        //        $scope.$apply();
        //    }
        //
        //    var result = [];
        //    var start = from >= 0 ? from : 0;
        //    for (var i = start; i < 14; i++) {
        //        result.push(i);
        //    }
        //    return result;
        //};

        //$scope.tileRange = [0,1,2,3,4,5,6];
        //var range = 6;
        //
        //$scope.previous = function() {
        //    var start = $scope.tileRange[0] - range;
        //    if (start >= 0) {
        //        var result = [];
        //        for (var i = 0; i < range; i++) {
        //            result.push(start + i);
        //        }
        //        $scope.tileRange = result;
        //    }
        //};
        //$scope.nextPage = function() {
        //    if ($scope.tileRange.length < range) {
        //        //  no more tiles to show
        //        return;
        //    }
        //    var start = $scope.tileRange[0] + range;
        //    var result = [];
        //    for (var i = 0; i < range; i++) {
        //        if ((start + i) >= $scope.board[6 + $scope.turnIndex].length) {
        //            break;
        //        }
        //        result.push(start + i);
        //    }
        //    $scope.tileRange = result;
        //};

        $scope.getHandTilesRange = function() {
            if ($scope.board === undefined) {
                return [];
            }
            var len = $scope.board[6 + $scope.turnIndex].length;
            var result = [];
            for (var i = 0; i < len; i++) {
                result.push(i);
            }
            return result;
        };


        function getCurrentPlayerRow () {
            return gameBoardRows + $scope.turnIndex;
        }

        // to allow drag-n-drop move
        if (allowDragAndDrop) {
            window.handleDragEvent = handleDragEvent;
        }

        gameService.setGame( {
            gameDeveloperEmail: "jz1371@nyu.edu",
            minNumberOfPlayers: 2,
            //maxNumberOfPlayers: 4, // if bug in stateService fixed
            maxNumberOfPlayers: 2,
            isMoveOk: gameLogicService.isMoveOk,
            updateUI: updateUI
        });

    }]);
}());
;/**
 * File: app/js/filters/filters.js
 * ----------------------------------------
 * provide range filter for ng-repeat
 *
 * usage (repeat 3 times) :
 *
 *      ng-repeat="i in [] | range: 3"
 *
 * ----------------------------------------
 * @author: Jingxin Zhu
 * @date:   2015.03.15
 *
 */
(function(){

    'use strict';

    angular.module('myApp').filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i=0; i<total; i++) {
                input.push(i);
            }
            return input;
        };
    });

}());

;/**
 * File: gameLogicService.js
 * ----------------------------------------------------------
 * Game logic for Rummikub game.
 *
 * @author: Jingxin Zhu
 * @date  : 2015.02.14
 * ----------------------------------------------------------
 */

(function () {

    'use strict';

    /**
     **************************************************************************************
     *
     * I. Elements in game state.
     *
     * 1. board: 2D array.
     *      Each element is tileIndex ([0, 105]), -1 means no tile at that position. 
     *      1.1  game board   (6 x 18)
     *      1.2  player board (nplayers x tiles in each player's hand)
     *     
     *      e.g. 2-players initial scenario:
     *      row 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17  col
     *      [ [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  0  ----------
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  1      |
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  2  game board    
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  3      |
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  4      |
     *        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]  5  -----------   
     *        [ 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13],                6 // 1st player's hand     
     *        [14,15,16,17,18,19,20,21,22,23,24,25,26]              ]  7 // 2nd player's hand 
     *
     * 2. deltas: 1D array, recording the move history in current turn.
     *      Each element is like: {tileIndex:*, from: {row: * ,col: * }, to: {row: * ,col: *} }
     *
     * 3. type:  'INIT' / "MOVE" / "PICK" / "MELD" / "UNDO"
     * 
     * 4. trace: {nplayers: , intial: [], nexttile:  * }
     *
     * 5. tiles: array of tile, each tile is {tileIndex: {score: , color: }}
     * 
     *---------------------------------------------------------------------------------- 
     *
     * II Moves in game process.
     *  
     *  0 - setTurn : {setTurn : {turnIndex: 0}},
     *  0 - endMatch: {endMatch: {endMatchScores: [90, -90]}}
     *  1 - setType : {set: {key: 'type', value: "PICK"}}
     *  2 - setBoard: {set: {key: 'board', value: [[..]]}}
     *  3 - setDelta: {set: {key: 'deltas', value: [...]}}
     *  4 - setTrace: {set: {key: 'trace', value: {}}
     * *5 - setVisibility: {setVisibility: {key: 'tile28', visibleToPlayerIndices: [1]}},
     *  
     *
     * II. Operations: the operation player chooses for current move.
     *
     *    "PICK", pick one tile from tile pool. // will ends current turn and shifts to next player
     *
     *    "MELD", make valid groups to meld.    // will ends turn and shifts to next players
     *      | --- "SEND"    , send one tile from player to board.
     *      | --- "RETRIEVE", retrieve one tile (sent to board in current turn) from board back to player.
     *      | --- "REPLACE" , replace one tile in board to another position in board.
     *
     *    "UNDO", undo last move in all moves in this turn.
     *
     *
     **************************************************************************************
     */
    angular.module('myApp').factory('gameLogicService', function() {

        /**
         * Checks whether given move is Ok or not.
         *
         * @param param (object) {turnIndexBeforeMove:(int), stateBeforeMove: (object), move:[]}
         * @returns {boolean}
         */
        function isMoveOk(param) {
            var playerIndex = param.turnIndexBeforeMove;
            var stateBefore = param.stateBeforeMove;
            var actualMove  = param.move;
            try {
                var expectedMove = createMove(stateBefore, playerIndex, actualMove);
                if (!angular.equals(actualMove, expectedMove)) {
                    return false;
                }
            } catch (e) {
                console.log(e.stack);
                return false;
            }
            return true;
        }

        function createMove(stateBefore, playerIndex, actualMove) {
            var moveType = actualMove[1].set.value;
            if (moveType !== "INIT") {
                check( !isGameOver(stateBefore),
                    "Game is over, you cannot move any move"
                );
            }
            var expectedMove;
            switch (moveType) {
                case "INIT":
                    var nPlayers = actualMove[2].set.value.nplayers;
                    expectedMove = getInitialMove(playerIndex, nPlayers);
                    break;
                case "MOVE":
                    var deltas = actualMove[3].set.value;
                    var delta = deltas[deltas.length - 1];
                    expectedMove = getMoveMove(playerIndex, stateBefore, delta);
                    break;
                case "PICK":
                    expectedMove = getPickMove(playerIndex, stateBefore);
                    break;
                case "MELD":
                    expectedMove = getMeldMove(playerIndex, stateBefore);
                    break;
                case "SORT":
                    var sortType = actualMove[2].set.value;
                    expectedMove = getSortMove(playerIndex, stateBefore, sortType);
                    break;
                case "UNDO":
                    expectedMove = getSingleUndoMove(playerIndex, stateBefore);
                    break;
                case "UNDOALL":
                    expectedMove = getUndoAllMove(playerIndex, stateBefore);
                    break;
                default:
                    throw new Error("Unexpected move");
            }
            return expectedMove;
        }

        /**
         * Creates the initial move.
         *
         * @param playerIndex (int) index of player who is playing.
         * @param nPlayers (int) number of players in current game.
         * @returns {*[]} array of operations in initial move.
         */
        function getInitialMove(playerIndex, nPlayers) {
            // 1. make sure player0 is initializing the game.
            check(playerIndex === 0,
                "INIT: player" + playerIndex + " is trying to move, but only player0 can play the initial move."
            );

            // 2. make sure 2 - 4 players are playing the game.
            check(nPlayers <= 4 && nPlayers >= 0,
                "INIT: nPlayers = " + nPlayers + " is given, but only 2 - 4 players are allowed."
            );

            // whether player has made initial meld
            var initial = [];
            for (var i = 0; i < nPlayers; i++) {
                initial.push(false);
            }

            // 3. construct the move
            var nTilesPerPlayerInitially = 14;
            var move = [
                {setTurn: {turnIndex: 0}},
                {set: {key: 'type', value: "INIT"}},
                {set: {key: 'trace', value: {nplayers: nPlayers, initial: initial, nexttile: nPlayers * 14}}},
                {set: {key: 'board', value: getInitialBoard(nPlayers)}},
                {set: {key: 'deltas', value: []}}
            ];

            // 3.1. initialize game tiles and shuffle keys
            var tiles = [];
            var shuffleKeys = [];
            for (var tileIndex = 0; tileIndex< 106; tileIndex++) {
                tiles[tileIndex] = {set: {key: "tile" + tileIndex, value: getTileByIndex(tileIndex)}};
                shuffleKeys[tileIndex] = 'tile' + tileIndex;
            }

            // 3.3. initialize tile visibility
            var visibility = [];
            for (var ii = 0; ii < nPlayers; ii++) {
                for (var jj = 0; jj < nTilesPerPlayerInitially; jj++) {
                    // each player can see 14 tiles initially
                    tileIndex = ii * nTilesPerPlayerInitially + jj;
                    visibility[tileIndex] = {setVisibility: {key: 'tile' + tileIndex, visibleToPlayerIndices: [ii]}};
                }
            }

            move = move.concat(tiles);
            move.push({shuffle: {keys: shuffleKeys}});
            move = move.concat(visibility);
            return move;
        }

        /**
         *
         * @param playerIndex
         * @param stateBefore
         * @param delta
         * @returns {*[]}
         */
        function getMoveMove(playerIndex, stateBefore, delta, undo) {
            var tileToMove = delta.tileIndex;
            var from = delta.from;
            var to = delta.to;

            // 1. get game board
            var board = stateBefore.board;
            var deltas = stateBefore.deltas;

            var playerRow = getPlayerRow(playerIndex);

            // 2.1 check from's position is within board, not empty and consistent as declared in delta
            checkPositionWithinBoard(board, from.row, from.col);

            check(board[from.row][from.col] === tileToMove,
                "[MOVE] tile" + tileToMove + " is not at board[" + from.row + "][" + from.col + "]");

            check(tileToMove !== -1,
                "[MOVE] no tile at board[" + from.row + "][" + from.col + "]" );

            // 2.2 check to's position is within board and is empty
            checkPositionWithinBoard(board, to.row, to.col);

            check(board[to.row][to.col] === -1,
                "[MOVE] board[" + to.row + "][" + to.col + "] has been occupied by tile" + board[to.row][to.col] );

            // 2.3 player cannot move one tile from other player's hand
            check( from.row >=0 && from.row < getGameBoardRows() ||   // from game board
                from.row === playerRow,
                "[MOVE] you cannot move tiles from other player's hand" );

            // 2.4 player cannot move one tile to other player's hand
            check( to.row >=0 && to.row < getGameBoardRows() ||     // to game board
                to.row ===  playerRow,
                "[MOVE] you cannot move tiles to other player's hand" );

            // 3. player can only move his own tile if has not finished initial meld
            if (stateBefore.trace.initial[playerIndex] === false) {
                // if player has not yet finished initial meld, he can only move from his hand
                check(from.row === playerRow || isTileSentToBoardInCurrentTurnByPlayer(tileToMove, playerIndex, deltas),
                    "[MOVE] cannot move other player's tiles on board, since you have not finished initial meld" );
            }

            // null means every player can see
            var visibility = null;

            // 4. can only send tile which was sent to game board in current turn
            // back to player hand
            if (to.row === playerRow) {
                check( from.row === playerRow  ||   // move tiles in hand
                    isTileSentToBoardInCurrentTurnByPlayer(tileToMove, playerIndex, deltas), // retrieve own tile from board
                "[MOVE] cannot retrieve tile" + tileToMove+ " back to hand because" +
                    "it is not sent by board by you in current turn" );
                // after back to hand, only player himself can see that tile
                visibility = [playerIndex];
            }

            // 5. construct move operations.
            var boardAfter = angular.copy(board);
            boardAfter[from.row][from.col] = -1;
            boardAfter[to.row][to.col] = tileToMove;

            var deltasAfter = angular.copy(deltas);
            var moveTypeAfter = "MOVE";
            if (undo !== undefined && undo === true) {
                deltasAfter.splice(deltasAfter.length - 1, 1);
                moveTypeAfter = "UNDO";
            } else {
                deltasAfter.push(delta);
            }

            return [
                {setTurn: {turnIndex: playerIndex}},        // this move will not change turnIndex
                {set: {key: 'type', value: moveTypeAfter}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'deltas', value: deltasAfter}},
                {setVisibility: {key: 'tile' + tileToMove, visibleToPlayerIndices: visibility}}
            ];
        }

        /**
         *
         * @param playerIndex
         * @param stateBefore
         * @returns {*[]}
         */
        function getPickMove(playerIndex, stateBefore) {

            var playerRow = getGameBoardRows() + playerIndex;

            // 1. make sure player did not sent any tile to board during this turn.
            var tilesSentToBoardThisTurn = getTilesSentToBoardThisTurn(stateBefore.deltas, playerRow);
            check(tilesSentToBoardThisTurn.length === 0,
                "[PICK] you cannot pick, since you sent tile to board."
            );

            // 2. player is able to replace tiles throughout the board,
            //    but before picking, he should restore the 'able-to-meld' state
            //    and retrieve all tiles he sent to board in this turn.
            check(isMeldOk(stateBefore, stateBefore.board, playerIndex, true),
                "[PICK] you should not mess up the board, if you want to pick" );

            // 3. make sure picking next available tile based on last turn
            var tileToPick = stateBefore.trace.nexttile;
            check(tileToPick >= 0 && tileToPick < 106,
                "[PICK] no more tiles  left for picking");

            // 4. construct move operations.
            var boardAfter = angular.copy(stateBefore.board);
            boardAfter[playerRow].push(tileToPick);

            var traceAfter = angular.copy(stateBefore.trace);
            traceAfter.nexttile = tileToPick + 1;

            return [
                {setTurn: {turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBefore.trace.nplayers)}},
                {set: {key: 'type', value: "PICK"}},
                {set: {key: 'board', value: boardAfter}},
                //{set: {key: 'deltas', value: []}},     // pick move will clear delta history
                {set: {key: 'trace', value: traceAfter}},
                {setVisibility: {key: 'tile' + tileToPick, visibleToPlayerIndices: [playerIndex]}}
            ];
        }

        /**
         *
         * @param playerIndex
         * @param stateBefore
         * @returns {*[]}
         */
        function getMeldMove(playerIndex, stateBefore) {
            var board = stateBefore.board;
            var playerRow = getPlayerRow(playerIndex);
            var deltas = stateBefore.deltas;

            // 0. check player has sent as least one tile from hand to board during this turn.
            var tilesSentToBoardThisTurn = getTilesSentToBoardThisTurn(deltas, playerRow);
            check ( tilesSentToBoardThisTurn.length !== 0,
                "[MELD] you cannot meld since no tiles sent to board in this turn"
            );


            // 1. check all sets in board are valid sets (runs or groups)
            check (isMeldOk(stateBefore, board, playerIndex ,stateBefore.trace.initial[playerIndex]),
                "[MELD] meld is not ok" );

            // 2. check winner
            var firstOperation;
            var hasPlayerWon = board[playerRow].length === 0;
            if (hasPlayerWon === false) {
                hasPlayerWon = true;
                for (var i = 0; i < board[playerRow].length; i++) {
                    if (board[playerRow][i] !== -1) {
                        hasPlayerWon = false;
                        break;
                    }
                }
            }
            // player has no tile left in hand, or only has -1 tile in hand, he wins
            if ( hasPlayerWon ) {
                firstOperation = {endMatch: {endMatchScores: getEndScores(playerIndex, stateBefore)}};
            } else {
                firstOperation = {setTurn: {
                    turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBefore.trace.nplayers)}};
            }

            // 3. construct move
            var boardAfter = angular.copy(stateBefore.board);
            // clear all empty slots for player's hand
            for (var col = boardAfter[playerRow].length; col >= 0; col-- ) {
                if (boardAfter[playerRow][col] === -1) {
                    boardAfter[playerRow].splice(col, 1);
                }
            }
            var traceAfter = angular.copy(stateBefore.trace);
            traceAfter.initial[playerIndex] = true;
            return [
                firstOperation,
                {set: {key: 'type', value: "MELD"}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'deltas', value: []}},     // meld move will clear delta history
                {set: {key: 'trace', value: traceAfter}}
            ];

        }

        function getSortMove(playerIndex, stateBefore, sortType) {
            var boardAfter = angular.copy(stateBefore.board);
            var playerHand = boardAfter[getPlayerRow(playerIndex)];
            switch (sortType) {
                case "score":
                case "color":
                    playerHand.sort(sortBy(sortType, stateBefore), stateBefore);
                    break;
                case "set":
                    boardAfter[getPlayerRow(playerIndex)] = findAllSetInHand(playerHand, stateBefore);
                    break;
                default :
                    throw new error("Unexpected sort type: " + sortType);
            }
            return [
                {setTurn: {turnIndex: playerIndex}},
                {set: {key: 'type', value: "SORT"}},
                {set: {key: 'sorttype', value: sortType}},
                {set: {key: 'board', value: boardAfter}}
            ];
        }

        /**
         * Undo last move by player in current turn
         * @param playerIndex
         * @param stateBefore
         */
        function getSingleUndoMove(playerIndex, stateBefore) {
            var deltas = stateBefore.deltas;
            var delta = deltas[deltas.length - 1];
            // reverse the last delta, and then make that move
            var deltaUndo = {tileIndex: delta.tileIndex , from: delta.to, to: delta.from};
            var moveUndo = getMoveMove(playerIndex, stateBefore, deltaUndo, true);
            moveUndo[1].set.value = "UNDO";
            return moveUndo;
        }


        //TODO:
        function getUndoAllMove(playerIndex, stateBefore) {
            var deltas = stateBefore.deltas;
            for (var i = deltas.length - 1; i >= 0; i--) {
                var delta = deltas[i];
                // reverse the last delta, and then make that move
                var deltaUndo = {tileIndex: delta.tileIndex , from: delta.to, to: delta.from};
                var moveUndo = getMoveMove(playerIndex, stateBefore, deltaUndo, true);
            }
            moveUndo[1].set.value = "UNDOALL";
            return [
                {setTurn: {turnIndex: playerIndex}},        // this move will not change turnIndex
                {set: {key: 'type', value: "UNDOALL"}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'deltas', value: deltasAfter}},
                {setVisibility: {key: 'tile' + tileToMove, visibleToPlayerIndices: visibility}}
            ];
        }

        /**
         *
         * @param stateBefore
         * @param playerIndex
         * @returns {Array}
         */
        function getPossibleMoves(stateBefore,  playerIndex) {
            var possibleMoves = [];
            try {
                // "PICK" is possible
                possibleMoves.push(getPickMove(playerIndex, stateBefore));

                // can meld from player's own hand?


            } catch (e) {

            }
            return possibleMoves;
        }

        /** ******************************************************
         ************        Helper Functions    *****************
         *********************************************************/

        /**
         * checks if given condition is satisfied. Throw error if not satisfied.
         *
         * @param condition condition to be tested and expected to be true.
         * @param message error message when condition is not satisfied.
         */
        function check(condition, message) {
            if (condition === false) {
                throw new Error(message);
            }
        }

        function checkPlayerIndex(playerIndex, nPlayers) {
            check( playerIndex >= 0 && playerIndex < nPlayers,
                "checkPlayerIndex, [playerIndex:  " + playerIndex + ", nPlayers: " + nPlayers);
        }

        /**
         * gets the player's index of next turn.
         * 
         * @param playerIndex
         * @param nPlayers number of players in current game.
         * @returns {number} index of next turn.
         */
        function getPlayerIndexOfNextTurn(playerIndex, nPlayers) {
            checkPlayerIndex(playerIndex, nPlayers);
            var index = 0;
            if (playerIndex === nPlayers - 1) {
                index = 0;
            } else {
                index = playerIndex + 1;
            }
            return index;
        }

        /**
         * initializes game board.
         *
         * @param nPlayers
         * @returns {Array}
         */
        function getInitialBoard(nPlayers) {
            var board = [
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            ];
            var tileIndex = 0;
            var tilesInHandInitially = 14;
            // push 14 tiles for each player
            for (var i = 0; i < nPlayers; i++) {
                var row = [];
                for (var j = 0; j < tilesInHandInitially; j++) {
                    row.push(tileIndex);
                    tileIndex++;
                }
                board.push(row);
            }
            return board;
        }

        /**
         * checks given (row, col) is within board's boundary,
         * p.s., board is guaranteed not undefined before calling.
         *
         * @param board
         * @param row
         * @param col
         */
        function checkPositionWithinBoard(board, row, col) {
            check (row !== undefined && col !== undefined,
                "checkPositionWithinBoard: (row, col) = (" + row + "," +  col + ") is undefined"
            );
            var rows = board.length;
            var cols = board[row].length;
            check( row >= 0 && row < rows && col >= 0 && col < cols,
                "checkPositionWithinBoard: position out Of board, [row: " + row + ", col: " + col + "]"
            );
        }

        /**
         * gets tile object by tile index.
         *
         * example: index = 1 -> {color: "blue", score:1}
         *
         * @param index (int)
         * @returns {{color: *, score: *}}
         */
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
                score = index % 13  + 1;
            }
            return {color: color, score: score};
        }

        /**
         * parses one row in game board into array of 'sets' in this row.
         *
         * example: row = [1,2,3,-1,-1,-1,4,8,9,10,-1,-1] -> [[1,2,3],[4,8,9,10]]
         *
         * @param row (array[int]) array of tile indices.
         * @returns {Array}
         */
        function parseRowToSets(row) {
            var result = [];
            var tileSet = [];
            for (var i = 0; i < row.length; i++) {
                var tileIndex = row[i];
                if (tileIndex === -1) {
                    // current set ends
                    if (tileSet.length !== 0) {
                        result.push(tileSet);
                        tileSet = [];
                    }
                } else {
                    check(tileIndex >= 0 && tileIndex < 106,
                        "tileIndex: " + tileIndex
                    );
                    tileSet.push(tileIndex);
                }
            }
            // in case last tileSet ends at last element of row
            if (tileSet.length !== 0) {
                result.push(tileSet);
            }
            return result;
        }

        /**
         * valid runs: contains 3 or more tiles, and
         *             tiles have the same color, and
         *             tile's score are in consecutive number order. Joker can substitute any tile.
         *
         * runs examples: [black3,black4,black5]; [red7,red8,red9,red10,red11]
         *
         * @param sets (array[{color: .., score: ..}])
         * @returns {boolean}
         */
        function isRuns(sets) {
            var len = sets.length;
            if (len < 3 || len > 13) {
                return false;
            }
            var sameColor;
            var expectScore = 0;
            for (var i = 0; i < len; i++) {
                var color = sets[i].color;
                var score = sets[i].score;
                if (color !== 'joker') {
                    // 1. check same color
                    if (sameColor === undefined) {
                        sameColor = color;
                    }
                    if (sameColor !== color) {
                        return false;
                    }

                    // 2. check number, cannot repeat number in current numbers;
                    if (expectScore === 0) {
                        expectScore = score;
                    }
                    if (score !== expectScore) {
                        return false;
                    }
                }
                if (expectScore !== 0) {
                    expectScore += 1;
                }
            }
            return true;
        }

        /**
         * valid groups: sets contain 3 or 4 tiles, and
         *               different colors with each other, and
         *               tiles have the same tile score. joker can substitute any tile in need.
         *
         * groups examples: [black3,red3,joker]; [red7,orange7,blue7,black7]
         *
         * @param sets (array[{color: .., score: ..}])
         * @returns {boolean}
         */
        function isGroups(sets) {
            var length = sets.length;
            if (length !== 3 && length !== 4) {
                return false;
            }
            var sameScore;
            var colors = [];
            for (var i = 0; i < length; i++) {
                var color = sets[i].color;
                var score = sets[i].score;
                if (color !== 'joker') {
                    // 1. check scores are the same
                    if (sameScore === undefined) {
                        // 1st score from the sets
                        sameScore = score;
                    }
                    if (score !== sameScore) {
                        return false;
                    }

                    // 2. check has different colors.
                    if (colors.indexOf(color) !== -1) {
                        // duplicated color appears
                        return false;
                    }
                    colors.push(color);
                }
            }
            return true;
        }

        function getSetsOfTilesByIndex(setsOfTileIndices, state) {
            var result = [];
            for (var i = 0; i < setsOfTileIndices.length; i++) {
                var tile = state["tile" + setsOfTileIndices[i]];
                result.push(tile);
            }
            return result;
        }

        /**
         * get scores of each player at the end of the game.
         * winner gets the scores of tiles that loser still holds at the end.
         *
         * example: player0: []     // winner
         *          player1: [{color:'blue',score:4}, {color:'black',score:5}] // still in player1's hand
         *       -> player0's score = 9, player1's score = -9
         *
         * @param winnerIndex (int) of player who won the game.
         * @param state
         * @returns {Array}
         */
        function getEndScores(winnerIndex, state) {
            var result = [];
            var scoresFromAllLosers = 0;
            var nPlayers = state.nplayers;
            for (var i = 0; i < nPlayers; i++) {
                // calculating score for each player who is not winner
                if (i !== winnerIndex) {
                    var tilesRemaining = state["player" + i].tiles;
                    var score = 0;
                    for (var j = 0; j < tilesRemaining.length; j++) {
                        // adding each tile's score
                        var tile = state["tile" + tilesRemaining[j]];
                        if (tile.color === 'joker') {
                            // joker tile's score is 30
                            score -= 30;
                        } else {
                            score -= tile.score;
                        }
                    }
                    result[i] = score;
                    scoresFromAllLosers += score;
                }
            }
            // winner score is all scores from losers
            result[winnerIndex] = - scoresFromAllLosers;
            return result;
        }

        /**
         * check whether current board can meld.
         *
         * @param stateBefore
         * @param board
         * @param playerIndex
         * @param initial
         * @returns {boolean}
         */
        function isMeldOk(stateBefore, board, playerIndex, initial) {
            var setsInBoard = [];
            // get all 'sets' in game board by scanning each row of board
            for (var i = 0; i < getGameBoardRows(); i++) {
                setsInBoard = setsInBoard.concat(parseRowToSets(board[i]));
            }
            for (var ii = 0; ii < setsInBoard.length; ii++) {
                var sets = getSetsOfTilesByIndex(setsInBoard[ii], stateBefore);
                if ( !isRuns(sets) && !isGroups(sets) ) {
                    console.log("isMeldOk, invalid sets: [" + setsInBoard[ii] + "]");
                    return false;
                }
            }
            if (initial === false) {
                var tilesSentToBoardThisTurn = getTilesSentToBoardThisTurn(stateBefore.deltas, getPlayerRow(playerIndex));
                var score = getInitialMeldScore(stateBefore, setsInBoard, tilesSentToBoardThisTurn);
                check(score >= 30,
                    "[MELD]: you must score at least 30 (without joker tile) for your initial meld" );
            }
            return true;
        }

        /**
         * gets the score for player's initial meld.
         * In initial meld, only sets contain no tiles that from opponents can be calculated,
         * and joker's score is 0.
         *
         * @param state
         * @param setsInBoard
         * @param tilesLastTurn (array) of tile indices that player holding in last turn.
         * @returns {number}
         */
        function getInitialMeldScore(state, setsInBoard, tilesSentThisTurn) {
            var score = 0;
            for (var i = 0; i < setsInBoard.length; i++) {
                var tilesAllFromPlayer = true;
                var setScore = 0;
                for (var j = 0; j < setsInBoard[i].length; j++) {
                    var tileIndex = setsInBoard[i][j];
                    setScore += state["tile" + tileIndex].score;
                    if (tilesSentThisTurn.indexOf(tileIndex) === -1) {
                        // this tile is from opponent
                        tilesAllFromPlayer = false;
                        break;
                    }
                }
                // only add score of sets in which all tiles are from the player who is playing.
                if (tilesAllFromPlayer) {
                    score += setScore;
                }
            }
            return score;
        }


        /**
         * check wether game is over.
         *
         * @param state
         * @returns {boolean}
         */
        function isGameOver(state) {
            return getWinner(state.board, state.deltas) !== -1 || isTie(state);
        }

        /**
         *
         * get index of winning player. returns -1 if no player wins.
         * After game is on, player with no tiles left in hand is the winner.
         * @param board
         * @returns {number}
         */
        function getWinner(board, deltas) {
            var hasLoser = false;
            var winner = -1;
            // check each player's hand
            for (var i = getGameBoardRows(); i < board.length; i++) {
                if (board[i].length === 0 && deltas.length === 0) {
                    winner = i;
                } else {
                    if (hasLoser === false) {
                        hasLoser = true;
                    }
                }
            }
            return hasLoser ? winner : -1;
        }

        /**
         * check if game is tied. Game is tied when tile pool is empty
         * or no player can make valid move any more.
         * @returns {boolean}
         */
        function isTie(state) {
            var isTied = state.trace.nexttile >= 106;
            //if (isTied === false) {
            //}
            return isTied;
        }

        /**
         * return true if tileIndex is sent from player's hand to game board in current turn.
         * @param tileIndex
         * @param playerIndex
         * @param deltas
         * @returns {boolean}
         */
        function isTileSentToBoardInCurrentTurnByPlayer(tileIndex, playerIndex, deltas) {
            var playerRow = getPlayerRow(playerIndex);
            for (var i = 0 ; i < deltas.length; i++) {
                if (deltas[i].tileIndex === tileIndex &&
                    deltas[i].from.row === playerRow ) {
                    return true;
                }
            }
            return false;
        }

        /**
         * get the row in board that belongs to given player's hand
         * @param playerIndex
         * @returns {*}
         */
        function getPlayerRow(playerIndex) {
            return getGameBoardRows() + playerIndex;
        }

        function getGameBoardRows() {
            return 6;
        }

        //function getGameBoardCols() {
        //    return 18;
        //}

        /**
         *
         * @param deltas
         * @param playerRow
         * @returns {Array} [tileIndex] sent to board by current player in this turn
         */
        function getTilesSentToBoardThisTurn(deltas, playerRow) {
            var result = [];
            var count = 0;
            for (var i = 0; i < deltas.length; i++) {
                var tileIndex = deltas[i].tileIndex;
                var from = deltas[i].from;
                var to = deltas[i].to;
                if (from.row === playerRow && to.row !== playerRow) {
                    count++;
                    result.push(tileIndex);
                } else if (from.row !== playerRow && to.row === playerRow) {
                    count--;
                    var index = result.indexOf(tileIndex);
                    result.splice(index, 1);
                }
            }
            check(result.length === count, "get tiles sent wrong");
            return result;
        }

        function findAllSetInHand(playerHand, state) {
            if (playerHand.length === 0) {
                return;
            }
            // try to find all groups in hand
            var hand = angular.copy(playerHand);

            // 1. find all groups in hand
            var groups = findAllGroups(hand, state);
            var handAfter = [];
            for (var i = 0; i < groups.length; i++) {
                console.log("group: " + groups[i]);
                // append all valid groups
                handAfter = handAfter.concat(groups[i]);
            }
            // 2. get the rest tiles in hand
            var restTiles = [];
            for (var i = 0; i < hand.length; i++) {
                if (handAfter.indexOf(hand[i]) === -1) {
                    restTiles.push(hand[i]);
                }
            }

            // 3. find all runs from the rest tiles in hand
            var runs = findAllRuns(restTiles, state);
            for (var i = 0; i < runs.length; i++) {
                console.log("run: " + runs[i]);
                handAfter = handAfter.concat(runs[i]);
            }
            for (var i = 0 ; i < restTiles.length; i++) {
                if (handAfter.indexOf(restTiles[i]) === -1) {
                    handAfter.push(restTiles[i]);
                }
            }
            return handAfter;
        }

        function findAllRuns(tiles, state) {
            if (tiles.length === 0) {
                return [];
            }
            tiles.sort(sortBy("color", state));
            var runs = [];
            var fast = getTileColorByIndex(tiles[0], state);
            var sameColor = [];
            for (var i = 0; i < tiles.length; i++) {
                var tileIndex = tiles[i];
                var color = getTileColorByIndex(tileIndex, state);
                if (color === fast ) {
                    sameColor.push(tileIndex);
                }
                if (color !== fast || i === tiles.length - 1) {
                    var validRuns = findRun(sameColor, state);
                    if (validRuns.length > 0) {
                        runs = runs.concat(validRuns);
                    }
                    fast = color;
                    sameColor = [tileIndex];
                }
            }
            return runs;
        }

        function findRun(runCandidate, state) {
            //console.log("same: " + runCandidate);
            var validRuns = [];
            if (runCandidate.length === 0) {
                return validRuns;
            }
            var scoreExpect = getTileScoreByIndex(runCandidate[0], state);
            var consecutive = [];
            for (var i = 0; i < runCandidate.length; i++) {
                var tileIndex = runCandidate[i];
                var score = getTileScoreByIndex(tileIndex, state);
                if (scoreExpect === score) {
                    consecutive.push(tileIndex);
                    scoreExpect += 1;
                } else {
                    if (consecutive.length >= 3) {
                        validRuns.push(consecutive);
                    }
                    consecutive = [tileIndex];
                    scoreExpect = score + 1;
                }
            }
            if (consecutive.length >= 3) {
                validRuns.push(consecutive);
            }
            return validRuns;
        }

        function findAllGroups(tiles, state) {
            if (tiles.length === 0) {
                return [];
            }
            tiles.sort(sortBy("score", state));
            var groups = [];
            var fast = getTileScoreByIndex(tiles[0], state);
            var group = [];
            for (var i = 0; i < tiles.length; i++) {
                var tileIndex = tiles[i];
                var score = getTileScoreByIndex(tileIndex, state);
                if (score === fast) {
                    group.push(tileIndex);
                }
                if (score !== fast || i === tiles.length - 1) {
                    //meet new number and current group
                    var validGroups = findGroup(group,state);
                    if (validGroups.length > 0) {
                        groups = groups.concat(validGroups);
                    }
                    fast = score;
                    group = [tileIndex];
                }
            }
            return groups;
        }

        /**
         *
         * @param groupCandidate
         * @param state
         * @returns {Array}
         */
        function findGroup(groupCandidate, state) {
            var validGroups = [];
            if (groupCandidate.length === 0) {
                return validGroups;
            }
            var colors = [];
            var group = [];
            for (var i = 0; i < groupCandidate.length; i++) {
                var tileIndex = groupCandidate[i];
                var color = getTileColorByIndex(tileIndex, state);
                if (colors.indexOf(color) === -1) {
                    // new color
                    colors.push(color);
                    group.push(tileIndex);
                }
            }
            if (group.length >= 3) {
                validGroups.push(group);
            }
            return validGroups;
        }

        function getTileScoreByIndex(tileIndex, state) {
            check (state["tile" + tileIndex] !== undefined, "undefined tile: tile" + tileIndex);
            return state["tile" + tileIndex].score;
        }

        function getTileColorByIndex(tileIndex, state) {
            check (state["tile" + tileIndex] !== undefined, "undefined tile: tile" + tileIndex);
            return state["tile" + tileIndex].color;
        }


        /**
         * usage:
         *   playerHand.sort(sortBy("score", $scope.state));
         * @param type
         * @returns {Function}
         */
        function sortBy(type, state) {
            return function (tileIndexA, tileIndexB) {
                var tileA = state["tile" + tileIndexA];
                var tileB =  state["tile" + tileIndexB];
                if (tileA !== undefined && tileB !== undefined) {
                    if (type === "score") {
                        return tileA.score - tileB.score;
                    } else if (type === "color") {
                        return (tileA.color > tileB.color) ? 1 : (tileA.color < tileB.color) ? -1 : (tileA.score - tileB.score);
                    }
                }
                return 1;
            }
        }

        /** *********************************
         * ======= Return functions ========
         ***********************************/
        return {
            isMoveOk: isMoveOk,
            createMove: createMove,
            getTileByIndex: getTileByIndex,
            getPossibleMoves: getPossibleMoves,
            findAllSetInHand: findAllSetInHand,
            sortBy: sortBy,

            createInitialMove: getInitialMove,
            createPickMove: getPickMove,
            createMeldMove: getMeldMove,
            createSingleUndoMove: getSingleUndoMove,
            createUndoAllMove: getUndoAllMove,
            createMoveMove: getMoveMove,
            createSortMove: getSortMove

        };

    });
}());
