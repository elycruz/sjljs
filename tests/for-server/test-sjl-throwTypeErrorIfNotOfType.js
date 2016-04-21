describe('#sjl.throwTypeErrorIfNotOfType', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should throw a type error when `value` is not of passed in `type`.', function () {
        [
            [0, String],
            [null, Function],
            [{}, String],
            [[], Boolean],
            [true, Object]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfNotOfType('some.namespace', 'paramName', args[0], args[1]);
            }
            catch(e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    it ('should not throw any errors when `value` is of passed in `type`.', function () {
        [
            [0, Number],
            [null, 'Null'],
            [{}, Object],
            [[], Array],
            [true, Boolean],
            ['', String]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfNotOfType('some.namespace', 'paramName', args[0], args[1]);
            }
            catch(e) {
                caughtError = e;
            }
            expect(caughtError).to.be.undefined();
        });
    });

});
