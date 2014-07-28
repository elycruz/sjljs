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
            var key, value, regex;
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

        function inRangeTest(keyValMap, validator, expected) {
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

    describe('#`sjl.validator.ValidatorChain`', function () {
        var chain = new sjl.validator.ValidatorChain({
            validators: [
                new sjl.validator.InRangeValidator({min: 0, max: 100}),
                new sjl.validator.RegexValidator({pattern: /^\d+$/})
            ]
        });

        it ('should have the appropriate interface', function () {
            var chain = new sjl.validator.ValidatorChain(),
                methods = ['isValid', 'addValidator', 'addValidators', 'getMessages'],
                method;
            for (method in methods) {
                if (methods.hasOwnProperty(method)) {
                    method = methods[method];
                    expect(typeof chain[method]).to.equal('function');
                }
            }
        });

        // @todo explode this definition. It should be a separated into a definition per method test (defined this way it is due to shortness of time;  e.g., addValidator, addValidators, and constructor
        it('should be able to add validators (one or many, also via constructor ' +
            'and via `addValidator` and `addValidators`).', function () {
            var chain1 = new sjl.validator.ValidatorChain({
                    validators: [new sjl.validator.InRangeValidator()]
                }),
                chain2 = new sjl.validator.ValidatorChain({
                    validators: [
                        new sjl.validator.InRangeValidator({min: 0, max: 100}),
                        new sjl.validator.RegexValidator({pattern: /^\d+$/})
                    ]
                }),
                chain3 = new sjl.validator.ValidatorChain(),
                chain4 = new sjl.validator.ValidatorChain();

            // Add multiple validators
            chain3.addValidators([
                new sjl.validator.InRangeValidator({min: 0, max: 100}),
                new sjl.validator.RegexValidator({pattern: /^\d+$/})
            ]);
            chain3.addValidator(new sjl.validator.InRangeValidator());

            // Add validators one by one
            chain4.addValidator(new sjl.validator.InRangeValidator());
            chain4.addValidator(new sjl.validator.InRangeValidator());
            chain4.addValidator(new sjl.validator.InRangeValidator());
            chain4.addValidator(new sjl.validator.InRangeValidator());

            // Validate
            expect(chain1.getValidators().length).to.equal(1);
            expect(chain2.getValidators().length).to.equal(2);
            expect(chain3.getValidators().length).to.equal(3);
            expect(chain4.getValidators().length).to.equal(4);
        });

        it('should return true when checking value `100` for a range ' +
            'between 0-100 (inclusive) and should have zero error messages.', function () {
            var messages = chain.getMessages();
            expect(chain.isValid(100)).to.equal(true);
            expect(messages.length).to.equal(0);
        });

        it('should return true when checking value `99` for a range ' +
            'between 0-100 (exclusive) and should return 0 messages for each validator.', function () {
            var messages = chain.getMessages();
            expect(chain.isValid(99)).to.equal(true);
            expect(messages.length).to.equal(0);
        });

    });
});
