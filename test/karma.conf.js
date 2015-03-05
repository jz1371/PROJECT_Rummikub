module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
<<<<<<< HEAD
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

=======
      // use web service, so no local npm dependency required
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-mocks.js',

      'app/js/services/*.js',
      'test/unit/**/gameLogicServiceSpec.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
    // source files, that you wanna generate coverage for
    // do not include tests or libraries
    // (these files will be instrumented by Istanbul)
        'app/js/services/gameLogicService.js': ['coverage']
    },

    coverageReporter: {
        type : 'html',
        dir : 'coverage/'
    },

>>>>>>> master
    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
