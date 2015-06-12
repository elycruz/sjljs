/**
 * Created by edelacruz on 4/14/14.
 */
var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    header      = require('gulp-header'),
    mocha       = require('gulp-mocha'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    duration    = require('gulp-duration'),
    lazypipe    = require('lazypipe'),
    chalk       = require('chalk'),
    jsdoc       = require("gulp-jsdoc"),

    // LazyPipes
    jsHintPipe  = lazypipe()
        .pipe(jshint)
        .pipe(duration, chalk.cyan("jshint duration"))
        .pipe(jshint.reporter, 'jshint-stylish');
        //.pipe(jshint.reporter, 'fail');

gulp.task('readme', function () {
    gulp.src('changelog-fragments/*.md')
        .pipe(concat('changelog.md'))
        .pipe(gulp.dest('./'));

    gulp.src(['readme-fragments/README.md', 'changelog.md'])
        .pipe(concat('README.md'))
        .pipe(gulp.dest('./'));
});

gulp.task('jsdoc', function () {
    return gulp.src(['./src/**/*.js', './README.md'])
        .pipe(jsdoc('./jsdocs'))
});

gulp.task('tests', function () {
    gulp.src('tests/for-server/**/*.js')
        .pipe(mocha());
});

gulp.task('concat', function () {
    gulp.src([
        'src/sjl/Sjl.js',
        'src/sjl/sjl-util-functions.js',
        'src/sjl/sjl-set-functions.js',
        'src/sjl/sjl-oop-util-functions.js',
        'src/sjl/Extendable.js',
        'src/sjl/Attributable.js',
        'src/sjl/Optionable.js',
        'src/sjl/validator/AbstractValidator.js',
        'src/sjl/validator/ValidatorChain.js',
        'src/sjl/validator/AlphaNumValidator.js',
        'src/sjl/validator/EmptyValidator.js',
        'src/sjl/validator/InRangeValidator.js',
        'src/sjl/validator/RegexValidator.js',
        'src/sjl/validator/EmailValidator.js',
        'src/sjl/validator/NumberValidator.js',
        'src/sjl/validator/PostCodeValidator.js',
        'src/sjl/input/Input.js',
        'src/sjl/input/InputFilter.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(jsHintPipe())
        .pipe(concat('./sjl.js'))
        .pipe(header('/**! sjl.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('uglify', ['concat'], function () {
    gulp.src('./sjl.js')
        .pipe(jsHintPipe())
        .pipe(concat('./sjl.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('minimal', function () {
    gulp.src([
        'src/sjl/Sjl.js',
        'src/sjl/sjl-util-functions.js',
        'src/sjl/sjl-set-functions.js',
        'src/sjl/sjl-oop-util-functions.js',
        'src/sjl/Extendable.js',
        'src/sjl/Attributable.js',
        'src/sjl/Optionable.js',
        'src/sjl/Iterator.js'
    ])
        .pipe(jsHintPipe())
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
        .pipe(jsHintPipe())
        .pipe(concat('./sjl-minimal.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl-minimal.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

gulp.task('make-browser-test-suite', function () {
    gulp.src(['tests/for-server/**/*.js'])
        .pipe(jsHintPipe())
        .pipe(concat('tests/for-browser/test-suite.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch(['./tests/for-server/*', './src/**/*', 'README.md'], [
        'jsdoc',
        'concat',
        'uglify',
        'minimal',
        'minimal-min',
        'make-browser-test-suite'
    ]);

    gulp.watch(['readme-fragments/*.md', 'changelog-fragments/*.md'], [
        'readme'
    ]);

});

// Default task
gulp.task('default', [
    'jsdoc',
    'concat',
    'uglify',
    'minimal',
    'minimal-min',
    'make-browser-test-suite',
    'watch'
]);
