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
    fncallback  = require('gulp-fncallback'),
    //jsdoc       = require('gulp-jsdoc'),
    lazypipe    = require('lazypipe'),
    chalk       = require('chalk'),
    crypto      = require('crypto'),

    // LazyPipes
    jsHintPipe  = lazypipe()
        .pipe(jshint)
        .pipe(duration, chalk.cyan("jshint duration"))
        .pipe(jshint.reporter, 'jshint-stylish');
        //.pipe(jshint.reporter, 'fail');

// Builds './changelog.md'
gulp.task('changelog', function () {
    return gulp.src('changelog-fragments/*.md')
        .pipe(concat('changelog.md'))
        .pipe(gulp.dest('./'));
});

// Builds './README.md'
gulp.task('readme', ['changelog'], function () {
    gulp.src(['readme-fragments/README-fragment.md', 'changelog.md'])
        .pipe(concat('README.md'))
        .pipe(gulp.dest('./'));
});

// Builds './jsdocs'
//gulp.task('jsdoc', function () {
//    return gulp.src(['./src/**/*.js', './README.md'])
//        .pipe(jsdoc('./jsdocs'))
//});

// Runs mocha tests 'for-server'
gulp.task('tests', function () {
    gulp.src('tests/for-server/*.js')
        .pipe(mocha());
});

// Builds './sjl.js'
gulp.task('concat', function () {
    gulp.src([
        'src/sjl/sjl.js',
        'src/sjl/stdlib/Extendable.js',
        'src/sjl/stdlib/Attributable.js',
        'src/sjl/stdlib/Optionable.js',
        'src/sjl/stdlib/Iterator.js',
        'src/sjl/stdlib/ObjectIterator.js',
        'src/sjl/stdlib/iterable.js',
        'src/sjl/stdlib/SjlSet.js',
        'src/sjl/stdlib/SjlMap.js',
        'src/sjl/validator/BaseValidator.js',
        'src/sjl/validator/ValidatorChain.js',
        'src/sjl/validator/AlphaNumValidator.js',
        'src/sjl/validator/EmptyValidator.js',
        'src/sjl/validator/InRangeValidator.js',
        'src/sjl/validator/RegexValidator.js',
        'src/sjl/validator/EmailValidator.js',
        'src/sjl/validator/NumberValidator.js',
        'src/sjl/validator/PostCodeValidator.js',
        'src/sjl/input/Input.js',
        'src/sjl/input/InputFilter.js'
    ])
        .pipe(jsHintPipe())
        .pipe(concat('./sjl.js'))
        //.pipe(fncallback(function (file, enc, cb) {
        //    // Create file hasher
        //    var hasher = crypto.createHash('md5');
        //    hasher.update(file.contents.toString(enc));
        //    //file.contents = hasher.digest('hex') + file.contents;
        //    cb();
        //}))
        .pipe(header('/**! sjl.js <%= (new Date()).getTime() %> **/'))
        .pipe(gulp.dest('./'));
});

// Builds './sjl.min.js'
gulp.task('uglify', ['concat'], function () {
    gulp.src('./sjl.js')
        .pipe(jsHintPipe())
        .pipe(concat('./sjl.min.js'))
        .pipe(uglify())
        .pipe(header('/**! sjl.min.js <%= (new Date()) %> **/'))
        .pipe(gulp.dest('./'));
});

// Builds './sjl-minimal.js'
gulp.task('minimal', function () {
    gulp.src([
        'src/sjl/sjl.js'
    ])
        .pipe(jsHintPipe())
        .pipe(concat('./sjl-minimal.js'))
        .pipe(header('/**! \n' +
            ' * sjl-minimal.js <%= (new Date()) %>\n' +
            ' **/\n'))
        .pipe(gulp.dest('./'));
});

// Builds './sjl-minimal.min.js'
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

// Builds './tests/for-browser/test-suite.js'
gulp.task('make-browser-test-suite', function () {
    gulp.src(['tests/for-server/**/*.js'])
        .pipe(jsHintPipe())
        .pipe(concat('tests/for-browser/test-suite.js'))
        .pipe(gulp.dest('./'));
});

// Jshint pipe
gulp.task('jshint', function () {
    return gulp.src('src/**/*.js')
        .pipe(jsHintPipe());
});

// Watches multiple sources
gulp.task('watch', function () {

    // Watch all javascript files
    gulp.watch(['./tests/for-server/*', './src/**/*'], [
        'jshint',
        //'jsdoc',
        'concat',
        'uglify',
        'minimal',
        'minimal-min',
        'make-browser-test-suite'
    ]);

    // Watch readme for 'jsdoc' task
    gulp.watch(['README.md'] /*['jsdoc']*/);

    // Watch changelog-fragments and readme-fragments for 'readme' task
    gulp.watch(['readme-fragments/*.md', 'changelog-fragments/*.md'], ['readme']);

});

// Build task
gulp.task('build', [
    'readme',
    //'jsdoc',
    'concat',
    'uglify',
    'minimal',
    'minimal-min',
    'tests',
    'make-browser-test-suite'
]);

// Default task
gulp.task('default', [
    'build',
    'watch'
]);
