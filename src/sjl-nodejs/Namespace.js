/**
 * Created by Ely on 5/22/2015.
 * File: Namespace.js
 * Description: Mimicks namespaces/packages in languages like Java and Actionscript.
 */

'use strict';

var path = require('path'),
    fs = require('fs');

function Namespace(dir, allowedFileExts, ignoredDirs) {
    ignoredDirs = Array.isArray(ignoredDirs) ? ignoredDirs : null;
    if (this instanceof Namespace === false) {
        return new Namespace(dir, allowedFileExts, ignoredDirs);
    }
    var self = this,
        files = fs.readdirSync(dir);
    allowedFileExts = allowedFileExts || ['.js', '.json'];
    if (files && Array.isArray(files) && files.length > 0) {
        processFiles(files, dir, allowedFileExts, ignoredDirs, self);
    }
}

function processFiles(files, dir, allowedFileExts, ignoredDirs, self) {
    files.forEach(function (file) {
        if (ignoredDirs && ingoredDirs.indexOf(file) > -1) {
            return;
        }
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            self[file] = new Namespace(path.join(dir, file));
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
        else {
            throw new Error('The file representing the requested alias "' + file + '" is not of ' +
                'the allowed type(s): "[' + (allowedFileExts.join('", "')) + ']');
        }
    });
}

module.exports = Namespace;
