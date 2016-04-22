/**
 * Created by elydelacruz on 4/16/16.
 */
describe('sjl.isEmptyObj', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should return true for empty objects.', function () {
        expect(sjl.isEmptyObj({})).to.be.true();
    });

    it ('should return false for non-empty objects.', function () {
        expect(sjl.isEmptyObj({hello: 'world'})).to.be.false();
    });

    // Check for result of checking `null` and `undefined`
    [
        [null, 'null'],
        [undefined, 'undefined']
    ]
        .forEach(function (args) {
            // Pass through or check error type
            var caughtError = false;
            try {
                sjl.classOfIs(args[0]);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    it ('should throw an `TypeError` when called with no params.', function () {
        var caughtError = false;
        try {
            sjl.isEmptyObj();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});
