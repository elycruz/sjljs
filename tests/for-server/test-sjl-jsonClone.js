/**
 * Created by elydelacruz on 4/16/16.
 */
describe('sjl.jsonClone', function () {

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
            functionProp: function () {
            },
            numberProp: 99,
            objectProp: {},
            stringProp: 'Hello World'
        }]
    ];

    it('should return a cloned object that conforms to the JSON format.', function () {
        var testSubject = argsForTests[0][0],
            result = sjl.jsonClone(testSubject);

        // Filter to keys for truthy check
        Object.keys(testSubject).filter(function (key) {
                return typeof testSubject[key] !== 'function';
            })
            // Ensure all keys are output by json clone
            .forEach(function (key) {
                expect(result.hasOwnProperty(key)).to.be.true();
            });

        // Ensure no props with function values present
        expect(result.hasOwnProperty('functionProp')).to.be.false();
    });

    it ('should return a syntax error when no params are passed in.', function () {
        var caughtError;
        try {
            sjl.jsonClone();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(SyntaxError);
    });

});
