/**
 * Created by edelacruz on 4/14/14.
 */
var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    header      = require('gulp-header'),
    mocha       = require('gulp-mocha'),
    uglify      = require('gulp-uglify');

gulp.task('tests', function () {
    gulp.src('tests/for-server/**/*.js')
        .pipe(mocha());
});

gulp.task('concat', function () {
    gulp.src([
        'src/sjl/sjl-util-functions.js',
        'src/sjl/sjl-set-functions.js',
        'src/sjl/sjl-shims-and-augments.js',
        'src/sjl/sjl-oop-util-functions.js',
        'src/sjl/Extendable.js',
        'src/sjl/Attributable.js',
        'src/sjl/Optionable.js',
        'src/sjl/validator/AbstractValidator.js',
        'src/sjl/validator/ValidatorChain.js',
        'src/sjl/validator/InRangeValidator.js',
        'src/sjl/validator/RegexValidator.js',
        'src/sjl/input/Input.js',
        'src/sjl/input/InputFilter.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(concat('./sjl.js'))
        .pipe(header('/**! sjl.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('uglify', function () {
    gulp.src([
        'src/sjl/sjl-util-functions.js',
        'src/sjl/sjl-set-functions.js',
        'src/sjl/sjl-shims-and-augments.js',
        'src/sjl/sjl-oop-util-functions.js',
        'src/sjl/Extendable.js',
        'src/sjl/Attributable.js',
        'src/sjl/Optionable.js',
        'src/sjl/validator/AbstractValidator.js',
        'src/sjl/validator/ValidatorChain.js',
        'src/sjl/validator/InRangeValidator.js',
        'src/sjl/validator/RegexValidator.js',
        'src/sjl/input/Input.js',
        'src/sjl/input/InputFilter.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(concat('./sjl.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('minimal', function () {
    gulp.src([
        'src/sjl/sjl-util-functions.js',
        'src/sjl/sjl-set-functions.js',
        'src/sjl/sjl-shims-and-augments.js',
        'src/sjl/sjl-oop-util-functions.js',
        'src/sjl/Extendable.js',
        'src/sjl/Attributable.js',
        'src/sjl/Optionable.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(concat('./sjl-minimal.js'))
        .pipe(header('/**! \n' +
            ' * sjl-minimal.js <%= (new Date()) %>\n' +
            ' **/\n'))
        .pipe(gulp.dest('./'));
});

gulp.task('minimal-min', ['minimal'], function () {
    gulp.src([
        'sjl-minimal.js'
    ])
        .pipe(concat('./sjl-minimal.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl-minimal.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('set-functions-only', function () {
    gulp.src([
        'src/sjl/sjl-set-functions.js'
    ])
        .pipe(concat('./sjl-set-functions-only.js'))
        .pipe(header('/**! sjl-set-functions-only.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('set-functions-only-min', function () {
    gulp.src([
        'src/sjl/sjl-set-functions.js'
    ])
        .pipe(concat('./sjl-set-functions-only.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl-set-functions-only.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('utilities-only', function () {
    gulp.src([
        'src/sjl/sjl-util-functions.js'
    ])
        .pipe(concat('./sjl-utilities-only.js'))
        .pipe(header('/**! sjl-utilities-only.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('utilities-only-min', function () {
    gulp.src([
        'src/sjl/sjl-util-functions.js'
    ])
        .pipe(concat('./sjl-utilities-only.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl-utilities-only.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('make-browser-test-suite', function () {
    gulp.src(['tests/for-server/**/*.js'])
        .pipe(concat('tests/for-browser/test-suite.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch(['./tests/for-server/*', './src/**/*'], [
        'concat',
        'uglify',
        'set-functions-only',
        'set-functions-only-min',
        'utilities-only',
        'utilities-only-min',
        'make-browser-test-suite'
    ]);
});

// Default task
gulp.task('default', [
    'concat',
    'uglify',
    'minimal',
    'minimal-min',
    'set-functions-only',
    'set-functions-only-min',
    'utilities-only',
    'utilities-only-min',
    'make-browser-test-suite',
    'watch'
]);
