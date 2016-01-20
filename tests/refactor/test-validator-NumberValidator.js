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

});
