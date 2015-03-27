/**
 * File: app/js/controllers/gameCtrl.js
 * @author:
 * @date:
 */

(function() {
    'use strict';
    angular.module('myApp').controller('GameCtrl',
    ['$scope', '$log', '$window', '$animate', '$timeout', 'stateService', 'gameService', 'gameLogicService',
    function($scope, $log, $window,  $animate, $timeout, stateService ,gameService, gameLogicService ) {

        //console.log("height: " + window.innerWidth);
        //resizeGameAreaService.setWidthToHeight(0.6);
        $scope.rows = 6;
        $scope.cols = 18;

        window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

        function sendComputerMove() {
            var items = gameLogicService.getPossibleMoves($scope.state, $scope.turnIndex);
            gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
            console.log("here");
            $scope.debug = "computer picks one tile";
            $scope.turnInfo = "Your turn";
        };

        function updateUI(params) {

            // initialize move
            if (isEmptyObj(params.stateAfterMove)) {
                var playerIndex = 0;
                var nPlayers = 2;
                var move = gameLogicService.getInitialMove(playerIndex, nPlayers);
                /* let player0 initializes the game. */
                params.yourPlayerIndex = 0;
                gameService.makeMove(move);
                return;
            }

            $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing , -1 means game is over
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
            $scope.turnIndex = params.turnIndexAfterMove;

            if ($scope.isYourTurn) {
                $scope.board = params.stateAfterMove.board;
                $scope.state = params.stateAfterMove;
                var opponentIndex = 1 - $scope.turnIndex;
                $scope.opponent_top = params.stateAfterMove["player" + opponentIndex].tiles;
                $scope.curPlayer = params.stateAfterMove["player" + $scope.turnIndex].tiles;
                $scope.nexttile = params.stateAfterMove.nexttile;
            }

            // Is it the computer's turn?
            if ($scope.isYourTurn &&
                params.playersInfo[params.yourPlayerIndex].playerId === '') {
                $scope.isYourTurn = false; // to make sure the UI won't send another move.
                // Waiting 0.5 seconds to let the move animation finish; if we call aiService
                // then the animation is paused until the javascript finishes.
                $timeout(sendComputerMove, 500);
            }

        }

        //window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

        /* Select one tile from player's hand */
        $scope.tileClicked= function(tileIndex) {
            if ($scope.isYourTurn) {
                if ($scope.activeTile !== undefined && $scope.activeOrigin === 'board' && $scope.from !== undefined) {
                    // if one tile inside board is activated then we are expecting a 'retrieve' move
                    var from = $scope.from;
                    try {
                        var move = gameLogicService.getRetrieveMove($scope.state, $scope.turnIndex, from);
                        gameService.makeMove(move);
                    } catch (e) {
                    }
                    clearActiveTile();
                } else {
                    $scope.activeTile = tileIndex;
                    $scope.activeOrigin = "curPlayer";
                    $scope.debug = "picking Tile" + tileIndex + " (" +  getTileByIndex(tileIndex).color + "," + getTileByIndex(tileIndex).score + ")";
                }
            }
        };

        $scope.boardCellClicked = function (row, col) {
            $log.info(["Clicked on cell:", row, col]);
            $scope.debug = "click board cell: (" + row + "," + col + ")";
            if ( !$scope.isYourTurn ) {
                return false;
            }
            try {
                if ($scope.activeTile === undefined) {
                    if ($scope.board[row][col] !== -1) {
                        // clicking an position occupied by tile
                        $scope.activeOrigin = 'board';
                        $scope.activeTile = $scope.board[row][col];
                        $scope.from = {row: row, col: col};
                        $scope.debug = "picking Tile" + $scope.activeTile + " (" +
                        getTileByIndex($scope.activeTile).color +
                        "," + getTileByIndex($scope.activeTile).score +
                        " from: (" + row + "," + col + ")";
                    }
                } else {
                    var to = {};
                    var move;
                    if ($scope.activeOrigin === 'board') {
                        // one tile on board has been activated before, so we are expecting a 'replace' move
                        var from = $scope.from;
                        to = {row: row, col: col};

                        // may 'replace' itself
                        if (angular.equals(from, to)) {
                            return false;
                        }

                        move = gameLogicService.getReplaceMove($scope.state, $scope.turnIndex, from, to);
                        gameService.makeMove(move);

                    } else if ($scope.activeOrigin === 'curPlayer') {
                        // one tile in player's hand has been activated, so we are expecting a 'send' move
                        to = {tile: $scope.activeTile, row: row, col: col};
                        move = gameLogicService.getSendMove($scope.state, $scope.turnIndex, to);
                        $scope.isYourTurn = false; // to prevent making another move
                        gameService.makeMove(move);
                        //$log.info("tile: " + $scope.board[row][col]);
                        $scope.debug = "here";
                    }
                    $scope.debug = "Tile" + $scope.activeTile + " (" +
                    getTileByIndex($scope.activeTile).color +
                    "," + getTileByIndex($scope.activeTile).score +
                    ") to: (" + row + "," + col + ")";
                    clearActiveTile();
                }

            } catch (e) {
                //$log.info(["Cell is already full in position:", row, col]);
                clearActiveTile();
                return false;
            }
        };

        $scope.curPlayerAreaClicked = function() {
            if (!$scope.isYourTurn) {
                return;
            }
            $scope.debug = $scope.activeOrigin + " , " + $scope.activeTile + "," + $scope.from;
            //$scope.debug = "adaf";
            if ($scope.activeTile !== undefined && $scope.activeOrigin === 'board' && $scope.from !== undefined) {
                // if one tile inside board is activated then we are expecting a 'retrieve' move
                var from = $scope.from;
                try {
                    var move = gameLogicService.getRetrieveMove($scope.state, $scope.turnIndex, from);
                    gameService.makeMove(move);
                } catch (e) {
                }
                clearActiveTile();
            }
            //$scope.debug = "here also";
        };

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
                    var move = gameLogicService.getPickMove($scope.state, $scope.turnIndex);
                    gameService.makeMove(move);
                    $scope.debug = "pick one tile";
                } catch (e) {
                    $scope.debug = "cannot pick when tiles sent to board";
                }
            }
        };

        $scope.meldBtnClicked = function() {
            if ($scope.isYourTurn) {
                try {
                    var move = gameLogicService.getMeldMove($scope.state, $scope.turnIndex);
                    gameService.makeMove(move);
                } catch (e) {
                    $scope.debug = "cannot meld";
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
