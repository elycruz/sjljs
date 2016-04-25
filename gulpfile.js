/**
 * Created by edelacruz on 4/14/14.
 */
var packageJson = require('./package'),
    gulpConfig = require('./gulpconfig'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    duration = require('gulp-duration'),
    fncallback = require('gulp-fncallback'),
    lazypipe = require('lazypipe'),
    chalk = require('chalk'),
    replace = require('gulp-replace'),
    crypto = require('crypto'),
    requirejs = require('gulp-requirejs'),
    del = require('del'),
    jsHintPipe = lazypipe()
        .pipe(jshint)
        .pipe(duration, chalk.cyan("jshint duration"))
        .pipe(jshint.reporter, 'jshint-stylish');

gulp.task('readme', function () {
    gulp.src(['markdown-fragments/README-fragment.md'])
        .pipe(concat('README.md'))
        .pipe(gulp.dest('./'));
});

gulp.task('tests', function () {
    gulp.src('tests/for-server/*.js')
        .pipe(mocha());
});

gulp.task('clean', function () {
    return del([
        './tests/for-browser/test-suite.js',
        'sjl.js',
        'sjl.min.js',
        'sjl-minimal.js',
        'sjl-minimal.min.js'
    ]).then(function (paths) {
            if (paths.length > 0) {
                console.log(chalk.dim('\nThe following paths have been deleted: \n - ' + paths.join('\n - ') + '\n'));
            }
            else {
                console.log(chalk.dim(' - No paths to clean.') + '\n', '--mandatory');
            }
            //console.log('[' + chalk.green('gulp') +'] ' + chalk.cyan(taskName + ' duration: ')
            //    + chalk.magenta((new Date() - start) / 1000 + 'ms\n')
            //);
        })
        .catch(function (failure) {
            console.log(failure, '\n');
        });
});

gulp.task('concat', function () {
    return gulp.src(gulpConfig.sjl)
        .pipe(jsHintPipe())
        .pipe(concat('./sjl.js'))
        .pipe(fncallback(function (file, enc, cb) {
            // Create file hasher
            var hasher = crypto.createHash('md5');
            hasher.update(file.contents.toString(enc));
            packageJson.fileHash = hasher.digest('hex');
            cb();
        }))
        .pipe(header(
            '/**! sjljs <%= version %>\n' +
            ' * | License: <%= license %>\n' +
            ' * | md5checksum: <%= fileHash %>\n' +
            ' * | Built-on: <%= (new Date()) %>\n' +
            ' **/',
            packageJson))
        .pipe(gulp.dest('./'));
});

gulp.task('uglify', ['concat'], function () {
    return gulp.src('./sjl.js')
        .pipe(jsHintPipe())
        .pipe(concat('./sjl.min.js'))
        .pipe(fncallback(function (file, enc, cb) {
            // Create file hasher
            var hasher = crypto.createHash('md5');
            hasher.update(file.contents.toString(enc));
            packageJson.fileHash = hasher.digest('hex');
            cb();
        }))
        .pipe(uglify())
        .pipe(header('/**! sjljs <%= version %> | License: <%= license %> | md5checksum: <%= fileHash %> | Built-on: <%= (new Date()) %> **/', packageJson))
        .pipe(gulp.dest('./'));
});

gulp.task('minimal', function () {
    return gulp.src([
            './src/sjl.js'
        ])
        .pipe(jsHintPipe())
        .pipe(concat('./sjl-minimal.js'))
        .pipe(fncallback(function (file, enc, cb) {
            // Create file hasher
            var hasher = crypto.createHash('md5');
            hasher.update(file.contents.toString(enc));
            packageJson.fileHash = hasher.digest('hex');
            cb();
        }))
        .pipe(header(
            '/**! sjl-minimal.js <%= version %> \n' +
            ' * | License: <%= license %> \n' +
            ' * | md5checksum: <%= fileHash %> \n' +
            ' * | Built-on: <%= (new Date()) %> \n' +
            ' **/\n', packageJson))
        .pipe(gulp.dest('./'));
});

gulp.task('minimal-min', ['minimal'], function () {
    return gulp.src([
            'sjl-minimal.js'
        ])
        .pipe(jsHintPipe())
        .pipe(concat('./sjl-minimal.min.js'))
        .pipe(fncallback(function (file, enc, cb) {
            // Create file hasher
            var hasher = crypto.createHash('md5');
            hasher.update(file.contents.toString(enc));
            packageJson.fileHash = hasher.digest('hex');
            cb();
        }))
        .pipe(uglify())
        .pipe(header('/**! sjl-minimal.min.js <%= version %> | License: <%= license %>' +
            ' | md5checksum: <%= fileHash %> | Built-on: <%= (new Date()) %> **/', packageJson))
        .pipe(gulp.dest('./'));
});

gulp.task('make-browser-test-suite', function () {
    return gulp.src([
        'tests/for-browser/tests-header.js',
        'tests/for-server/**/*.js'])
        .pipe(jsHintPipe())
        .pipe(replace(/\/\/ ~~~ STRIP ~~~[^~]+\/\/ ~~~ \/STRIP ~~~[\n\r\f]+/gim, ''))
        .pipe(concat('tests/for-browser/test-suite.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('mbts', ['make-browser-test-suite']);

gulp.task('jshint', function () {
    return gulp.src('src/**/*.js')
        .pipe(jsHintPipe());
});

gulp.task('watch', function () {

    // Watch all javascript files
    gulp.watch(['./tests/for-server/*', './src/**/*', './node_modules/**/*'], [
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

    // Watch changelog-fragments and markdown-fragments for 'readme' task
    gulp.watch(['markdown-fragments/*.md'], ['readme']);

});

gulp.task('build', [
    'clean',
    'readme',
    //'jsdoc',
    'concat',
    'uglify',
    'minimal',
    'minimal-min',
    'tests',
    'make-browser-test-suite'
]);

gulp.task('default', [
    'build',
    'watch'
]);
