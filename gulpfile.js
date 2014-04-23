/**
 * Created by edelacruz on 4/14/14.
 */
var gulp = require('gulp'),

    concat = require('gulp-concat'),

    header = require('gulp-header'),

    mocha = require('gulp-mocha'),

    uglify = require('gulp-uglify');

gulp.task('test', function () {
    gulp.src('tests/test-suite-sjl-extendable.js')
        .pipe(mocha());
});

gulp.task('concat', function () {
    gulp.src([
        'src/sjl/Sjl.js',
        'src/sjl/Extendable.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(concat('./Sjl.js'))
        .pipe(header('/**! sjl.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('uglify', function () {
    gulp.src([
        'src/sjl/Sjl.js',
        'src/sjl/Extendable.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(concat('./sjl.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*', ['concat', 'uglify']);
});

// Default task
gulp.task('default', ['concat', 'uglify', 'watch']);
