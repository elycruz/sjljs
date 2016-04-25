/**
 * Created by elydelacruz on 4/20/16.
 */
describe('sjl.wrapPointer', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    [
        // pointer : min : max : {result-of-wrap {Number}}
        [0, 0, 100, 0],
        [-1, 0, 100, 100],
        [101, 0, 100, 0],
        [99, 0, 100, 99],
    ]
    .forEach(function (args) {
        var expectedValue = args.pop();
        it ('should return ' + expectedValue + ' when args are [' + args.join(', ') + '].', function () {
            var result = sjl.wrapPointer.apply(sjl, args);
            expect(result).to.equal(expectedValue);
        });
    });
});
