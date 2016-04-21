/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.issetMulti', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var falsyArgSets = [
            [null, undefined],
            [null, 'hello', undefined, {}, []],
            [undefined, 'hello', function () {}],
        ],
        truthyArgSets = [
            ['hello', {hello: 'ola'}, function () {}]
        ];
    it ('should return false for calls with any values that are null or undefined.', function () {
        falsyArgSets.forEach(function (args) {
            expect(sjl.issetMulti.apply(sjl, args)).to.equal(false);
        });
    });
    it ('should return true if no values passed in are null or undefined.', function () {
        truthyArgSets.forEach(function (args) {
            expect(sjl.issetMulti.apply(sjl, args)).to.equal(true);
        });
    });
});
