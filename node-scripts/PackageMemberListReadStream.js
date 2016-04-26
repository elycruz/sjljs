/**
 * Created by Ely on 4/25/2016.
 * Description: Readable stream for outputting markdown friendly list
 * of packages and members on 'sjljs' project.
 * @exports PackageMemberListReadStream
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    sjl = require('./../src/sjl.js'),
    util = require('util'),
    stream = require('stream'),
    Readable = stream.Readable;

function repeatStr(str, times) {
    var out = '';
    while (out.length < times) {
        out += str;
    }
    return out;
}

function getEvenNumber(num) {
    while (num % 2) {
        num += 1;
    }
    return num;
}

function renderNode(dir, file, stat, padLeft) {
    var basename = path.basename(file, '.js'),
        name = renderLabelNodeName(dir, basename),
        type = renderType(stat),
        label = renderLabel(type + name),
        typeForHref = type.replace(/[\(\)]+/g, ''),
        href = renderHref(typeForHref.replace(/\s/g, '-') + name),

    // ~~ REMOVE FROM HERE ~~
        // Added this here temporarily but this should be pushed to it's own stream
        // and should be contained in an appropriate function and/or class.
        fileName = (type + name).replace(/\s/g, '-'),
        docFilePath = './markdown-fragments/package-and-member-docs/' + fileName + '.md';
    // If doc file doesn't exist, generate an empty file for it
    if (!fs.existsSync(docFilePath)) {
        fs.writeFileSync(docFilePath,
            '### ' + label.replace(/[\[\]]/g, '') + '\n' +
            '@todo - Added documentation here.\n' +
            '[Back to package and member list.](#packages-and-members)\n');
    }
    // ~~ /REMOVE FROM HERE ~~

    return renderMdLi(label + href, padLeft);
}

function renderLabelNodeName(dir, fileBasename) {
    var resolvedDir = dir.replace(/\.?(\/|\\)?src(\/|\\)?/, '');
    resolvedDir += resolvedDir.length > 0 ? '.' : '';
    return ((fileBasename !== 'sjl') ? 'sjl.' + resolvedDir : '') + fileBasename;
}

function renderLabel(innerText) {
    return '[' + innerText + ']';
}

function renderType(stat) {
    return '(' + (stat.isFile() ? 'm' : 'p') + ') ';
}

function renderHref(innerText) {
    return '(#' + innerText.toLowerCase().replace(/\./gim, '') + ')';
}

function renderMdLi(innerText, padLeft) {
    padLeft = repeatStr(' ', getEvenNumber(padLeft)) + '';
    return padLeft + '- ' + innerText + '\n';
}

function createPackageMemberList(dir, levelsDeep) {
    levelsDeep = sjl.isNumber(levelsDeep) ? levelsDeep : 0;
    var out = '',
        normalDir = path.normalize(dir);
    fs.readdirSync(normalDir).forEach(function (file) {
        var stat = fs.statSync(path.join(normalDir, file));
        out += renderNode(normalDir, file, stat, levelsDeep);
        if (stat.isDirectory()) {
            out += createPackageMemberList(path.join(normalDir, file), levelsDeep + 1);
        }
    });
    return out;
}

/**
 * Our package member list to markdown-fragments readable stream.  It
 * reads our srcs directory and outputs a markdown-fragments friendly list
 * of all the packages and members in said directory.
 * @param dirToScan {String} - Dir to scan for list.
 * @param options {Object|undefined} - Optional.  Readable stream options.
 * @constructor {PackageMemberListReadStream}
 */
function PackageMemberListReadStream(dirToScan) {
    sjl.throwTypeErrorIfEmpty('PackageMemberListReadStream', 'dirToScan', dirToScan, String);
    this._pathToRead = dirToScan;
    Readable.call(this, {
        encoding: 'utf8',
        objectMode: false,
        highWaterMark: 100000,
    });
}

// Inherit Readable Stream
util.inherits(PackageMemberListReadStream, Readable);

// Extend prototype
sjl.extend(PackageMemberListReadStream.prototype, {

    createPackageMemberList: function createPackageMemberList(dir, levelsDeep) {
        levelsDeep = sjl.isNumber(levelsDeep) ? levelsDeep : 0;
        var normalDir = path.normalize(dir),
            self = this;
        fs.readdirSync(normalDir).forEach(function (file) {
            var stat = fs.statSync(path.join(normalDir, file));
            self.push(renderNode(normalDir, file, stat, levelsDeep));
            if (stat.isDirectory()) {
                self.push(self.createPackageMemberList(path.join(normalDir, file), levelsDeep + 1));
            }
        });
    },

    _read: function () {
        if (!this._startedReading) {
            this._startedReading = true;
            this.createPackageMemberList(this._pathToRead);
        }
        else {
            this.push('\n');
            this.push(null);
        }
    },

    // Ensure Readable Stream's 'toString' method is the one being called
    toString: function toStringForReadable() {
        return Readable.prototype.toString.call(this);
    }

});

// Export Readable Stream
module.exports = PackageMemberListReadStream;
