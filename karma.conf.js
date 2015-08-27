module.exports = function(config){
    config.set({
        basePath: __dirname,
        files: [
            'src/index.js',
            'specs/**/*.js'
        ],
        exclude: [],
        preprocessors: {
            'src/*.js': ['coverage']
        },

        reporters: ['story', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: 'specs/results/coverage'
        },

        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        logLevel: config.LOG_INFO
    });
};