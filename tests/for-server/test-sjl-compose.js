/**
 * Created by elyde on 11/13/2016.
 */
describe('sjl.compose', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    let chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should be of type function.', function () {
        expect(sjl.compose).to.be.instanceOf(Function);
    });

    it ('should return a function whether or not any parameters were passed in to it.', function () {
        expect(sjl.compose()).to.be.instanceOf(Function);
        expect(sjl.compose(console.log)).to.be.instanceOf(Function);
    });

    it ('should return a function that when used returns the passed in value if `compose` ' +
        'itself didn\'t receive any parameters.', function () {
        let result = sjl.compose();
        expect(result(99)).to.equal(99);
    });

    it ('should be able to compose an arbitrary number of functions and execute them as expected ' +
        'from generated function.', function () {
        let curry2 = sjl.curry2,
            min = curry2(Math.min),
            max = curry2(Math.max),
            pow = curry2(Math.pow),
            composed = sjl.compose(min(8), max(5), pow(2)),
            randomNum = curry2(function (start, end) { return Math.random() * end + start; }),
            random = randomNum(0),
            expectedFor = function (num) { return min(8, max(5, pow(num, 2))); };
            [8,5,3,2,1,0, random(89), random(55), random(34)].forEach(function (num) {
                expect(composed(num)).to.equal(expectedFor(num));
            });
    });

});
