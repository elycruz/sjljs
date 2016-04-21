/**
 * Created by elydelacruz on 4/16/16.
 */
// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
var chai = require('chai'),
    sjl = require('./../../src/sjl'),
    expect = chai.expect;
// ~~~ /STRIP ~~~

describe('#sjl.issetAndOfType', function () {

    'use strict';

    it('should return true for values that are `set` and are of the passed `type`.', function () {
        // Args to test
        [
            [['hello'], Array],
            [false, Boolean],
            [function () {
            }, Function],
            ['Hello World', String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(true);
            });
    });

    it('should return false for values that are `set` but not of the passed in `type`.', function () {
        // Args to test
        [
            ['hello', Array],
            [['hello'], Boolean],
            [{hello: 'ola'}, Function],
            [function () {
            }, String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(false);
            });
    });

    it('should return false for values that are `not-set`.', function () {
        [
            [null, Array],
            [undefined, Boolean],
            [null, Function],
            [undefined, String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(false);
            });
    });

    it('should return false for values that are `not-set` or not of `type` passed in.', function () {
        [
            [null, Array],
            [['hello'], Boolean],
            [99, Function],
            [undefined, String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(false);
            });
    });

    it('should return `false` when no `type` param is passed in.', function () {
        var count = 0,
            argsForTest = [
                [['hello']],
                [false],
                [function () {}],
                ['Hello World']
            ];
        argsForTest.forEach(function (args) {
            expect(sjl.issetAndOfType(args)).to.be.false();
        });
    });

    it('should return false when no arguments are passed in.', function () {
        expect(sjl.issetAndOfType()).to.be.false();
    });

});
