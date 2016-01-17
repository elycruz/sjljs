/**
 * Created by edelacruz on 7/28/2014.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

var Validator = sjl.ns.refactor.validator.Validator,
    RegexValidator = sjl.ns.refactor.validator.RegexValidator;

describe('sjl.ns.refactor.validator.RegexValidator`', function () {

    "use strict";

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
        validator = new sjl.ns.refactor.validator.RegexValidator();

    // Run tests
    regexTest(truthyMap, validator, true);
    regexTest(falsyMap, validator, false);

});
