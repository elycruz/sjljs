describe('sjl.searchObj', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var argsForTests = [
            [{
                all: {your: {base: {are: {belong: {to: {us: false}}}}}},
                arrayProp1: [],
                arrayProp2: ['how are you'],
                booleanProp: true,
                functionProp: function () {},
                numberProp: 99,
                objectProp: {},
                stringProp: 'Hello World'
            }]
        ],
        subject = argsForTests[0][0];

    it ('should be able to search an object by namespace string.', function () {
        expect(sjl.searchObj('all.your.base', subject)).to.equal(subject.all.your.base);
    });

    it ('should be able to search an object by key name.', function () {
        expect(sjl.searchObj('arrayProp2', subject)).to.equal(subject.arrayProp2);
    });

    it ('should return `undefined` for keys that are not found.', function () {
        expect(sjl.searchObj('arrayProp3', subject)).to.be.undefined();
    });
    
    it ('should throw a type error when no parameters are passed in.', function () {
        var caughtError;
        try {
            sjl.searchObj();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

    it ('should throw a type error when parameter one is not of type `String`.', function () {
        var caughtError;
        try {
            sjl.searchObj(99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

    it ('should throw a type error when parameter 2 is not of type `Object` or instance of `Function`.', function () {
        var caughtError;
        try {
            sjl.searchObj('some.prop', 99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});
