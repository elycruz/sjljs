/**
 * Created by elydelacruz on 4/28/16.
 */

'use strict';

var sjl = require('./../src/sjl.js'),
    fs = require('fs'),
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

function renderNode(memberName, padLeft) {
    var name = renderLabelNodeName(memberName),
        type = '(m) ',
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

function renderLabelNodeName(funcName) {
    return 'sjl.' + funcName;
}

function renderLabel(innerText) {
    return '[' + innerText + ']';
}

function renderHref(innerText) {
    return '(#' + innerText.toLowerCase().replace(/\./gim, '') + ')';
}

function renderMdLi(innerText, padLeft) {
    padLeft = repeatStr(' ', getEvenNumber(padLeft)) + '';
    return padLeft + '- ' + innerText + '\n';
}

function SjlDirectMemberListReadStream (options) {
    Readable.call(this, sjl.extend({
        encoding: 'utf8',
        objectMode: false,
        highWaterMark: 100000,
    }, options));
}

util.inherits(SjlDirectMemberListReadStream, Readable);

SjlDirectMemberListReadStream.prototype._read = function () {
    if (!this._startedReading) {
        this._startedReading = true;
        Object.keys(sjl).forEach(function (key) {
            this.push(renderNode(key));
        }, this);
    }
    else {
        this.push('\n');
        this.push(null);
    }
};

module.exports = SjlDirectMemberListReadStream;
