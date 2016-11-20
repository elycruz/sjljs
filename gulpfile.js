/**
 * Created by edelacruz on 4/14/14.
 */

'use strict';

let packageJson = require('./package'),
    gulpConfig = require('./gulpconfig'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    jsdoc = require('gulp-jsdoc3'),
    uglify = require('gulp-uglify'),
    duration = require('gulp-duration'),
    fncallback = require('gulp-fncallback'),
    lazypipe = require('lazypipe'),
    chalk = require('chalk'),
    replace = require('gulp-replace'),
    crypto = require('crypto'),
    requirejs = require('gulp-requirejs'),
    del = require('del'),
    fs = require('fs'),
    util = require('util'),
    jsHintPipe = lazypipe()
        .pipe(jshint)
        .pipe(duration, chalk.cyan("jshint duration"))
        .pipe(jshint.reporter, 'jshint-stylish'),
    PackageMemberListReadStream = require('./node-scripts/PackageMemberListReadStream'),
    SjlDirectMemberListReadStream = require('./node-scripts/SjlDirectMemberListReadStream'),
    VersionNumberStream = require('./node-scripts/VersionNumberReadStream');

gulp.task('package-member-list-md', function () {
    var outputDir = './markdown-fragments/generated',
        filePath = outputDir + '/packages-and-members-list.md';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(filePath, '');
    return (new PackageMemberListReadStream('./src'))
        .pipe(fs.createWriteStream(filePath));
});

gulp.task('sjl-direct-member-list-md', function () {
    var outputDir = './markdown-fragments/generated',
        filePath = outputDir + '/sjl-direct-members-list.md';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(filePath, '');
    return (new SjlDirectMemberListReadStream())
        .pipe(fs.createWriteStream(filePath));
});

gulp.task('generate-version-number', function () {
    return (new VersionNumberStream())
        .pipe(fs.createWriteStream('./src/generated/version.js'));
});

gulp.task('pml', ['package-member-list-md']);
gulp.task('sdm', ['sjl-direct-member-list-md']);
gulp.task('gvn', ['generate-version-number']);

gulp.task('readme', ['pml', 'sdm', 'gvn'], function () {
    return gulp.src(gulpConfig.readme)
        .pipe(concat('README.md'))
        .pipe(gulp.dest('./'));
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

gulp.task('jshint', function () {
    return gulp.src([
        'src/**/*.js',
        'tests/for-server/*.js'
    ])
        .pipe(jsHintPipe());
});

gulp.task('tests', ['gvn'], function () {
    return gulp.src([
        'tests/for-server/*.js'
    ])
        .pipe(mocha());
});

gulp.task('concat', ['tests'], function () {
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
        .pipe(header('/**! sjljs <%= version %> | License: <%= license %> | ' +
            'md5checksum: <%= fileHash %> | Built-on: <%= (new Date()) %> **/', packageJson))
        .pipe(gulp.dest('./'));
});

gulp.task('minimal', ['tests'], function () {
    return gulp.src(gulpConfig['sjl-minimal'])
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
            './sjl-minimal.js'
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

gulp.task('make-browser-test-suite', ['uglify'], function () {
    return gulp.src([
        'tests/for-browser/tests-header.js',
        'tests/for-server/**/*.js'])
        .pipe(jsHintPipe())
        .pipe(replace(/\/\/ ~~~ STRIP ~~~[^~]+\/\/ ~~~ \/STRIP ~~~[\n\r\f]+/gim, ''))
        .pipe(concat('tests/for-browser/test-suite.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('mbts', ['make-browser-test-suite']);

gulp.task('jsdoc', ['readme'], function (cb) {
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc({
            opts: {
                "template": "templates/default",  // same as -t templates/default
                "encoding": "utf8",               // same as -e utf8
                "destination": "./jsdocs/",          // same as -d ./out/
                "recurse": true
            }
        }, cb));
});

gulp.task('watch', ['all'], function () {

    // Watch all javascript files
    gulp.watch([
        './tests/for-server/**/*',
        './src/**/*',
        './node_modules/**/*'
    ], [
        'jshint',
        'minimal-min',
        'mbts'
    ]);

    gulp.watch('./tests/for-server/**/*.js', ['mbts']);

    // Watch readme-sections for 'jsdoc' task
    gulp.watch(['README.md'], ['jsdoc']);

    // Watch changelog-fragments and markdown-fragments-fragments for 'readme-sections' task
    gulp.watch(['markdown-fragments-fragments/*.md'], ['readme']);

});

gulp.task('build', [
    'clean',
    'gvn',
    'jshint',
    'concat',
    'uglify',
    'minimal',
    'minimal-min',
    'tests',
    'mbts'
]);

gulp.task('docs', ['readme', 'jsdoc']);

gulp.task('all', ['docs', 'build']);

gulp.task('default', [
    'all',
    'watch'
]);
