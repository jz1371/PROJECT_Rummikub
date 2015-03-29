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

        //console.log("height: " + window.innerWidth);
        //resizeGameAreaService.setWidthToHeight(0.6);
        $scope.rows = 6;
        $scope.cols = 18;

        var animationEnded = false;
        var canMakeMove = false;
        var isComputerTurn = false;
        var state = null;
        var turnIndex = null;
        var playerHand = null;


        window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

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
            if (isEmptyObj(params.stateAfterMove)) {
                var playerIndex = 0;
                var nPlayers = 2;
                //var nPlayers = params.playersInfo.length;
                var move = gameLogicService.createInitialMove(playerIndex, nPlayers);
                /* let player0 initializes the game. */
                params.yourPlayerIndex = 0;
                gameService.makeMove(move);
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
            $log.info('dafasf');
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
                    $scope.debug = "cannot meld";
                    $log.info(e);
                    $window.alert(e);
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
            if ($scope.isYourTurn &&  getTileByIndex(tileIndex) !== undefined) {
                return true;
            }
            return false;
        };

        $scope.getTileScore = function(tileIndex) {
            var tile = getTileByIndex(tileIndex);
            if (tile !== undefined) {
                return tile.score;
            } else {
                return "";
            }
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
