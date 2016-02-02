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
    NumberValidator = sjl.ns.refactor.validator.NumberValidator;

describe('sjl.ns.refactor.validator.NumberValidator`', function () {

    "use strict";

    // @note got algorithm from http://www.wikihow.com/Convert-from-Decimal-to-Hexadecimal
    const hexMap = [
        [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5],
        [6, 6], [7, 7], [8, 8], [9, 9], [10, 'A'], [11, 'B'],
        [12, 'C'], [13, 'D'], [14, 'E'], [15, 'F']
    ];

    function numToHex(d) {
        var q,
            r,
            a = [],
            out = '0x';
        do {
            q = parseInt(d / 16, 10);
            r = d - (q * 16);
            a.push(hexMap[r][1]);
            d = q;
        }
        while (q > 0);
        for (var i = a.length - 1; i >= 0; i -= 1) {
            out += a[i];
        }
        return out;
    }

    function fib(limit) {
        var out = [],
            a = 0,
            b = 1;
        while (a <= limit) {
            out.push(a);
            if (b <= limit) {
                out.push(b);
            }
            a = a + b;
            b = a + b;
        }
        return out;
    }

    function createValidationParser (validator, funcs) {
        return function (value) {
            return validator._parseValidationFunctions.call(validator, funcs, value);
        };
    }

    it('should be a subclass of `Validator`.', function () {
        expect((new NumberValidator()) instanceof Validator).to.equal(true);
        expect((new NumberValidator()) instanceof NumberValidator).to.equal(true);
    });

    describe('#`_validateHex`', function () {
        it('should return an array of [1, Number] when hex value is a valid hex value.', function () {
            var vals = fib(1000).map(function (value) {
                    return [value, numToHex(value), 1];
                }),
                validator,
                failingVals;

            // Instantiate validator (set separately to easily debug
            validator = new NumberValidator({allowHex: true});

            // Failing values
            // Last index in inner arrays stand for untouched;  NumberValidator#_validate* functions return an array of
            // [performedOpFlag{Number[-1,0,1]}, value{String|Number|*}]  `performedOpFlag` is:
            // -- -1 was candidate for test but test failed
            // -- 0 is not candidate so value wasn't touched
            // -- 1 was candidate value and test passed and value was transformed
            failingVals = [
                [Math.floor(Math.random() * 98), 'object', 0],
                [Math.floor(Math.random() * 97), 'somevalue', 0],
                [Math.floor(Math.random() * 96), 'someothervalue', 0],
                [Math.floor(Math.random() * 95), 'someothervalue', 0],
                [Math.floor(Math.random() * 94), 'someothervalue', 0]
            ];

            // Test values
            vals.forEach(function (value, index) {
                var checkedValuePair = validator._validateHex(value[1]);
                //console.log(blnValue, hexValue, checkedValuePair);
                expect(checkedValuePair[1]).to.equal(vals[index][0]);
                expect(checkedValuePair[0]).to.equal(vals[index][2]);
            });

            // Zero error messages;  All checks up to should have passed
            expect(validator.messages.length).to.equal(0);

            // Test values
            failingVals.forEach(function (value, index) {
                var checkedValuePair = validator._validateHex(value[1]);
                expect(checkedValuePair[1]).to.equal(failingVals[index][1]);
                expect(checkedValuePair[0]).to.equal(failingVals[index][2]);
            });

            // Expect length of `failingVals`
            expect(validator.messages.length).to.equal(0);
        });
    });

    describe('#`_validateSigned', function () {
        it ('should return [-1, value] when value is a signed number.', function () {
            var validator = new NumberValidator({allowSigned: false}),
                values = [
                    // Should return failure (-1) and value
                    [-1, -3], [-1, -999.99], [-1, -0x99ff99], [-1, '+100'],
                    // Should return untouched and value
                    [0, 99], [0, '123123.234e20'], [0, 0xff9900]],
                result;

            // Test for `allowSigned` is false
            values.forEach(function (value, index) {
                result = validator._validateSigned(value[1]);
                expect(result[0]).to.equal(values[index][0]);
                expect(result[1]).to.equal(values[index][1]);
            });
        });
    });

    describe('#`_validateComma', function () {
        it ('should return [-1, value] when value contains comma(s) and `allowComma` is `false`.', function () {
            var validator = new NumberValidator(),
                valuesWithCommas = [[-1, ',1,000,000,000', 1000000000], [-1, ',', ','], [-1, '1,000,000', 1000000], [-1, '+100,000', 100000]],
                valuesWithCommas2 = [[1, ',1,000,000,000', 1000000000], [-1, ',', ','], [1, '1,000,000', 1000000], [1, '+100,000', 100000]],
                valuesWithoutCommas = [[0, 99], [0, '123123.234e20'], [0, 0xff9900]],
                values = valuesWithCommas.concat(valuesWithoutCommas),
                result;

            // Test for `allowComma` is false
            values.forEach(function (value, index) {
                result = validator._validateComma(value[1]);
                expect(result[0]).to.equal(values[index][0]);
                expect(result[1]).to.equal(values[index][1]);
            });

            // Test for `allowComma` is true
            validator.allowCommas = true;
            valuesWithCommas2.forEach(function (value, index) {
                result = validator._validateComma(value[1]);
                expect(result[0]).to.equal(valuesWithCommas2[index][0]);
                expect(result[1]).to.equal(valuesWithCommas2[index][2]);
            });
        });
    });

    describe('#`_validateFloat', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowFloat` is `false`.', function () {
            var validator = new NumberValidator({allowFloat: false}),
                valuesWithFloats = [[-1, ',1,000,000,000.00'], [-1, '.', '.'], [-1, '1,000,000.00'], [-1, '+100,000.00']],
                valuesWithFloats2 = [[0, ',1,000,000,000.00'], [0, '.', '.'], [0, '1,000,000.00'], [0, '+100,000.00']],
                valuesWithoutFloats = [[0, 99], [0, '123123e10'], [0, 0xff9900]],
                values = valuesWithFloats.concat(valuesWithoutFloats),
                result;

            // Test for `allowFloat` is false
            valuesWithFloats.forEach(function (value, index) {
                result = validator._validateFloat(value[1]);
                expect(result[0]).to.equal(valuesWithFloats[index][0]);
                expect(result[1]).to.equal(valuesWithFloats[index][1]);
            });

            //// Test for `allowFloat` is true
            validator.allowFloat = true;
            valuesWithFloats2.forEach(function (value, index) {
                result = validator._validateFloat(value[1]);
                expect(result[0]).to.equal(valuesWithFloats2[index][0]);
                expect(result[1]).to.equal(valuesWithFloats2[index][1]);
            });
        });
    });

    describe('#`_validateBinary', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowBinary` is `false`.', function () {
            var validator = new NumberValidator({allowBinary: false}),
                binaryValues = [[-1, 'abcdefg'], [-1, '0b98345'], [-1, '0b111'], [0, '9999'], [0, 9999], [-1, 'bb010101'], [-1, '0b01010101']],
                binaryValues2 = [[-1, 'abcdefg'], [-1, '0b98345'], [1, '0b111'], [0, '9999'], [0, 9999], [-1, 'bb010101'], [1, '0b01010101']],
                result;

            // Test for `allowBinary` is false
            binaryValues.forEach(function (value, index) {
                result = validator._validateBinary(value[1]);
                expect(result[0]).to.equal(binaryValues[index][0]);
                expect(result[1]).to.equal(binaryValues[index][1]);
            });

            //// Test for `allowBinary` is true
            validator.allowBinary = true;
            binaryValues2.forEach(function (value, index) {
                result = validator._validateBinary(value[1]);
                //console.log(result, binaryValues2[index]);
                expect(result[0]).to.equal(binaryValues2[index][0]);
                if (result[0] !== 1) {
                    expect(result[1]).to.equal(binaryValues2[index][1]);
                }
                else {
                    expect(result[1]).to.equal(Number(binaryValues2[index][1]));
                }
            });
        });
    });

    describe('#`_validateOctal', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowOctal` is `false`.', function () {
            var validator = new NumberValidator({allowOctal: false}),
                octalValues = [[0, '999'], [0, 999], [0, '0b111'], [-1, '0777'], [-1, '0757']],
                octalValues2 = [[0, '999'], [0, 999], [0, '0b111'], [1, '0777'], [1, '0757']],
                result;

            // Test for `allowOctal` is false
            octalValues.forEach(function (value, index) {
                result = validator._validateOctal(value[1]);
                expect(result[0]).to.equal(octalValues[index][0]);
                expect(result[1]).to.equal(octalValues[index][1]);
            });

            //// Test for `allowOctal` is true
            validator.allowOctal = true;
            octalValues2.forEach(function (value, index) {
                result = validator._validateOctal(value[1]);
                expect(result[0]).to.equal(octalValues2[index][0]);
                if (result[0] !== 1) {
                    expect(result[1]).to.equal(octalValues2[index][1]);
                }
                else {
                    expect(result[1]).to.equal(parseInt(octalValues2[index][1], 8));
                }
            });
        });
    });

    describe('#`_validateScientific', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowScientific` is `false`.', function () {
            var validator = new NumberValidator({allowScientific: false}),
                scientificValues = [[0, '999'], [0, 999], [0, '0b111'], [-1, '10e10'], [-1, '-29.01e+29'], [-1, '29.01e-29'], [-1, '29.01e29'], [-1, '29e29']],
                scientificValues2 = [[0, '999'], [0, 999], [0, '0b111'], [1, '10e10'], [1, '-29.01e+29'], [1, '29.01e-29'], [1, '29.01e29'], [1, '29e29']],
                result;

            // Test for `allowScientific` is false
            scientificValues.forEach(function (value, index) {
                result = validator._validateScientific(value[1]);
                expect(result[0]).to.equal(scientificValues[index][0]);
                expect(result[1]).to.equal(scientificValues[index][1]);
            });

            //// Test for `allowScientific` is true
            validator.allowScientific = true;
            scientificValues2.forEach(function (value, index) {
                result = validator._validateScientific(value[1]);
                expect(result[0]).to.equal(scientificValues2[index][0]);
                if (result[0] !== 1) {
                    expect(result[1]).to.equal(scientificValues2[index][1]);
                }
                else {
                    expect(result[1]).to.equal(Number(scientificValues2[index][1]));
                }
            });
        });
    });

    describe('#`_validateRange', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowRange` is `false`.', function () {
            var validator = new NumberValidator({checkRange: false}),
                rangeValues = [[0, 999], [0, 100], [0, 'abc']],
                rangeValues2 = [[-1, 999, 0, 998], [1, 999, 0, 999], [-1, 999, 99, 100]],
                result;

            // Test for `allowRange` is false
            rangeValues.forEach(function (value, index) {
                result = validator._validateRange(value[1]);
                expect(result[0]).to.equal(rangeValues[index][0]);
                expect(result[1]).to.equal(rangeValues[index][1]);
            });

            validator.checkRange = true;
            validator.inclusive = true;
            rangeValues2.forEach(function (value, index) {
                validator.min = value[2];
                validator.max = value[3];
                result = validator._validateRange(value[1]);
                //console.log(result, value);
                expect(result[0]).to.equal(rangeValues2[index][0]);
                expect(result[0]).to.equal(rangeValues2[index][0]);
                expect(result[1]).to.equal(rangeValues2[index][1]);
            });
        });
    });

    describe('#`_parseValidationFunctions`', function () {
        var validator = new NumberValidator({
            allowHex: true,
            allowBinary: true,
            allowOctal: true,
            allowCommas: true,
            allowScientific: true
        }),
            numTypeFuncs = ['_validateComma', '_validateHex',
                '_validateBinary', '_validateOctal', '_validateScientific'],
            parser = createValidationParser(validator, numTypeFuncs),
            values = [
                [1, numToHex(999), 999],
                [1, numToHex(1500), 1500],
                [1, '0b0101010', 42],
                [1, '0b111', 7],
                [1, '0747', 487],
                [1, '0777', 511],
                [1, '12e2', 1200],
                [1, '-12e2', -1200],
                [1, '-12e-2', -0.12],
                [1, '1,000.35', 1000.35],
                [1, '1,000,000.35', 1000000.35],
                [0, 'helloworld', 'helloworld'],
                [-1, '0ehello', '0ehello'],
                [-1, '0bhello', '0bhello'],
                [0, '0x', '0x']
            ],
            result;

        values.forEach(function (value) {
            result = parser(value[1]);
            expect(result[0]).to.equal(value[0]);
            expect(result[1]).to.equal(value[2]);
        });
    });

    describe ('#`isValid`', function () {
        var validator = new NumberValidator({
                allowFloat: true,
                allowHex: true,
                allowBinary: true,
                allowOctal: true,
                allowCommas: true,
                allowScientific: true,
                allowSigned: true
        }),
            values = [
                [true, 999, 999],
                [true, -999, -999],
                [true, 10e2, 200],
                [true, 0xff9900, 200],
                [true, 999.88, 999.88],
                [true, numToHex(999), 999],
                [true, numToHex(1500), 1500],
                [true, '0b0101010', 42],
                [true, '0b111', 7],
                [true, '0747', 487],
                [true, '0777', 511],
                [true, '12e2', 1200],
                [true, '-12e2', -1200],
                [true, '-12e-2', -0.12],
                [true, '1,000.35', 1000.35],
                [true, '1,000,000.35', 1000000.35],
                [false, 'helloworld', 'helloworld'],
                [false, '0ehello', '0ehello'],
                [false, '0bhello', '0bhello'],
                [false, '0x', '0x']
            ];

        values.forEach(function (value) {
            expect(validator.isValid(value[1])).to.equal(value[0]);
        });

        // Ensure we have 7
        expect(validator.messages.length).to.equal(7);
    });

});
