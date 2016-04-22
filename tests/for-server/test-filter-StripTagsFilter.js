/**
 * Created by Ely on 3/30/2016.
 */
'use strict';

let expect = require('chai').expect,
    sjl = require('./../../src/sjl'),
    ns = sjl.ns,
    StripTagsFilter = ns.filter.StripTagsFilter;

describe('sjl.filter.StripTagsFilter', function () {
    it ('should be an instance of StripTagsFilter constructor.', function () {
        expect(new StripTagsFilter()).to.be.instanceOf(StripTagsFilter);
    });

    describe('filter.StripTagsFilter.filter', function () {
            StripTagsFilter.filter(
                '<html lang="eng" lang="chinese" mambo="no.3">' +
                '<head mambo="no.9" mambo="hello" mambo="what is your name?">Hello</head>Hello World' +
                '<head>Hello</head><!-- This is a comment.  Hello World x2. -->Hello World' +
                '<head style="display: inline-block;">Hello</head>Hello World' +
                '<head>Hello<p>Carlos Patatos</p></head>Hello World' +
                '</html>', ['p'], ['lang', 'style', 'mambo'], true);
    });

});
