/**
 * Created by Ely on 5/22/2015.
 * File: Namespace.js
 * Description: NodeJs Namespace Constructor.
 */

'use strict';

var path = require('path'),
    fs = require('fs');

/**
 * A namespace constructor for getting an object that mimicks namespaces/packages
 * in languages like Java and Actionscript.  Classes are loaded on a per request basis.
 * @example
 * // Example 1
 * let sjl = require('sjljs'),
 *     ns = new sjl.nodejs.Namespace(__dirname),
 *
 *     // Fetches './some/namespace/some/where/SomeConstructor(.js|.json)' by default.
 *     SomeConstructor = ns.some.namespace.some.where.SomeConstructor,
 *
 *     // Fetches './some-data-dir/someJsonFile(.js|.json)' by default.
 *     someJsonFile = ns['some-data-dir'].someJsonFile;
 *
 * @example
 * // Example 2
 * // `sjl` uses this constructor internally to expose it's class library so you don't
 * // have to include them manually;  E.g.,
 *
 *  // Exposed functionality
 * let Optionable = sjl.stdlib.Optionable;
 *
 * // With out exposed functionality (assume in some './src' folder)
 * let Optionable = require('../node_modules/sjljs/src/stdlib/Optionable');
 *
 * @param dir {String} - Directory to scan.
 * @param allowedFileExts {Array<String>} - Allowed file extensions (with preceding '.').
 * @param [ignoredDirs] {Array<String>} - Directories to ignore on `dir` scan.
 * @param [ignoredFiles] {Array<String>} - Directories to ignore on `dir` scan.
 * @constructor sjl.nodejs.Namespace
 */
function Namespace(dir, allowedFileExts, ignoredDirs, ignoredFileNames) {
    ignoredDirs = Array.isArray(ignoredDirs) ? ignoredDirs : null;
    ignoredFileNames = Array.isArray(ignoredFileNames) ? ignoredFileNames : null;
    let self = this,
        files = fs.readdirSync(dir);
    allowedFileExts = allowedFileExts || ['.js', '.json'];
    if (files && Array.isArray(files) && files.length > 0) {
        processFiles(files, dir, allowedFileExts, ignoredDirs, ignoredFileNames, self);
    }
}

/**
 * Scans directories for library members and sets them as getters on passed in Namespace.
 * @param files {Array<String>}
 * @param dir {String}
 * @param allowedFileExts {Array<String>}
 * @param ignoredDirs {Array<String>}
 * @param [ignoredFileNames=undefined]
 * @param self {Namespace} - Self.
 * @recursive
 * @private
 */
function processFiles(files, dir, allowedFileExts, ignoredDirs, ignoredFileNames, self) {
    files.forEach(function (file) {
        if (file.indexOf('sjl.js'))
        if (ignoredDirs && ignoredDirs.indexOf(file) > -1) {
            return;
        }
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            self[file] = new Namespace(path.join(dir, file), allowedFileExts, ignoredDirs, ignoredFileNames);
        }
        else if (allowedFileExts.indexOf(path.extname(file)) > -1) {
            Object.defineProperty(self, file.substr(0, file.lastIndexOf('.')), {
                get: function () {
                    return require(path.join(dir, file));
                },
                set: function () {},
                enumerable: true
            });
        }
    });
}

module.exports = Namespace;
