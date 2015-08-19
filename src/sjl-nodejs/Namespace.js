/**
 * Created by Ely on 5/22/2015.
 * File: Namespace.js
 * Description: Mimicks namespaces/packages in languages like Java and Actionscript.
 */

require('sjljs');

var path = require('path'),
    fs = require('fs'),
    Namespace = function Namespace (dir, allowedFileExts) {
        if (this instanceof Namespace === false) {
            return new Namespace(dir, allowedFileExts);
        }
        var self = this,
            files = fs.readdirSync(dir);
        allowedFileExts = allowedFileExts || ['.js', '.json'];
        if (!sjl.empty(files)) {
            _processFiles(files, dir, allowedFileExts, self);
        }
    };

function _processFiles (files, dir, allowedFileExts, self) {
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            self[file] = new Namespace(path.join(dir, file));
        }
        else if (allowedFileExts.indexOf(path.extname(file)) > -1) {
            Object.defineProperty(self, file.substr(0, file.lastIndexOf('.')), {
                get: function () {
                    return require(path.join(dir, file)) },
                set: function () {}
            });
        }
        else {
            throw new Error('The file representing the requested alias is not of ' +
            'the allowed type ...'); //@todo fill this out
        }
    });
}

module.exports = sjl.Extendable.extend(Namespace);