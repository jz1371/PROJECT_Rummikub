/**
 * File: app/js/app.js
 * ------------------------------------------------
 * Starting point for application and configuration
 * @author: Jingxin Zhu
 * @date  : 2015.05.10
 *
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
