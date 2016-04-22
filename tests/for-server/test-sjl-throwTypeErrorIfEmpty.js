

describe('sjl.throwTypeErrorIfEmpty', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it('should throw a type error if `value` is empty ([0, null, undefined, [], {}, "", false]).', function () {
        [
            [0, String],
            [null, Function],
            [{}, String],
            [[], Boolean],
            [false, Object]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0]);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    it('should throw a type error when `value` is not of passed in type.', function () {
        [
            [99, Array],
            [{helloWorld: 'world'}, Boolean],
            [[1, 2, 3], Function],
            [true, String],
            ['hello-world', Object],
            [function () {
            }, Array]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0], args[1]);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });
    });

    it('should throw a type error when `value` is empty or not of passed in `type`.', function () {
        [
            // Not matching types
            [99, Array],
            [{helloWorld: 'world'}, Boolean],
            [[1, 2, 3], Function],
            [true, String],
            ['hello-world', Object],
            [function () {}, Array],

            // Empty values
            [0, Number],
            [[], Array],
            ['', String],
            ['', Function],
            [{}, Object],
            [false, Boolean]
        ]
            .forEach(function (args) {
                var caughtError;
                try {
                    sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0], args[1]);
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
    });

    it('should not throw any errors when `value` is not empty and of passed in `type`.', function () {
        [
            [99, Number],
            [{helloWorld: 'world'}, Object],
            [[1, 2, 3], Array],
            [true, Boolean],
            ['hello-world', String],
            [function () {}, Function]
        ]
            .forEach(function (args) {
                var caughtError;
                try {
                    sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0], args[1]);
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.undefined();
            });
    });

});
