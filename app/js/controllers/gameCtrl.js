/**
 * File: app/js/controllers/gameCtrl.js
 * ------------------------------------
 * @author: Jingxin Zhu
 * @date:   2015.03.10
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

        // to allow manipulating game state in e2e tests
        window.e2e_test_stateService = stateService;

        // to allow drag-n-drop move
        window.handleDragEvent = handleDragEvent;

        var debugMode = true;

        var gameBoardRows = 6;
        var gameBoardCols = 18;

        $scope.rows = 6;
        $scope.cols = 18;

        var animationEnded = false;
        var canMakeMove = false;
        var isComputerTurn = false;
        var state = null;
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

        function isWithinElement(x, y, element) {
            var offset = element.getBoundingClientRect();
            return x >= offset.left && x < offset.right
                && y >= offset.top && y <= offset.bottom;
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
                        draggingPiece.style['z-index'] = ++nextZIndex;
                        //$log.info("start: row: " + row + " col: " + col);
                        //$scope.boardCellClicked(row, col);


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
                        //draggingPiece.style = "";

                    }
                } else {
                    // Drag continue
                    //TODO:

                    if (pos) {
                        var container = getTileContainerSize(pos);
                        var originalContainer = getTileContainerSize(draggingStartedRowCol);

                        ////var size = {width: container.width,  height: container.height};
                        //$log.info("pos original left: " + originalContainer.left + " now left: " + container.left);

                        //draggingPiece.parentElement.style.left = topLeft.left;
                        //draggingPiece.parentElement.style.top = topLeft.top;
                        //draggingPiece.parentElement.style.position = "absolute";
                        //draggingPiece.parentElement.style['z-index'] = ++nextZIndex;


                        $scope.$apply(function () {
                            var tileIndex = $scope.board[draggingStartedRowCol.row][draggingStartedRowCol.col];
                            var tile = $scope.state['tile' + tileIndex];
                            $scope.tileIndex = tileIndex;
                            $scope.drag_color = tile.color;
                            $scope.drag_score = tile.score;
                            $scope.tile = tile;
                        });

                        $log.info("pos row" + pos.row + " col: " + pos.col);
                        draggingLines.style.display = "inline";
                        myDrag.style.display = "inline";
                        myDrag.style.width = container.width + "px";
                        myDrag.style.left = container.left + "px";
                        myDrag.style.paddingBottom= container.height + "px";
                        myDrag.style.top = container.top + "px";


                        var centerXY = {x: container.width / 2 + container.left, y: container.top + container.height / 2};
                        setDraggingLines(centerXY);

                        //var topLeft = {left:  (centerXY.x- originalContainer.left) + "px", top: (centerXY.y- originalContainer.top) + "px" };
                        var topLeft = {left:  (container.left - originalContainer.left) + "px", top: (container.top - originalContainer.top) + "px" };
                        //draggingPiece.style.left = topLeft.left;
                        //draggingPiece.style.top = topLeft.top;
                        //draggingPiece.style.position = "absolute";

                        //setDraggingPieceTopLeft(pos, draggingStartedRowCol);

                    }
                }
            }

            if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
                // drag ended
                // return the piece to it's original style (then angular will take care to hide it).
                //var topLeft = {left:  (container.left - originalContainer.left) + "px", top: (container.top - originalContainer.top) + "px" };
                //draggingPiece.style = "";
                //setDraggingPieceTopLeft(draggingStartedRowCol, draggingStartedRowCol);
                //draggingPiece.style.left = "0px";
                //draggingPiece.style.top = "0px";
                //draggingPiece.style.position = "relative";
                //draggingPiece.style = "";

                draggingLines.style.display = "none";
                myDrag.style.display = "none";

                draggingStartedRowCol = null;
                draggingPiece = null;
                //$log.info("boardAfter: " + $scope.board[draggingStartedRowCol.row][draggingStartedRowCol.col]);
            }
        }

        function setDraggingPieceTopLeft(curPos, originalPos) {
            var curSize = getTileContainerSize(curPos);
            var originalSize = getTileContainerSize(originalPos);
            var topLeft = {left: (curSize.left - originalSize.left) + "px", top: (curSize.top - originalSize.top) + "px" };
            draggingPiece.style.left = topLeft.left;
            draggingPiece.style.top = topLeft.top;
            draggingPiece.style.position = "absolute";
        }

        //function getSquareWidthHeight(element, rows, cols) {
        //    return {
        //        width: element.clientWidth / rows,
        //        height: element.clientHeight / cols
        //    };
        //}
        //
        //function getSquareTopLeft(element, row, col) {
        //    var size = getSquareWidthHeight(element);
        //    return {top: row * size.height, left: col * size.width};
        //}
        //
        //
        //function setDraggingPieceTopLeft(element, topLeft) {
        //    var originalSize = getSquareTopLeft(element, draggingStartedRowCol.row, draggingStartedRowCol.col);
        //    draggingPiece.style.left = (topLeft.left - originalSize.left) + "px";
        //    draggingPiece.style.top = (topLeft.top - originalSize.top) + "px";
        //}
        //
        //function setDraggingPieceTopLeft(topLeft) {
        //    var originalSize = getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col);
        //    draggingPiece.style.left = (topLeft.left - originalSize.left) + "px";
        //    draggingPiece.style.top = (topLeft.top - originalSize.top) + "px";
        //}

        function getTileContainerSize(pos) {
            if (pos) {
                var row = pos.row;
                var col = pos.col;
                if ( ((row >= 0 && row < gameBoardRows)              // from game board
                    || row == (gameBoardRows + $scope.turnIndex))    // from player's hand
                    &&  col >= 0 && col < $scope.board[row].length )
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

        function getDraggingTilePosition(clientX, clientY) {
            var x = clientX - boardPanel.parentElement.offsetLeft;
            var y = clientY - boardPanel.offsetTop;
            var row = -1;
            var col = -1;
            if (x > 0 && y > 0 && x < boardPanel.clientWidth && y < boardPanel.clientHeight) {
                // dragging in board panel
                $log.info("width: " + boardPanel.clientWidth);
                $log.info("x: " + x);
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

                    //TODO: better way to find length?
                    var liElement = document.getElementsByTagName("LI");
                    var width = liElement[0].clientWidth * liElement.length;
                    col = Math.floor( $scope.board[row].length  * x / width);
                    $log.info("x: " + x);
                    $log.info("row: " + row);
                    $log.info("col: " + col);
                }
            }
            //$log.info("board here: " + "row: " + row + " col: " + col);
            return (row !== -1) ? {row: row, col: col} : null ;
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
                    $$scope.debug = e.message;
                    return;
                }
            });
        }


        function sendComputerMove() {
            var items = gameLogicService.getPossibleMoves($scope.state, $scope.turnIndex);
            gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
            $scope.debug = "computer picks one tile";
            $scope.turnInfo = "Your turn";
        }

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
            if (isEmptyObj(params.stateAfterMove) && params.stateBeforeMove === null) {
                var playerIndex = 0;
                var nPlayers = 2;
                //var nPlayers = params.playersInfo.length;
                try {
                    var move = gameLogicService.createInitialMove(playerIndex, nPlayers);
                    /* let player0 initializes the game. */
                    params.yourPlayerIndex = 0;
                    gameService.makeMove(move);
                } catch (e) {

                }
                return;
            }




            $scope.isYourTurn = params.turnIndexAfterMove >=0 &&          // -1 means game end, -2 means game viewer
            params.yourPlayerIndex === params.turnIndexAfterMove;     // it's my turn
            turnIndex = params.turnIndexAfterMove;

            $scope.turnIndex = params.turnIndexAfterMove;
            $scope.state = params.stateAfterMove;
            $scope.board = params.stateAfterMove.board;
            $scope.nexttile = params.stateAfterMove.trace.nexttile;
            $scope.playerHand = $scope.board[$scope.rows + $scope.turnIndex];

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

        $scope.pickBtnClicked = function() {
            if ($scope.isYourTurn) {
                console.log("next: " + $scope.nexttile);
                try {
                    var move = gameLogicService.createPickMove($scope.turnIndex, $scope.state);
                    gameService.makeMove(move);
                    $scope.debug = "pick one tile";
                } catch (e) {
                    $scope.debug = e.message;
                    $log.info(e);
                }
            }
        };

        $scope.meldBtnClicked = function() {
            if ($scope.isYourTurn) {
                try {
                    var move = gameLogicService.createMeldMove($scope.turnIndex, $scope.state);
                    gameService.makeMove(move);
                } catch (e) {
                    $scope.debug = e.message;
                    $log.info(e);
                    //$window.alert(e);
                }
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
