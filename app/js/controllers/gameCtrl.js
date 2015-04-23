/**
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
    angular.module('myApp')
        .config(['$translateProvider', function($translateProvider) {
            'use strict';
            $translateProvider.init(['en', 'de']); }])
        .controller('GameCtrl', [
        '$scope', '$log', '$window', '$animate', '$timeout',
        'stateService', 'gameService', 'gameLogicService', 'gameAIService', 'CONSTANT',
        function($scope, $log, $window,  $animate, $timeout,
                 stateService ,gameService, gameLogicService, gameAIService, CONSTANT) {

            /**************************************************************
             **********************   Configuration  **********************
             **************************************************************/
            // whether output information to console
            var verbose = false;

            // whether show dragging lines while dragging
            var showDraggingLines = true;

            // enable to manipulate game state in e2e tests
            window.e2e_test_stateService = stateService;

            // enable platform's drag-n-drop listener
            window.handleDragEvent = handleDragEvent;

            $scope.gameAreaPaddingPercent = CONSTANT.GAME_AREA_PADDING_PERCENTAGE;

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

            var gameBoardRows = CONSTANT.GAME_BOARD_ROWS;
            var gameBoardCols = CONSTANT.GAME_BOARD_COLS;

            $scope.rows = gameBoardRows;
            $scope.cols = gameBoardCols;

            //var canMakeMove = false;
            var isComputerTurn = false;
            //var state = null;
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
                    dragContinueHandler(pos, clientX, clientY);
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
                            var msg = "Dragged to " + to.row + "x" + to.col;
                            logout(msg);
                            $scope.msg = msg;
                        }catch(e) {
                            // illegal move, restore
                            logout(e.message);
                            /* return immediately! */
                            $scope.debug = e.message;
                            return;
                        }
                    });
                }
            }

            function dragContinueHandler(pos, clientX, clientY) {
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

                    myDrag.style.left = container.left + "px";
                    myDrag.style.paddingBottom= container.height + "px";
                    myDrag.style.top = container.top + "px";

                    var centerXY = {
                        //TODO: better to determine center x
                        x: container.left + container.width / 2 - document.getElementById("game").clientWidth * $scope.gameAreaPaddingPercent,
                        y: container.top  + container.height / 2};
                    logout("centerXY: " + centerXY.x);

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
                logout("row: " + row);
                logout("col: " + col);
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

            function updateUI(params) {

                $scope.isYourTurn = params.turnIndexAfterMove >=0 &&          // -1 means game end, -2 means game viewer
                params.yourPlayerIndex === params.turnIndexAfterMove;         // it's my turn

                // make initial move only when its player's turn
                if (isEmptyObj(params.stateAfterMove) && $scope.isYourTurn) {
                    //var nPlayers = params.playersInfo.length;
                    var nPlayers = 2;
                    try {
                        var move = gameLogicService.createInitialMove(nPlayers);
                        /* let player0 initializes the game. */
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

                    // disable sort feature when empty slots left in board
                    // because sort will reset player hand
                    $scope.sortDisabled = false;
                    for (var i = 0; i < $scope.playerHand.length; i++) {
                        if ($scope.playerHand[i] === -1) {
                            $scope.sortDisabled = true;
                            break;
                        }
                    }
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
                    sendComputerMove();

                    //$timeout(sendComputerMove, 1000);
                    //$scope.debug = "Computer makes pick move";
                }

                if (undoAllInProcess && $scope.state.deltas.length === 0) {
                    undoAllInProcess = false;
                }

                if (undoAllInProcess && $scope.state.deltas.length !== 0) {
                    $scope.undoBtnClicked();
                }

            }

            $scope.boardCellClicked =  function (row, col) {
                logout(["Clicked on cell:", row, col]);
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
            $scope.pickBtnClicked = function () {
                if ($scope.isYourTurn) {
                    try {
                        var move = gameLogicService.createPickMove($scope.turnIndex, $scope.state);
                        gameService.makeMove(move);
                        // reset sort
                        $scope.sortType = "sort";
                        $scope.debug = "pick one tile";
                    } catch (e) {
                        logout(e.stack);
                        $scope.debug = e.message;
                    }
                }
            };

            $scope.meldBtnClicked = function () {
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
                    } catch (e) {
                    }
                }
            };

            $scope.undoAllBtnClicked = function () {
                if ($scope.isYourTurn) {
                    undoAllInProcess = true;
                    $scope.undoBtnClicked();
                }
            };

            $scope.sortType = "sort";
            $scope.setSortTypeBtnClicked = function () {
                if (gameEnd) {
                    return;
                }
                var type = $scope.sortType;
                //var playerRow = getCurrentPlayerRow();
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
                    logout(e);
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

            $scope.getHandTilesRange = function() {
                if ($scope.board === undefined) {
                    return [];
                }
                var len = $scope.board[CONSTANT.GAME_BOARD_ROWS + $scope.turnIndex].length;
                var result = [];
                for (var i = 0; i < len; i++) {
                    result.push(i);
                }
                return result;
            };

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
