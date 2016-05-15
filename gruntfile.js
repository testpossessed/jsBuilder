module.exports = function(grunt) {
    grunt.initConfig({
        pkg:            grunt.file.readJSON('package.json'),
        bumpup:         {
            files: ['bower.json',
                    'package.json']
        },
        nugetpack:      {
            dist: {
                src:  'package.nuspec',
                dest: './'
            }
        },
        nugetpush:      {
            dist: {
                src:     './*.nupkg',
                options: {
                    apiKey: '2781783d-6886-43bd-91a7-5c2809e62661'
                }
            }
        },
        clean:          {
            nuget: './*.nupkg'
        },
        jasmine_nodejs: {
            options: {
                specNameSuffix: 'Spec.js',
                useHelpers:     false
            },
            nodemodule:     {
                options: {
                    reporters: {
                        console: {
                            colors:     true,
                            cleanStack: true,
                            verbose:    true
                        }
                    }
                },
                specs:   './specs/*.js'
            },
        },
        uglify:         {
            options: {
                compress: {},
                mangle:   true,
                beautify: false
            },
            lib:     {
                src:  ['src/index.js'],
                dest: 'jsBuilder.min.js'
            }
        },
        copy:           {
            main: {
                files: [
                    {
                        expand:  true,
                        cwd:     'src',
                        src:     ['index.js'],
                        filter:  'isFile',
                        flatten: true,
                        rename:  function(dest, src) {
                            return 'jsBuilder.js';
                        }
                    },
                    {
                        expand:  true,
                        cwd:     'src',
                        src:     ['index.js'],
                        dest:    './',
                        filter:  'isFile',
                        flatten: true
                    }
                ]
            }
        },
        karma:          {
            browser: {
                configFile: 'karma.conf.js',
                background: true,
                autoWatch:  false,
                singleRun:  false
            }
        },
        watch:          {
            all:   {
                files: [
                    'specs/*.js',
                    'src/index.js'
                ],
                tasks: ['karma:browser:run',
                        'jasmine_nodejs',
                        'uglify',
                        'copy']
            },
            grunt: {
                files: ['gruntfile.js', 'karma.conf.js']
            }
        }
    });
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('default', ['karma',
                                   'jasmine_nodejs',
                                   'uglify',
                                   'copy',
                                   'watch']);
    grunt.registerTask('test', ['karma',
                                'jasmine_nodejs']);
    grunt.registerTask('nuget', ['clean:nuget',
                                 'nugetpack',
                                 'nugetpush']);
};