/**
 * Created by Ely on 3/30/2016.
 */


describe('sjl.filter.StripTagsFilter', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var StripTagsFilter = sjl.filter.StripTagsFilter;

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
