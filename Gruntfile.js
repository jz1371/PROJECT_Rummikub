module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                strict: true,
                undef: true,
                unused: true,
                bitwise: true,
                forin: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                notypeof: true,
                jasmine: true,
                jquery: true,
                globals: {
                    module: false, // for Gruntfile.js
                    exports: false, // for protractor.conf.js
                    inject: false, // testing angular
                    angular: false,
                    console: false,
                    browser: false, element: false, by: false, // Protractor
                },
            },
            all: ['Gruntfile.js', 'test/karma.conf.js', 'test/protractor.conf.js',
                'app/js/*/*.js','test/unit/*.js' ,'test/e2e/*tests.js','languages/*.js']
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                background: true,
                singleRun: false
            }
        },
        // Run karma and watch files using:
        // grunt karma:unit:start watch
        watch: {
            files: ['app/js/*/*.js'],
            tasks: ['jshint', 'karma:unit:run']
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                // Order is important! app.js should be the first to initialize angular app
                src: ['app/js/app.js','app/js/*/*.js'],
                dest: 'app/dist/everything.js',
            },
        },
        uglify: {
            options: {
                sourceMap: true,
            },
            my_target: {
                files: {
                    'app/dist/everything.min.js': ['app/dist/everything.js'],
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'app/game.min.html': ['app/game.html']
                }
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: 'app',
                    cache: [
                        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
                        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min.js',
                        'http://yoav-zibin.github.io/emulator/dist/gameServices.min.js',
                        'http://yoav-zibin.github.io/emulator/dist/dragAndDropListeners.min.js',
                        'js/languages/en.js',
                        'http://yoav-zibin.github.io/emulator/angular-translate/angular-translate.2.6.1.min.js',
                        'dist/everything.min.js',
                        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
                        'http://yoav-zibin.github.io/emulator/main.css',
                        'css/app.css',
                        'css/tile.css',
                        'css/responsive.css',
                        'css/main.css',
                        'css/game.css',
                        'img/favicon.ico',
                        'img/game-background.jpg',
                        'img/joker-red.png',
                        'img/valid.png',
                        'img/valid-runs.png',
                        'img/valid-groups.png',
                        'img/valid-joker.png',
                        'img/valid-run2.png',
                        'template/help.html'
                    ],
                    network: ['languages/zh.js','dist/everything.min.js.map', 'dist/everything.js'],
                    timestamp: true
                },
                dest: 'app/game.appcache',
                src: []
            }
        },
        'http-server': {
            'dev': {
                // the server root directory
                root: '.',
                port: 1371,
                host: "0.0.0.0",
                cache: 1,
                showDir : true,
                autoIndex: true,
                // server default file extension
                ext: "html",
                // run in parallel with other tasks
                runInBackground: true
            }
        },
        protractor: {
            options: {
                configFile: "test/protractor.conf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {
                    // Arguments passed to the command
                }
            },
            all: {}
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-protractor-runner');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'karma',
        'concat', 'uglify',
        'processhtml', 'manifest',
        'http-server', 'protractor']);

    grunt.registerTask('factory',['concat', 'uglify','processhtml','manifest']);

};