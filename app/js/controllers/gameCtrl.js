/**
 * File: app/js/controllers/gameCtrl.js
 * @author:
 * @date:
 */

(function() {
    'use strict';
    angular.module('myApp').controller('GameCtrl',
    ['$scope', '$log', '$animate', '$timeout', 'gameService', 'gameLogicService','resizeGameAreaService',
    function($scope, $log, $animate, $timeout, gameService, gameLogicService ,resizeGameAreaService) {

        resizeGameAreaService.setWidthToHeight(1);

        function sendComputerMove() {
            var items = gameLogicService.getPossibleMoves($scope.state, $scope.turnIndex);
            gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
            console.log("here");
            $scope.info = "computer picks one tile";
            $scope.turnInfo = "Your turn";
        }

        function updateUI(params) {

            // initialize move
            if (isEmptyObj(params.stateAfterMove)) {
                var playerIndex = 0;
                var nPlayers = 2;
                var move = gameLogicService.getInitialMove(playerIndex, nPlayers);
                gameService.makeMove(move);
                return;
            }

            $scope.state = params.stateAfterMove;
            $scope.turnIndex = params.turnIndexAfterMove;
            $scope.board = params.stateAfterMove.board;
            $scope.opponent_top = params.stateAfterMove["player" + (1 - $scope.turnIndex)].tiles;
            $scope.curPlayer = params.stateAfterMove["player" + $scope.turnIndex].tiles;
            $scope.isYourTurn = (params.yourPlayerIndex === params.turnIndexAfterMove);
            $scope.nexttile = params.stateAfterMove.nexttile;

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

        $scope.boardCellClicked = function (row, col) {
            $log.info(["Clicked on cell:", row, col]);
            $scope.info = "click board cell: (" + row + "," + col + ")";
            if ( !$scope.isYourTurn ) {
                return false;
            }
            try {
                if ($scope.activeTile === undefined) {
                    // either replace move or send move
                    if ($scope.board[row][col] !== -1) {
                        $scope.activeOrigin = 'board';
                        $scope.activeTile = $scope.board[row][col];
                        $scope.from = {row: row, col: col};
                        $scope.info = "picking tile: "
                        +  getTileByIndex($scope.activeTile).color
                        + "," + getTileByIndex($scope.activeTile).score
                        + " from: (" + row + "," + col + ")";
                    }
                } else {
                    if ($scope.activeOrigin === 'board') {
                        // 'replace' move
                        var from = $scope.from;
                        var to = {row: row, col: col};
                        var move = gameLogicService.getReplaceMove($scope.state, $scope.turnIndex, from, to);
                        gameService.makeMove(move);
                    } else if ($scope.activeOrigin === 'curPlayer') {
                        // 'send' move
                        var to = {tile: $scope.activeTile, row: row, col: col};
                        var move = gameLogicService.getSendMove($scope.state, $scope.turnIndex, to);
                        $scope.isYourTurn = false; // to prevent making another move
                        gameService.makeMove(move);
                    }
                    $scope.info = "tile: ("
                    +  getTileByIndex($scope.activeTile).color
                    + "," + getTileByIndex($scope.activeTile).score
                    + ") to: (" + row + "," + col + ")";
                    clearActiveTile();
                }
            } catch (e) {
                //$log.info(["Cell is already full in position:", row, col]);
                clearActiveTile();
                return false;
            }
        };

        $scope.shouldShowTileOnBoard = function (row, col) {
            // -1 stands for empty position on board
            //return $scope.board[row][col] !== -1;
            return true;
        };

        $scope.isJoker = function(tileIndex) {
            var tile = getTileByIndex(tileIndex);
            return tile !== undefined && tile.color === 'joker';
        }

        /* Select one tile */
        $scope.tileClicked= function(tileIndex) {
            if ($scope.isYourTurn) {
                $scope.activeTile = tileIndex;
                $scope.activeOrigin = "curPlayer";
                console.log("clicked tile: " + tileIndex);
                $scope.info = ("picking tile: " + getTileByIndex(tileIndex).color + "," + getTileByIndex(tileIndex).score);

            }
        };

        $scope.curPlayerAreaClicked = function() {
            if ($scope.activeTile !== undefined && $scope.activeOrigin === 'board' && $scope.from !== undefined) {
                // 'retrieve' move
                var from = $scope.from;
                try {
                    var move = gameLogicService.getRetrieveMove($scope.state, $scope.turnIndex, from);
                    gameService.makeMove(move);
                } catch (e) {
                }
                clearActiveTile();
            }
        }

        $scope.pickBtnClicked = function() {
            if ($scope.isYourTurn) {
                console.log("next: " + $scope.nexttile);
                try {
                    var move = gameLogicService.getPickMove($scope.state, $scope.turnIndex);
                    gameService.makeMove(move);
                    $scope.info = "pick one tile";
                } catch (e) {
                    $scope.info = "cannot pick when tiles sent to board";
                }
            }
        }

        $scope.meldBtnClicked = function() {
            try {
                var move = gameLogicService.getMeldMove($scope.state, $scope.turnIndex);
                gameService.makeMove(move);
            } catch (e) {
                $scope.info = "cannot meld";
            }
        }

        //TODO: only need tile's color here
        $scope.getTileDataValue = function(tileIndex) {
            var dataValue = "";
            var tile = getTileByIndex(tileIndex);
            if ( tile !== undefined) {
                dataValue = tile.color + " " + tile.score;
            }
            return dataValue;
        };

        $scope.canDrag = function (tileIndex) {
            if ($scope.isYourTurn &&  getTileByIndex(tileIndex) != undefined) {
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
        function sortTiles() {
        }



        /* ================= Helper Functions =================== */
        function isEmptyObj(obj) {

            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
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

        function clearActiveTile() {
            $scope.activeTile = undefined;
            $scope.activeOrigin = undefined;
            $scope.from = undefined;
        }

        gameService.setGame( {
            gameDeveloperEmail: "jz1371@nyu.edu",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 4,
            isMoveOk: gameLogicService.isMoveOk,
            updateUI: updateUI
        });

    }]);
}());
