/**
 * Created by Ely on 4/15/2016.
 * File: test-sjl-restArgs.js
 */
// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
var chai = require('chai'),
    sjl = require('./../../src/sjl'),
    expect = chai.expect;
// ~~~ /STRIP ~~~
describe ('#sjl.restArgs', function () {

    'use strict';

    it('should return an array when receiving an `arguments` object.', function () {
        expect(Array.isArray(sjl.restArgs(arguments))).to.be.true();
    });

    it ('should return args from 0 to `end`.', function () {
        (function () {
            var args = arguments,
                restArgs = sjl.restArgs(args, 0, 3);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(3);
        }('some', 3, 'args', 'here', '.'));
    });

    it ('should return args from 0 to end when no `end` is passed in.', function () {
        (function () {
            var args = arguments,
                restArgs = sjl.restArgs(args, 0);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(args.length);
        }('some', 3, 'args', 'here', '.'));
    });

    describe ('should work with plain arrays.', function () {
        var testArray = [null, undefined, true, false, function () {}, []];
        it ('should return args from 0 to `end`.', function () {
            var args = testArray,
                restArgs = sjl.restArgs(args, 0, 3);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(3);
        });

        it ('should return args from 0 to end when no `end` is passed in.', function () {
            var args = testArray,
                restArgs = sjl.restArgs(args, 0);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(args.length);
        });
    })
});
