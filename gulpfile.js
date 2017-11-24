/*eslint no-console: 0*/
'use strict'

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    //concat = require('gulp-concat'),
    //rename = require('gulp-rename'),
    //cleanCSS = require('gulp-clean-css'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer');

var path = {
    build: {
        styles: 'src/build/styles/',
        scripts: 'src/build/scripts/',
    },
    dev: {
        styles: 'src/styles/*.less',
        scripts: 'src/scripts/*.js',
    }
}

gulp.task('styles', function () {
    return gulp.src(path.dev.styles)
    .pipe(less())
    .pipe(prefixer())
    .on('error', console.log)
    .pipe(gulp.dest(path.build.styles))
});

gulp.task('scripts', function () {
    return gulp.src(path.dev.scripts)
    /*.pipe(uglify().on('error', function(e){
        console.log(e);
    }))*/
    .pipe(gulp.dest(path.build.scripts))
});

gulp.task('build', ['scripts', 'styles'], function () {});

gulp.task('watch', function(){
    watch([path.dev.styles, path.dev.scripts], function(event, cb) {
        gulp.start('styles');
        gulp.start('scripts');
    });
});
