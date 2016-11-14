/**
 * Created by elyde on 11/13/2016.
 */
describe('sjl.curry', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    let chai = require('chai'),
        sjl = require('./../../src/sjl'),
        assert = chai.assert,
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    // Set curry here to use below
    let curry = sjl.curry,
        curry2 = sjl.curry2;

    it ('should be of type function.', function () {
        expect(sjl.curry).to.be.instanceOf(Function);
    });

    it ('should return a function when called with or without args.', function () {
        expect(sjl.curry()).to.be.instanceOf(Function);
        expect(sjl.curry(99)).to.be.instanceOf(Function);
        expect(sjl.curry(() => {})).to.be.instanceOf(Function);
        expect(sjl.curry(console.log)).to.be.instanceOf(Function);
    });

    it('should return a function that fails when no function is passed (as it\'s first param).', function () {
        assert.throws(sjl.curry(), Error);
        assert.throws(sjl.curry(99), Error);
    });

    it ('should return a properly curried function when correct arity for said function is met.', function () {
        let min8 = curry(Math.min, 8),
            max5 = curry(Math.max, 5),
            pow2 = curry(Math.pow, 2);

        // Expect functions
        [min8, max5, pow2].forEach(function (func) {
            expect(func).to.be.instanceOf(Function);
        });

        // Expect functions work correctly
        expect(min8(9)).to.equal(8);
        expect(min8(8)).to.equal(8);
        expect(min8(7)).to.equal(7);
        expect(max5(6)).to.equal(6);
        expect(max5(5)).to.equal(5);
        expect(max5(4)).to.equal(5);
        expect(pow2(2)).to.equal(4);
        expect(pow2(3)).to.equal(8);
        expect(pow2(4)).to.equal(16);
    });

    it ('should be able to correctly curry functions of different arity as long as their arity is met.', function () {
        let min = curry2(Math.min),
            max = curry2(Math.max),
            pow = curry2(Math.pow),
            min8 = curry(Math.min, 8),
            max5 = curry(Math.max, 5),
            pow2 = curry(Math.pow, 2),
            isValidTangentLen = curry(function (a, b, cSqrd) { return pow(a, 2) + pow(b, 2) === cSqrd; }, 2, 2),
            random = curry(function (start, end) { return Math.round(Math.random() * end + start); }, 0),
            expectedFor = function (num) { return min(8, max(5, pow(2, num))); };


        // Expect functions returned for `curry` calls
        expect(isValidTangentLen).to.be.instanceOf(Function);

        // Expect functions returned for `curry` calls
        [min8, max5, pow2].forEach(function (func) {
            expect(func).to.be.instanceOf(Function);
        });

        // Expect `curry`ed functions to work as expected
        expect(isValidTangentLen(8)).to.equal(true);
        expect(isValidTangentLen(21)).to.equal(false);

        // Expect `curry`ed functions to work as expected
        [8,5,3,2,1,0, random(89), random(55), random(34)].forEach(function (num) {
            let composed = sjl.compose(min8, max5, pow2);
            expect(composed(num)).to.equal(expectedFor(num));
        });
    });

});
