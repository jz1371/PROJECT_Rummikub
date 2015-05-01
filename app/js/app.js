'use strict';

angular.module('myApp',['ngTouch', 'ui.bootstrap'])
    .constant("CONFIG", {
        GAME_BOARD_ROWS: 6,
        GAME_BOARD_COLS: 18,
        GAME_AREA_PADDING_PERCENTAGE: 0.02,

        SETTING: {
            verbose            : false,
            show_dragging_lines: true,
        }
    }
);
