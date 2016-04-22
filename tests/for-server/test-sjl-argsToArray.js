describe('sjl.argsToArray', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it('should return an array for an arguments object.', function () {
        expect(Array.isArray(sjl.argsToArray(arguments))).to.equal(true);
    });

    it('should return an array for an array.', function () {
        var subjectArray = [['hello'].true, function () {}, {}, 'Hello World'],
            operationResult = sjl.argsToArray(subjectArray);
        expect(Array.isArray(operationResult)).to.equal(true);
    });

    it('should return an array of the exact same length as the array like object passed (Array|Arguments).', function () {
        var subjectArray = [['hello'].true, function () {
            }, {}, 'Hello World'],
            operationResult = sjl.argsToArray(subjectArray);
        expect(operationResult.length).to.equal(subjectArray.length);
    });

    it('Returned array should contain passed in values.', function () {
        var operationResult = null,
            subjectParams = [['hello'], true, function () {}, {}, 'Hello World'];

        // Get values to test
        (function () {
            operationResult = sjl.argsToArray(arguments);
        })
            .apply(null, subjectParams);

        // Test operation result
        operationResult.forEach(function (value, i) {
            expect(value).to.equal(subjectParams[i]);
        });
    });

});
