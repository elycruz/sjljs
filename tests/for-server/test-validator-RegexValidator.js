/**
 * Created by edelacruz on 7/28/2014.
 */
describe('sjl.validator.RegexValidator`', function () {


    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var Validator = sjl.ns.validator.Validator,
        RegexValidator = sjl.ns.validator.RegexValidator;

    it('should be a subclass of `Validator`.', function () {
        expect((new RegexValidator()) instanceof Validator).to.equal(true);
        expect((new RegexValidator()) instanceof RegexValidator).to.equal(true);
    });

    function regexTest(keyValMap, validator, expected) {
        var key, value, regex;
        for (key in keyValMap) {
            value = keyValMap[key];
            regex = new RegExp(key);
            validator.pattern = regex;
            it('should return ' + expected + ' when testing "' + key + '" with "' + value + '".', function () {
                expect(validator.isValid(value)).to.equal(expected);
            });
        }
    }

    var truthyMap = {
            '/^\\d+$/': 199, // Unsigned Number
            '/^[a-z]+$/': 'abc', // Alphabetical
            '^(:?\\+|\\-)?\\d+$': '-100' // Signed Number
        },
        falsyMap = {
            '/^\\d+$/': '-199edd1', // Unsigned Number
            '/^[a-z]+$/': '0123a12bc', // Alphabetical
            '^(:?\\+|\\-)?\\d+$': '-10sd0e+99' // Signed Number
        },
        validator = new sjl.ns.validator.RegexValidator();

    // Run tests
    regexTest(truthyMap, validator, true);
    regexTest(falsyMap, validator, false);

});
