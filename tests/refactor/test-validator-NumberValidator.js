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

    it('should be a subclass of `Validator`.', function () {
        expect((new NumberValidator()) instanceof Validator).to.equal(true);
        expect((new NumberValidator()) instanceof NumberValidator).to.equal(true);
    });

    describe('#_validateHex', function () {
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
            var validator = new NumberValidator(),
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
                valuesWithCommas = [[-1, ',1,000,000,000', '1000000000'], [-1, ',', ''], [-1, '1,000,000', '1000000'], [-1, '+100,000', '+100000']],
                valuesWithCommas2 = [[1, ',1,000,000,000', '1000000000'], [-1, ',', ','], [1, '1,000,000', '1000000'], [1, '+100,000', '+100000']],
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
                console.log(result, binaryValues2[index]);
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
                octalValues = [[-1, '999'], [-1, 999], [-1, '0b111'], [-1, '0777'], [-1, '0757']],
                octalValues2 = [[-1, '999'], [-1, 999], [-1, '0b111'], [1, '0777'], [1, '0757']],
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
                console.log(result, octalValues2[index]);
                expect(result[0]).to.equal(octalValues2[index][0]);
                if (result[0] !== 1) {
                    expect(result[1]).to.equal(octalValues2[index][1]);
                }
                else {
                    expect(result[1]).to.equal(Number(octalValues2[index][1]));
                }
            });
        });
    });

});