/**
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
