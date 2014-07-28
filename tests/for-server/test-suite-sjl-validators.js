/**
 * Created by edelacruz on 7/28/2014.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Validator NS', function () {

    "use strict";

    describe('#`sjl.validator.RegexValidator`', function () {

        function regexTest(keyValMap, validator, expected) {
            var key, value, regex, messages, message;
            for (key in keyValMap) {
                value = keyValMap[key];
                regex = new RegExp(key);
                validator.setPattern(regex);
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
            validator = new sjl.validator.RegexValidator();

        // Run tests
        regexTest(truthyMap, validator, true);
        regexTest(falsyMap, validator, false);

    });

    describe('#`sjl.validator.InRangeValidator`', function () {

        function inRangeTest (keyValMap, validator, expected) {
            var key, config, min, max, value;
            for (key in keyValMap) {
                config = keyValMap[key];
                validator.setOptions(config);
                min = validator.getMin();
                max = validator.getMax();
                value = validator.getValue();
                it('should return ' + expected + ' when testing for a ' +
                    'Number within range {min: ' + min + ', max: ' + max + '} with value: ' + value, function () {
                    expect(validator.isValid(value)).to.equal(expected);
                });
            }
        }

        var validator = new sjl.validator.InRangeValidator(),
            truthyMap = {
                config1: {
                    min: 0,
                    max: 100,
                    value: 99
                },
                config2: {
                    min: -0,
                    max: 1,
                    value: 0
                },
                config3: {
                    min: -1,
                    max: 1,
                    value: 0
                }
            },
            falsyMap = {
                config1: {
                    min: 0,
                    max: 100,
                    value: 99e5
                },
                config2: {
                    min: -0,
                    max: 1,
                    value: 11
                },
                config3: {
                    min: -1,
                    max: 1,
                    value: 100
                }
            };

        inRangeTest(truthyMap, validator, true);
        inRangeTest(falsyMap, validator, false);

    });

});


