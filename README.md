## Game Rummikub
#### game project for NYU social multiplayer games (2015 Spring)

1. HW1 introduction

2. [[HW2](http://github.com/jz1371/PROJECT_Rummikub/tree/hw2)] implement `isMoveOK`.
   please see source file `gameLogicService.js`.

3. [[HW3](http://github.com/jz1371/PROJECT_Rummikub/tree/hw3)]  write unit tests for game logic. To run unit tests: (assuming node has been installed at the root directory of project)

    ```bash
    npm install karma karma-jasmine karma-chrome-launcher karma-coverage  --save-dev
    ./node_modules/karma/bin/karma start
    ```
4. [[HW4](http://github.com/jz1371/PROJECT_Rummikub/tree/hw4)] implement `getPossibleMoves` in gameLogicService.js
    * peer review for [Backgammon](https://github.com/ibtawfik/Backgammon/commit/c1a68db3284487c23a6468614023fe01b40fe7bc)
    * peer review for [Halatafl](https://github.com/ColinZang/Halatafl/tree/master/PeerReview_jz)

5. [[HW5](http://github.com/jz1371/PROJECT_Rummikub/tree/hw5)] game graphics
   * github io pages: [http://jz1371.github.io/PROJECT_Rummikub/app/game.html](http://jz1371.github.io/PROJECT_Rummikub/app/game.html)

6. [[HW6](http://github.com/jz1371/PROJECT_Rummikub/tree/hw6)] e2e tests for game and use of Gruntfile. 
 After cd to the root of project
   ```bash
   sudo npm install
   sudo npm install -g grunt-cli
   ./node_modules/http-server/bin/http-server --cors -a localhost -p 1371
   ./node_modules/protractor/bin/webdriver-manager update
   ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update
   cd test
    ../node_modules/protractor/bin/protractor protractor.conf.js
   ```

7. [[HW7](http://github.com/jz1371/PROJECT_Rummikub/tree/hw7)]
   * Drag and drop on game board
   * some animations
   * create appcache

8. [[HW8](http://github.com/jz1371/PROJECT_Rummikub/tree/hw8)] add AI and AI test for game
   See source file
   * `app/js/services/gameAIServic.js`.
   * `app/js/services/gameLogicServic.js`.
   * `test/unit/gameAIServiceSpec.js`.

