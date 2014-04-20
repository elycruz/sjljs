/**
 * Created by edelacruz on 4/14/14.
 */
var gulp = require('gulp'),

    concat = require('gulp-concat'),

    header = require('gulp-header'),

    uglify = require('gulp-uglify');


gulp.task('concat', function () {
    gulp.src([
        'src/sjl/sjl.js',
        'src/sjl/Extendable.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(concat('./sjl.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('uglify', function () {
    gulp.src([
        'src/sjl/sjl.js',
        'src/sjl/Extendable.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(concat('./sjl.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*', ['uglify']);
});

// Default task
gulp.task('default', ['concat', 'uglify', 'watch']);