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
    angular.module('myApp').controller('GameCtrl', [
        '$scope', '$log', '$window', '$animate', '$timeout',
        'stateService', 'gameService', 'gameLogicService', 'gameAIService', 'CONSTANT',
        function($scope, $log, $window,  $animate, $timeout,
                 stateService ,gameService, gameLogicService, gameAIService, CONSTANT) {

            /***************************************************************
             *   Configuration  */
            var verbose = false;

            var showDraggingLines = true;

            function logout(log, obj) {
                if (verbose) {
                    if (obj === undefined && obj === true) {
                        console.log(JSON.stringify(log, null));
                    } else {
                        console.log(log);
                    }
                }
            }

            // to allow manipulating game state in e2e tests
            window.e2e_test_stateService = stateService;

            // to allow drag-n-drop move
            window.handleDragEvent = handleDragEvent;

            var debugMode = true;
            var gameEnd = false;

            var gameBoardRows = CONSTANT.GAME_BOARD_ROWS;
            var gameBoardCols = CONSTANT.GAME_BOARD_COLS;

            $scope.rows = gameBoardRows;
            $scope.cols = gameBoardCols;

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
            //var hand = document.getElementById("hand-ul");

            var clickRow = -1;
            var clickCol = -1;

            //var computerMoves = [];

            var undoAllInProcess = false;

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
                        dragStartHandler(pos);
                    }
                    if (!draggingPiece) {
                        return;
                    }
                    if (type === "touchend") {
                        if (pos) {
                            var from = draggingStartedRowCol;
                            var to = {row: pos.row, col: pos.col};
                            dragEndHandler(from, to);
                        }
                    } else {
                        // Drag continue
                        dragContinueHandler(pos, clientX, clientY);
                    }
                }

                if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
                    draggingLines.style.display = "none";
                    myDrag.style.display = "none";

                    draggingStartedRowCol = null;
                    draggingPiece = null;
                }
            }

            function dragStartHandler(pos) {
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

            function dragContinueHandler(pos, clientX, clientY) {
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

                    myDrag.style.display = "inline";
                    myDrag.style.width = container.width + "px";

                    var gameAreaLeft = container.left - gameArea.offsetLeft;
                    myDrag.style.left = gameAreaLeft + "px";
                    //logout("drag left: " + myDrag.style.left);
                    //logout("game left: " + gameAreaLeft);
                    myDrag.style.paddingBottom= container.height + "px";
                    myDrag.style.top = container.top + "px";

                    var centerXY = {x: container.width / 2 + gameAreaLeft - 15, y: container.top + container.height / 2};
                    var tile = document.getElementById("MyPiece6x0");
                    logout("tile: " + JSON.stringify(tile.getBoundingClientRect(), null));
                    var handUl = document.getElementById("hand-panel");
                    logout("parent: " + JSON.stringify(handUl.getBoundingClientRect(), null));
                    logout("center: " + printObject(centerXY));
                    logout("container: " + printObject(container));
                    logout("point: " + clientX + ", " + clientY);
                    logout("gameArea" + printObject(gameAreaLeft));

                    setDraggingLines(centerXY);

                }
            }

            function printObject(obj) {
                return JSON.stringify(obj, null, 4);
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
                logout("padding: " + board.style.paddingLeft);
                //TODO: minus the real padding-left
                var x = clientX - boardPanel.parentElement.offsetLeft - 15;
                var y = clientY - boardPanel.offsetTop;
                var row = -1;
                var col = -1;
                if (x > 0 && y > 0 && x < boardPanel.clientWidth && y < boardPanel.clientHeight) {
                    // dragging in board panel
                    //logout("width: " + boardPanel.clientWidth);
                    //logout("x: " + x);
                    row = Math.floor(gameBoardRows * y / (boardPanel.clientHeight));
                    col = Math.floor(gameBoardCols * x / (boardPanel.clientWidth - 30));
                    logout("row: " + row);
                    logout("col: " + col);
                } else {
                    // clicking player hand area?

                    var handUl = document.getElementById("hand-ul");
                    //var container = handUl.getBoundingClientRect();

                    var windowOffset = handUl.getBoundingClientRect();
                    x = clientX - windowOffset.left;
                    y = clientY - windowOffset.top;
                    if (x > 0 && y > 0 && x < handPanel.clientWidth && y < handPanel.clientHeight) {
                        //row = gameBoardRows + $scope.turnIndex +  Math.floor(gameBoardRows * y / handPanel.clientHeight);
                        row = gameBoardRows + $scope.turnIndex;
                        logout("handaaL:   " + handPanel.clientWidth);
                        logout("handul: " + windowOffset.width);
                        col = Math.floor($scope.board[row].length * x / windowOffset.width);
                        logout("row: " + row);
                        logout("col: " + col);
                    }
                }
                return row !== -1 ? {row: row, col: col} : null ;
            }

            function dragEndHandler(from, to) {
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

                //if (computerMovesInProcess === false) {
                //    var deltas = gameAIService.createComputerMove($scope.turnIndex, $scope.state);
                //    if (deltas.length === 0) {
                //        // has to pick one more tile
                //        gameService.makeMove(gameLogicService.createPickMove($scope.turnIndex, $scope.state));
                //    } else {
                //        computerDeltas = deltas;
                //        computerMovesInProcess = true;
                //    }
                //}
                //
                //if (computerMovesInProcess === true) {
                //    if (computerDeltas.length > 0 ) {
                //        var delta = computerDeltas[0];
                //        var move = gameLogicService.createMoveMove($scope.turnIndex, $scope.state, delta);
                //        gameService.makeMove(move);
                //        computerDeltas.splice(0, 1);
                //    } else {
                //        // make a meld move
                //        gameService.makeMove(gameLogicService.createMeldMove($scope.turnIndex, $scope.state));
                //        computerMovesInProcess = false;
                //    }
                //}

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
                        logout(e.message);
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
                            clickRow = row;
                            clickCol = col;
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

                        //var rest = gameLogicService.test($scope.turnIndex, $scope.state);
                        //logout("rest: " + rest);

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
                //maxNumberOfPlayers: 4, // if bug in stateService fixed
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogicService.isMoveOk,
                updateUI: updateUI
            });

        }]);
}());
