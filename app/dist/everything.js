/**
 * File: app/js/app.js
 * ------------------------------------------------
 * Starting point for application and configuration
 *
 * @author: Jingxin Zhu
 * @date  : 2015.05.10
 * ------------------------------------------------
 */

'use strict';

angular.module('myApp',['ngTouch', 'ui.bootstrap'])
    .constant("CONFIG", {
        GAME_BOARD_ROWS: 6,
        GAME_BOARD_COLS: 18,
        GAME_AREA_PADDING_PERCENTAGE: 0.02,

        SETTING: {
            verbose            : true,
            show_dragging_lines: false
        }
    }
);
;/**
 * File: app/js/controllers/gameCtrl.js
 * ------------------------------------
 * @author: Jingxin Zhu
 * @date:   2015.03.10
 * ------------------------------------
 */

(function() {

    'use strict';

    angular.module('myApp')
        .controller('GameCtrl', [
        '$scope', '$log', '$window', '$animate', '$timeout', '$translate', 'stateService', 'gameService',
            'dragAndDropService', 'gameLogicService', 'gameAIService', 'CONFIG',
        function($scope, $log, $window,  $animate, $timeout, $translate, stateService ,gameService,
                 dragAndDropService, gameLogicService, gameAIService, CONFIG) {

            /*************************************************************
             *********************   Configuration  *********************/
            // whether output information to console
            var verbose = CONFIG.SETTING.verbose;

            // whether show dragging lines while dragging
            var showDraggingLines = CONFIG.SETTING.show_dragging_lines;

            /** ************************************************************/

            $scope.gameAreaPaddingPercent = CONFIG.GAME_AREA_PADDING_PERCENTAGE;
            var gameBoardRows = CONFIG.GAME_BOARD_ROWS;
            var gameBoardCols = CONFIG.GAME_BOARD_COLS;

            function logout(log, obj) {
                if (verbose) {
                    if (obj === undefined && obj === true) {
                        console.log(JSON.stringify(log, null));
                    } else {
                        console.log(log);
                    }
                }
            }

            var gameEnd = false;

            $scope.rows = gameBoardRows;
            $scope.cols = gameBoardCols;

            var isComputerTurn = false;
            var turnIndex = null;

            var myDrag        = document.getElementById("MyDrag");
            var gameArea      = document.getElementById("gameArea");
            var handPanel     = document.getElementById("hand-panel");
            var draggingLines = document.getElementById("draggingLines");
            var verticalDraggingLine   = document.getElementById("verticalDraggingLine");
            var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");

            var dragFrom = null; // The {row: YY, col: XX} where dragging started.
            var undoAllInProcess = false;

            function isWithinGameArea(clientX, clientY) {
                var element = gameArea;
                var offset = element.getBoundingClientRect();
                return clientX >= offset.left && clientX < offset.right &&
                    clientY >= offset.top && clientY <= offset.bottom;
            }

            function handleDragEvent(type, clientX, clientY) {
                if (!$scope.isYourTurn || !isWithinGameArea(clientX, clientY)) {
                    draggingLines.style.display = "none";
                    myDrag.style.display = "none";
                    return;
                }
                var pos = getDraggingTilePosition(clientX, clientY);
                if (type === "touchstart" ) {
                    dragStartHandler(pos);
                }
                if (!dragFrom) {
                    // end dragging if not a valid drag start
                    return;
                }
                if (type === "touchend") {
                    dragEndHandler(pos);
                } else {
                    // drag continues
                    dragContinueHandler(pos);
                }
                if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
                    draggingLines.style.display = "none";
                    myDrag.style.display = "none";
                    dragFrom = null;
                }
            }

            function dragStartHandler(pos) {
                if (pos && $scope.board[pos.row][pos.col] !== -1) {
                    dragFrom = pos;
                } else {
                    dragFrom = null;
                }
            }

            function dragEndHandler(pos) {
                if (pos) {
                    var from = dragFrom;
                    var to = pos;
                    $scope.$apply(function () {
                        try {
                            $scope.boardCellClicked(from.row, from.col);
                            $scope.boardCellClicked(to.row, to.col);
                            $scope.msg = msg;
                        }catch(e) {
                            // illegal move, restore
                            /* return immediately! */
                            return;
                        }
                    });
                }
            }

            function dragContinueHandler(pos) {
                if (pos) {
                    var container = getTileContainerSize(pos);
                    $scope.$apply(function () {
                        var tileIndex = $scope.board[dragFrom.row][dragFrom.col];
                        var tile = $scope.state['tile' + tileIndex];
                        $scope.tileIndex = tileIndex;
                        $scope.drag_color = tile.color;
                        $scope.drag_score = tile.score;
                        $scope.tile = tile;
                    });

                    myDrag.style.display = "inline";
                    myDrag.style.width = container.width + "px";
                    myDrag.style.left = container.left - gameArea.getBoundingClientRect().left + "px";
                    myDrag.style.paddingBottom= container.height + "px";
                    myDrag.style.top = container.top + "px";

                    var centerXY = {
                        //TODO: better to determine center x
                        x: container.left - gameArea.getBoundingClientRect().left + container.width / 2
                            - document.getElementById("game").clientWidth * $scope.gameAreaPaddingPercent,
                        y: container.top  + container.height / 2};

                    setDraggingLines(centerXY);
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
                if (showDraggingLines) {
                    draggingLines.style.display = "inline";
                    if (centerXY !== undefined) {
                        verticalDraggingLine.setAttribute("x1", centerXY.x);
                        verticalDraggingLine.setAttribute("x2", centerXY.x);
                        horizontalDraggingLine.setAttribute("y1", centerXY.y);
                        horizontalDraggingLine.setAttribute("y2", centerXY.y);
                    }

                }
            }

            /**
             *
             * @param clientX the absolute x position in window
             * @param clientY the absolute y position in window
             * @returns {{row: number, col: number}}
             */
            function getDraggingTilePosition(clientX, clientY) {
                var board = document.getElementById("board");
                var boardOffset = board.getBoundingClientRect();
                var x = clientX - boardOffset.left;
                var y = clientY - boardOffset.top;
                var row = -1;
                var col = -1;
                if (x > 0 && y > 0 && x < boardOffset.width && y < boardOffset.height) {
                    row = Math.floor(gameBoardRows * y / boardOffset.height);
                    col = Math.floor(gameBoardCols * x / boardOffset.width );
                } else {
                    var handUl = document.getElementById("hand-ul");
                    var windowOffset = handUl.getBoundingClientRect();
                    x = clientX - windowOffset.left;
                    y = clientY - windowOffset.top;
                    if (x > 0 && y > 0 && x < handPanel.clientWidth && y < handPanel.clientHeight) {
                        //row = gameBoardRows + $scope.turnIndex +  Math.floor(gameBoardRows * y / handPanel.clientHeight);
                        row = gameBoardRows + $scope.turnIndex;
                        col = Math.floor($scope.board[row].length * x / windowOffset.width);
                    }
                }
                //logout("row: " + row);
                //logout("col: " + col);
                return row !== -1 ? {row: row, col: col} : null ;
            }

            var computerMovesInProcess = false;
            function sendComputerMove() {
                var move;

                if (computerMovesInProcess === false) {
                    move = gameAIService.createComputerMove($scope.turnIndex, $scope.state);
                    if (move[1].set.value !== "PICK") {
                        computerMovesInProcess = true;
                    }
                    gameService.makeMove(move);
                    return;
                }

                if (computerMovesInProcess) {
                    move = gameLogicService.createMeldMove($scope.turnIndex, $scope.state);
                    gameService.makeMove(move);
                    computerMovesInProcess = false;
                }

            }

            $scope.shouldSlowlyAppear = function () {
                return $scope.activeTile !== undefined;
            };

            /**
             * Platform's API
             * @param params
             */
            function updateUI(params) {
                $scope.isYourTurn = params.turnIndexAfterMove >=0 &&          // -1 means game end, -2 means game viewer
                params.yourPlayerIndex === params.turnIndexAfterMove;         // it's my turn

                // make initial move only when its player's turn
                if (isEmptyObj(params.stateAfterMove) && $scope.isYourTurn) {
                    //var nPlayers = params.playersInfo.length;
                    var nPlayers = 2;
                    try {
                        var move = gameLogicService.createInitialMove(nPlayers);
                        gameService.makeMove(move);
                    } catch (e) {
                        logout(e.message);
                    }
                    return;
                }


                if ($scope.isYourTurn) {
                    turnIndex = params.turnIndexAfterMove;

                    gameEnd = params.turnindexAfterMove === -1;
                    $scope.yourPlayerIndex = params.yourPlayerIndex;
                    $scope.turnIndex = params.turnIndexAfterMove;
                    $scope.state = params.stateAfterMove;
                    $scope.board = params.stateAfterMove.board;
                    $scope.nexttile = params.stateAfterMove.trace.nexttile;
                    $scope.playerHand = $scope.board[$scope.rows + $scope.turnIndex];

                    $scope.tileSentToBoard = gameLogicService.getTilesSentToBoardThisTurn($scope.state.deltas, $scope.rows + $scope.turnIndex).length !== 0 ;
                    //console.log("turn: " + gameLogicService.getTilesSentToBoardThisTurn($scope.state.deltas, $scope.rows + $scope.turnIndex));

                    // disable sort feature when empty slots left in board
                    // because sort will reset player hand
                    $scope.sortDisabled = false;
                    for (var i = 0; i < $scope.playerHand.length; i++) {
                        if ($scope.playerHand[i] === -1) {
                            $scope.sortDisabled = true;
                            break;
                        }
                    }
                }

                // Is it the computer's turn?
                isComputerTurn = $scope.isYourTurn &&
                params.playersInfo[params.yourPlayerIndex].playerId  === '';

                if(isComputerTurn) {
                    $scope.isYourTurn = false; // to make sure the UI won't send another move.
                    // Waiting 0.5 seconds to let the move animation finish; if we call aiService
                    // then the animation is paused until the javascript finishes.
                    sendComputerMove();
                }

                // Undo all process finished ?
                if (undoAllInProcess && $scope.state.deltas.length === 0) {
                    undoAllInProcess = false;
                }

                if (undoAllInProcess && $scope.state.deltas.length !== 0) {
                    $scope.undoBtnClicked();
                }


            }

            $scope.boardCellClicked =  function (row, col) {
                if ( $scope.isYourTurn === false || row === -1 || col === -1 ) {
                    return;
                }
                try {
                    if ($scope.activeTile === undefined) {
                        // clicking a tile to activate it
                        if ($scope.board[row][col] !== -1) {
                            $scope.activeTile = $scope.board[row][col];
                            $scope.from = {row: row, col: col};
                            var log = "picking Tile" + $scope.activeTile + " (" +
                            getTileByIndex($scope.activeTile).color +
                            "," + getTileByIndex($scope.activeTile).score +
                            " from: (" + row + "," + col + "))";
                            logout(log);
                        }
                    } else {
                        // clicking a cell to send tile to
                        if ($scope.board[row][col] === -1) {
                            $scope.to = {row: row, col: col};
                            var delta = {tileIndex: $scope.activeTile, from: $scope.from, to: $scope.to};
                            var move = gameLogicService.createMoveMove($scope.turnIndex, $scope.state, delta);
                            gameService.makeMove(move);
                            //$scope.tileSentToBoard = gameLogicService.getTilesSentToBoardThisTurn.length !== 0 ;
                        }
                        clearActiveTile();
                    }
                } catch (e) {
                    logout(e);
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
                        $scope.info = e.message;
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

            //TODO: deactivate button when tiles sent to board
            $scope.pickBtnClicked = function () {
                if ($scope.isYourTurn) {
                    try {
                        var move = gameLogicService.createPickMove($scope.turnIndex, $scope.state);
                        gameService.makeMove(move);
                        // reset sort
                        $scope.sortType = "sort";
                        $scope.info = "pick one tile";
                    } catch (e) {
                        logout(e.message);
                        $scope.info = e.message;
                    }
                }
            };

            //TODO: deactivate button when no tiles sent to board yet
            $scope.meldBtnClicked = function () {
                if ($scope.isYourTurn) {
                    try {
                        var move = gameLogicService.createMeldMove($scope.turnIndex, $scope.state);
                        gameService.makeMove(move);
                        // reset sort
                        $scope.sortType = "sort";
                    } catch (e) {
                        //TODO:
                        logout(e.message);
                        $scope.info = e.message;
                    }
                }
            };

            $scope.undoBtnClicked = function () {
                if ($scope.isYourTurn) {
                    try {
                        var undo = gameLogicService.createSingleUndoMove($scope.turnIndex, $scope.state);
                        gameService.makeMove(undo);
                    } catch (e) {
                        //$scope.info = e.message;
                    }
                }
            };

            $scope.undoAllBtnClicked = function () {
                if ($scope.isYourTurn) {
                    undoAllInProcess = true;
                    $scope.undoBtnClicked();
                    //$scope.tileSentToBoard = false;
                }
            };

            $scope.sortType = "sort";
            $scope.setSortTypeBtnClicked = function () {
                if (gameEnd) {
                    return;
                }
                var type = $scope.sortType;
                var nextType;
                try {
                    switch (type) {
                        case "sort":
                        case "set":
                            type = "set";
                            nextType = "123";
                            break;
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
                    logout(e.message);
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


            /* ================= Helper Functions =================== */
            function isEmptyObj(obj) {
                // null and undefined are "empty"
                if (obj === null) {
                    return true;
                }
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

            $scope.getHandTilesRange = function() {
                if ($scope.board === undefined) {
                    return [];
                }
                var len = $scope.board[CONFIG.GAME_BOARD_ROWS + $scope.turnIndex].length;
                var result = [];
                for (var i = 0; i < len; i++) {
                    result.push(i);
                }
                return result;
            };

            // enable to manipulate game state in e2e tests
            window.e2e_test_stateService = stateService;

            // enable platform's drag-n-drop listener
            dragAndDropService.addDragListener("gameArea", handleDragEvent);

            gameService.setGame( {
                gameDeveloperEmail: "jz1371@nyu.edu",
                minNumberOfPlayers: 2,
                //maxNumberOfPlayers: 4,
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogicService.isMoveOk,
                updateUI: updateUI
            });

        }]);
}());
;angular.module('myApp').controller('HelpCtrl', ['$scope','$modal','$log',function ($scope, $modal, $log) {

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
    $scope.helps = [
        {"image": "img/valid.png", "rule": 'RULE_1'},
        {"image": "img/valid-runs.png", "rule": 'RULE_2'},
        {"image": "img/valid-groups.png", "rule": 'RULE_3'},
        {"image": "img/valid-joker.png", "rule": 'RULE_4'},
        {"image": "img/valid-run2.png", "rule": 'RULE_5'}
    ];
    $scope.myInterval = 0;
}]);
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
 * File: app/js/services/gameAIService.js
 * ---------------------------------------
 * @author: Jingxin Zhu
 * @date  : 2015.04.05
 * ---------------------------------------
 */

(function () {

    'use strict';

    angular.module('myApp').factory('gameAIService', [
        'gameLogicService', function(gameLogicService){

            function createComputerMove(playerIndex, state) {

                var moves = gameLogicService.getPossibleMoves(playerIndex, state);

                var bestMove = getBestMoveByScore(moves, playerIndex, state);

                return moves[bestMove];
            }

            function getBestMoveByScore(moves, playerIndex, state) {
                var maxScore = 0;
                var best = 0;
                if (moves.length === 1) {
                    // only one move possible, then make that move
                    return 0;
                } else {
                    maxScore = getScore(moves[0], playerIndex, state);
                    for (var i = 1; i < moves.length; i++) {
                        var score = getScore(moves[i], playerIndex, state);
                        if (score > maxScore) {
                            best = i;
                            maxScore = score;
                        }
                    }

                }
                return best;
            }

            function getScore(move, playerIndex, state) {
                var type = move[1].set.value;
                if (type === 'PICK') {
                    return 0;
                } else {
                    var deltas = move[3].set.value;
                    var tilesSent = gameLogicService.getTilesSentToBoardThisTurn(deltas, 6 + playerIndex);
                    var score = 0;
                    for (var i = 0; i < tilesSent.length; i++) {
                        var tile = state["tile" + tilesSent[i]];
                        if (tile.color !== 'joker') {
                            score += tile.score;
                        } else {
                            if (state.trace.initial[playerIndex] === true) {
                                score += 30;
                            } else {
                                // joker's score is 0 for player has not finished initial meld
                                score += 0;
                            }
                        }
                    }
                    return score;
                }
            }

            return {
                createComputerMove: createComputerMove
            };

        }]);
}());
;/**
 * File: app/js/services/gameLogicService.js
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
     * 3. type:  'INIT' / 'MOVE' / 'PICK' / 'MELD' / 'UNDO' / 'SORT'
     *
     * 4. trace: {nplayers: *, initial: [], nexttile: *}
     *
     * 5. tiles: array of tile, each tile is {tileIndex: {score: *, color: 'red'/'black'/'orange'/'blue'/'joker'}}
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
    angular.module('myApp').factory('gameLogicService', ['CONFIG', function(CONFIG) {

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
                    if (CONFIG.SETTING.verbose) {
                        // print debug info
                        var actLen = actualMove.length;
                        var expLen = expectedMove.length;
                        if (actLen !== expLen) {
                            console.log("Different length for actual move and expected move");
                        } else {
                            for (var i = 0; i < actLen; i++) {
                                if ( !angular.equals(actualMove[i], expectedMove[i]) ) {
                                    console.log("act: " + JSON.stringify(actualMove[i]));
                                    console.log("exp: " + JSON.stringify(expectedMove[i]));
                                }
                            }
                        }
                    }
                    return false;
                }
            } catch (e) {
                //if (CONFIG.SETTING.verbose) {
                //    //console.log(e.stack);
                //    console.log(e.message);
                //}
                return false;
            }
            return true;
        }

        /**
         *
         * @param stateBefore
         * @param playerIndex
         * @param actualMove
         * @returns {*}
         */
        function createMove(stateBefore, playerIndex, actualMove) {
            var moveType = actualMove[1].set.value;
            if (moveType !== "INIT") {
                check( !isGameOver(stateBefore),
                    "Game is over, you cannot move any move"
                );
            }
            var expectedMove;
            var deltas;
            switch (moveType) {
                case "INIT":
                    var nPlayers = actualMove[2].set.value.nplayers;
                    expectedMove = getInitialMove(nPlayers);
                    break;
                case "MOVE":
                    deltas = actualMove[3].set.value;
                    var delta = deltas[deltas.length - 1];
                    expectedMove = getMoveMove(playerIndex, stateBefore, delta, null);
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
                case "COMB":
                    deltas = actualMove[3].set.value;
                    expectedMove = getCombinedMove(playerIndex, stateBefore, deltas);
                    break;
                default:
                    throw new Error("Unexpected move");
            }
            return expectedMove;
        }

        /**
         * Creates the initial move.
         *
         * @param nPlayers (int) number of players in current game.
         * @returns {*[]} array of operations in initial move.
         */
        function getInitialMove(nPlayers) {
            // 1. make sure 2 - 4 players are playing the game.
            check(nPlayers <= 4 && nPlayers >= 0,
                "INIT: nPlayers = " + nPlayers + " is given, but only 2 - 4 players are allowed."
            );

            // Initially, set 'initial' to false, i.e. no player has made initial meld
            var initial = [];
            for (var i = 0; i < nPlayers; i++) {
                initial.push(false);
            }
            // 2. construct the move
            var nTilesPerPlayerInitially = 14;
            var move = [
                {setTurn: {turnIndex: 0}},
                {set: {key: 'type', value: "INIT"}},
                {set: {key: 'trace', value: {
                    nplayers: nPlayers,
                    initial: initial,
                    nexttile: nPlayers * 14}}},
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

            // 3.2. initialize tile visibility
            var visibility = [];
            for (var ii = 0; ii < nPlayers; ii++) {
                for (var jj = 0; jj < nTilesPerPlayerInitially; jj++) {
                    // each player has 14 tiles in hand initially
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
         * @param undo
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
            //    and retrieve all tiles he sent to board in this turn back to his hand.
            check(isMeldOk(stateBefore, stateBefore.board, playerIndex, true),
                "[PICK] you should not mess up the board, if you want to pick" );

            var tileToPick = stateBefore.trace.nexttile;

            // 3. construct move operations.
            var boardAfter = angular.copy(stateBefore.board);
            boardAfter[playerRow].push(tileToPick);
            // sort tiles in hand by finding all sets and put sets at the front
            boardAfter[playerRow] = findAllSetInHand(boardAfter[playerRow], stateBefore);

            var traceAfter = angular.copy(stateBefore.trace);
            traceAfter.nexttile = tileToPick + 1;

            var firstOperation =  {setTurn: {turnIndex: getPlayerIndexOfNextTurn(playerIndex, stateBefore.trace.nplayers)}};
            if (traceAfter.nexttile === 106) {
                firstOperation = {endMatch: {endMatchScores: getEndScores(-1, stateBefore)}};
            }
            return [
                firstOperation,
                {set: {key: 'type', value: "PICK"}},
                {set: {key: 'board', value: boardAfter}},
                {set: {key: 'deltas', value: []}},     // pick move will clear delta history
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

            // 2. check winner: player only has -1 tile in hand, he wins
            var hasPlayerWon = true;
            for (var i = 0; i < board[playerRow].length; i++) {
                if (board[playerRow][i] !== -1) {
                    hasPlayerWon = false;
                    break;
                }
            }

            var firstOperation;
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
                    throw new Error("Unexpected sort type: " + sortType);
            }
            return [
                {setTurn: {turnIndex: playerIndex}},
                {set: {key: 'type', value: "SORT"}},
                {set: {key: 'sorttype', value: sortType}},
                {set: {key: 'board', value: boardAfter}}
            ];
        }

        /**
         *
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

        function getCombinedMove(playerIndex, stateBefore, deltas) {

            check(deltas.length > 0, "no move to make");

            var board = angular.copy(stateBefore.board);

            for (var i = 0; i < deltas.length; i++) {
                var delta = deltas[i];
                checkDelta(delta, board);
                board[delta.from.row][delta.from.col] = -1;
                board[delta.to.row][delta.to.col] = delta.tileIndex;
            }

            var traceAfter = angular.copy(stateBefore.trace);
            traceAfter.initial[playerIndex] = true;
            var move = [
                {setTurn: {turnIndex: playerIndex}},
                {set: {key: 'type', value: "COMB"}},
                {set: {key: 'board', value: board}},
                {set: {key: 'deltas', value: deltas}},
                {set: {key: 'trace', value: traceAfter}}
            ];
            return move;
        }

        function checkDelta(delta, board) {
            check(delta.tileIndex !== undefined && delta.from !== undefined, delta.to !== undefined,
                "missing part for delta" );

            check (board[delta.from.row][delta.from.col] === delta.tileIndex,
                "tile" + delta.tileIndex + " is not at board[" + delta.from.row + "][" + delta.from.col + "]");

            check (board[delta.to.row][delta.to.col] === -1, "position is occupied");

        }


        function getPossibleMoves(playerIndex, stateBefore) {
            var possibleMoves = [];
            possibleMoves.push(getPickMove(playerIndex, stateBefore));

            var computerDeltas = [];
            //var playerRow = getPlayerRow(playerIndex);

            // 1. find all sets in hand (group > set)
            var playerHand = angular.copy(stateBefore.board[getPlayerRow(playerIndex)]);
            var hand = angular.copy(playerHand);

            var findResultOfGroupFirst = findSetsInHand(playerHand, stateBefore, "groupFirst");
            var sets = findResultOfGroupFirst.sets;

            var ableToInitial = true;
            if (stateBefore.trace.initial[playerIndex] === false) {
                if (getScore(sets, stateBefore) < 30) {
                    ableToInitial = false;
                }
            }

            //var remains = findResultOfGroupFirst.remains;

            //var findResultOfRunFirst = findSetsInHand(playerHand, stateBefore, "runFirst");
            //var sets2 = findResultOfRunFirst.sets;
            //var remains2 = findResultOfRunFirst.remains;
            //console.log("sets1: " + sets);
            //console.log("sets2: " + sets2);

            // 2. for rest tiles, try to append them using tiles in board
            var board = angular.copy(stateBefore.board);

            //if (stateBefore.trace.initial[playerIndex] === true) {
            //    // only able to append tile to other tiles on board when finish initial meld
            //    var expectingTiles = getExpectingTiles(stateBefore);
            //    console.log("expect: " + printObj(expectingTiles));
            //
            //    if (expectingTiles.length > 0) {
            //        for (var i = 0 ; i < remains.length; i++) {
            //            var tileIndex = remains[i];
            //            var tile = findTileFromGameStateByIndex(remains[i], stateBefore);
            //            for (var j = 0; j < expectingTiles; j++) {
            //                if (angular.equals(tile, expectingTiles[j].tile)) {
            //                    var delta = {tileIndex: remains[i],
            //                        from: {row: playerRow, col: hand.indexOf(tileIndex)},
            //                        to: expectingTiles[j].pos
            //                    };
            //                    computerDeltas.push(delta);
            //                    board[delta.to.row][delta.to.col] = delta.tileIndex;
            //                    board[delta.from.row][delta.from.col] = -1;
            //                    break;
            //                }
            //            }
            //        }
            //    }
            //}

            // 3. find proper position to place sets
            var start = {row: 0, col: 0};
            for (var i = 0; i < sets.length; i++) {
                var emptySlot = getNextEmptySlotInBoard(board, start, sets[i].length);
                if (emptySlot === null) {
                    break;
                }
                for (var j = 0; j < sets[i].length; j++) {
                    var delta = {tileIndex: sets[i][j],
                        from: {row: getPlayerRow(playerIndex), col: hand.indexOf(sets[i][j])},
                        to: {row: emptySlot.row, col: emptySlot.col + j}
                    };
                    //console.log("aa: " + sets[i][j] + " , "  + hand);
                    computerDeltas.push(delta);
                    board[delta.from.row][delta.from.to] = -1;
                    board[delta.to.row][delta.to.col] = delta.tileIndex;
                }
                start = {row: emptySlot.row, col: emptySlot.col + sets[i].length};
            }
            //console.dir(computerDeltas);
            //console.log("here" + JSON.stringify(computerDeltas, null, 4));


            if (ableToInitial && computerDeltas.length !== 0) {

                var move = getCombinedMove(playerIndex, stateBefore, computerDeltas);
                possibleMoves.push(move);

            }

            return possibleMoves;

        }

        //function getExpectingTiles (gameState) {
        //    var expecting = [];
        //    var board = gameState.board;
        //    var setsOnBoard = getAllSetsOnBoard(board, gameState);
        //
        //    // check each set
        //    for (var i = 0; i < setsOnBoard.length; i++) {
        //        var tileSet = setsOnBoard[i].tileSet;
        //        var start = setsOnBoard[i].start;
        //        //console.log("here: " + printObj(tileSet));
        //        //console.log("at: " + printObj(start) );
        //
        //        //TODO: deal with set that has joker inside
        //        var hasJoker = false;
        //        for (var j = 0; j < tileSet.length; j++) {
        //            if (tileSet[j].color === 'joker') {
        //                hasJoker = true;
        //            }
        //        }
        //
        //        //TODO: let computer rearrange tiles on board
        //        if (hasJoker === false) {
        //            var colToSend;
        //            if (tileSet[0].color === tileSet[1].color) {
        //                // expecting a tile inserted into run
        //                colToSend = start.col + tileSet.length;
        //                var highScore = tileSet[tileSet.length - 1].score;
        //                if (highScore < 13 &&
        //                    colToSend < getGameBoardCols() && colToSend + 1 < getGameBoardCols() &&
        //                        board[start.row][colToSend] === -1 && board[start.row][colToSend + 1] === -1
        //                ) {
        //                    expecting.push({tile: {score: highScore + 1, color: tileSet[0].color}, pos: {row: start.row, col: colToSend}});
        //                }
        //                var lowScore = tileSet[0].score;
        //                if (lowScore > 1 &&
        //                        colToSend >= 0 && colToSend - 1 >= 0 &&
        //                        board[start.row][colToSend] === -1 && board[start.row][colToSend - 1] === -1
        //                ) {
        //                    expecting.push({tile: {score: lowScore - 1, color: tileSet[0].color, pos: {row: start.row, col: colToSend}}});
        //                }
        //
        //            } else {
        //                // expecting a tile inserted into group
        //                if (tileSet.length === 3) {
        //                    var colors = ["black", "red", "blue", "orange"];
        //                    for (var ii = 0; ii < 3; ii++) {
        //                        var index = colors.indexOf(tileSet[i].color);
        //                        if (index !== -1) {
        //                            colors.splice(index, 1);
        //                        }
        //                    }
        //                    colToSend = start.col + tileSet.length;
        //                    if ( colToSend < getGameBoardCols() && colToSend + 1 < getGameBoardCols() &&
        //                        board[start.row][colToSend] === -1 && board[start.row][colToSend + 1] === -1
        //                    ) {
        //                        expecting.push({
        //                            tile: {score: tileSet[0].score, color: colors[0]},
        //                            pos: {row: start.row, col: colToSend}
        //                        });
        //                    }
        //                }
        //
        //            }
        //        }
        //
        //    }
        //    return expecting;
        //
        //}

        //function findTileFromGameStateByIndex(tileIndex, gameState) {
        //    check (gameState["tile" + tileIndex] !== undefined, "undefined tile");
        //    return gameState["tile" + tileIndex];
        //}

        function getScore(sets, gameState) {
            var score = 0;
            for (var i = 0; i < sets.length; i++) {
                for (var j = 0; j < sets[i].length; j++) {
                    var tileIndex = sets[i][j];
                    var tile = gameState["tile" + tileIndex];
                    // joker's score in initial meld is 0
                    if (tile.color !== "joker") {
                        score += tile.score;
                    }
                }
            }
            return score;
        }

        function getNextEmptySlotInBoard(board, start, slot_size) {
            //if (start.row > getGameBoardRows() ) {
            //    return null;
            //}
            var row = start.row;
            var col = start.col;
            var emptyCount = 0;
            for (var r = row; r < getGameBoardRows(); r++) {
                var colStart = (r === row) ? col : 0;
                for (var c = colStart; c < getGameBoardCols(); c++) {
                    if (board[r][c] === -1) {
                        emptyCount = 0;

                        for (var i = c; i < getGameBoardCols(); i++) {
                            if (board[r][i] !== -1) {
                                c = i + 1;
                                break;
                            }
                            emptyCount++;
                            if (c === 0 && emptyCount > slot_size) {
                                // need one empty cell on right side to separate with next
                                return {row: r, col: 0};
                            }
                            if (c !== 0 && emptyCount > slot_size + 1) {
                                // need one empty cell on both left side and right side
                                return {row: r, col:  c + 1};
                            }
                            if (i === getGameBoardCols() - 1 && emptyCount > slot_size) {
                                // need one empty cell on left side to separate set originally on left side
                                return {row: r, col: c + 1};
                            }
                        }
                        // continue in this row
                    }
                }
            }
            return null;
        }

        function findSetsInHand(tiles, state) {
            var remains = tiles;
            var sets = [];
            var groups = [];
            var runs = [];

            groups = findAllGroups(tiles, state);
            if (groups.length !== 0) {
                // group found in hand
                remains = getRemainTilesFromSets(tiles, groups);
                sets = sets.concat(groups);
            }
            runs = findAllRuns(remains, state);
            if (runs.length !== 0) {
                sets = sets.concat(runs);
                remains = getRemainTilesFromSets(remains, runs);
            }


            //if (option === "groupFirst") {
            //    groups = findAllGroups(tiles, state);
            //    if (groups.length !== 0) {
            //        // group found in hand
            //        remains = getRemainTilesFromSets(tiles, groups);
            //        sets = sets.concat(groups);
            //    }
            //    runs = findAllRuns(remains, state);
            //    if (runs.length !== 0) {
            //        sets = sets.concat(runs);
            //        remains = getRemainTilesFromSets(remains, runs);
            //    }
            //} else {
            //    // "runFirst" option
            //    runs = findAllRuns(tiles, state);
            //    if (runs.length !== 0) {
            //        remains = getRemainTilesFromSets(tiles, runs);
            //        sets = sets.concat(runs);
            //    }
            //    groups = findAllGroups(remains, state);
            //    if (groups.length !== 0) {
            //        sets = sets.concat(groups);
            //        remains = getRemainTilesFromSets(remains, groups);
            //    }
            //}
            return {sets: sets, remains: remains};
        }

        function getRemainTilesFromSets(tiles, sets) {
            var result = angular.copy(tiles);
            for (var i = 0; i < sets.length; i++) {
                for (var j = 0; j < sets[i].length; j++) {
                    var index = result.indexOf(sets[i][j]);
                    if (index !== -1) {
                        result.splice(index, 1);
                    }
                }
            }
            return result;
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
            var nPlayers = state.trace.nplayers;
            if (winnerIndex === -1 ) {
                for (var ii = 0; ii < nPlayers; ii++ ) {
                    result.push(0);
                }
            } else {
                var scoresFromAllLosers = 0;
                for (var i = 0; i < nPlayers; i++) {
                    // calculating score for each player who is not winner
                    if (i !== winnerIndex) {
                        var tilesRemaining = state.board[getPlayerRow(i)];
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
            }
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
                    //console.log("isMeldOk, invalid sets: [" + setsInBoard[ii] + "]");
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

        //function getAllSetsOnBoard(board, gameState) {
        //    var setsOnBoard = [];
        //    for (var row = 0; row < getGameBoardRows(); row++) {
        //
        //        var tileSet = [];
        //        for (var col  = 0; col < getGameBoardCols(); col++) {
        //            var tileIndex = board[row][col];
        //            if (tileIndex === -1) {
        //                // current set ends
        //                if (tileSet.length !== 0) {
        //                    var obj = {tileSet: tileSet, start: {row: row, col: col - tileSet.length}};
        //                    setsOnBoard.push(obj);
        //                    tileSet = [];
        //                }
        //            } else {
        //                check(tileIndex >= 0 && tileIndex < 106,
        //                    "tileIndex: " + tileIndex
        //                );
        //                tileSet.push(findTileFromGameStateByIndex(tileIndex, gameState));
        //            }
        //        }
        //        // in case last tileSet ends at last element of row
        //        if (tileSet.length !== 0) {
        //            setsOnBoard.push({tileSet: tileSet, start: {row: row, col: col - tileSet.length}});
        //        }
        //    }
        //    return setsOnBoard;
        //}

        /**
         * gets the score for player's initial meld.
         * In initial meld, only sets contain no tiles that from opponents can be calculated,
         * and joker's score is 0.
         *
         * @param state
         * @param setsInBoard
         * @param tilesSentThisTurn
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
         * check whether game is over.
         *
         * @param state
         * @returns {boolean}
         */
        function isGameOver(state) {
            return getWinner(state.board, state.deltas) !== -1 || isTie(state);
        }

        /**
         * get index of winning player. returns -1 if no player wins.
         * After game is on, player with no tiles left in hand is the winner.
         *
         * @param board
         * @param deltas
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
            return state.trace.nexttile >= 106;
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
            return CONFIG.GAME_BOARD_ROWS;
        }

        function getGameBoardCols() {
            return CONFIG.GAME_BOARD_COLS;
        }

        /**
         * get the array of tiles sent by player to board during current turn.
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

        /**
         *
         * @param playerHand
         * @param state
         * @returns {Array}
         */
        function findAllSetInHand(playerHand, state) {
            //if (playerHand.length === 0) {
            //    return playerHand;
            //}
            // try to find all groups in hand
            var hand = angular.copy(playerHand);

            // 1. find all groups in hand
            var groups = findAllGroups(hand, state);
            var handAfter = [];
            for (var i = 0; i < groups.length; i++) {
                //console.log("group: " + groups[i]);
                // append all valid groups
                handAfter = handAfter.concat(groups[i]);
            }
            // 2. get the rest tiles in hand
            var restTiles = [];
            for (var ii = 0; ii < hand.length; ii++) {
                if (handAfter.indexOf(hand[ii]) === -1) {
                    restTiles.push(hand[ii]);
                }
            }

            // 3. find all runs from the rest tiles in hand
            var runs = findAllRuns(restTiles, state);
            for (var j = 0; j < runs.length; j++) {
                //console.log("run: " + runs[j]);
                handAfter = handAfter.concat(runs[j]);
            }
            for (var k = 0 ; k < restTiles.length; k++) {
                if (handAfter.indexOf(restTiles[k]) === -1) {
                    handAfter.push(restTiles[k]);
                }
            }
            return handAfter;
        }

        /**
         *
         * @param tiles
         * @param state
         * @returns {Array} each array is array of valid run [[1,2,3],[4,5,6]]
         */
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
         *
         * @param type
         * @param state
         * @returns {Function}
         */
        function sortBy(type, state) {
            return function (tileIndexA, tileIndexB) {
                var tileA = state["tile" + tileIndexA];
                var tileB =  state["tile" + tileIndexB];
                if (type === "score") {
                    return tileA.score - tileB.score;
                } else {
                    // sort by "color"
                    return (tileA.color > tileB.color) ? 1 : (tileA.color < tileB.color) ? -1 : (tileA.score - tileB.score);
                }
            };
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
            getTilesSentToBoardThisTurn: getTilesSentToBoardThisTurn,

            createInitialMove: getInitialMove,
            createPickMove: getPickMove,
            createMeldMove: getMeldMove,
            createSingleUndoMove: getSingleUndoMove,
            createMoveMove: getMoveMove,
            createSortMove: getSortMove,
            createCombinedMove: getCombinedMove

        };

    }]);
}());
