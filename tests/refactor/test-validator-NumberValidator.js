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

    //const hexChart = [
    //    [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5],
    //    [6, 6], [7, 7], [8, 8], [9, 9], [10, 'A'], [11, 'B'],
    //    [12, 'C'], [13, 'D'], [14, 'E'], [15, 'F']
    //];
    //
    //function toHex (value) {
    //    var dividend = value,
    //        quotient,
    //        remainder;
    //    quotient = parseInt(dividend / value, 10);
    //    remainder = dividend - (quotient * 16);
    //}

    it('should be a subclass of `Validator`.', function () {
        expect((new NumberValidator()) instanceof Validator).to.equal(true);
        expect((new NumberValidator()) instanceof NumberValidator).to.equal(true);
    });

    describe ('#validateHex', function () {
        it ('should return an array of [Boolean, Number] when hex value is a valid hex value.', function (){
            var validHexValues = [0x000212, '0xff00ff', '0xfff', 0x000],
                validator = new NumberValidator();
            validHexValues.forEach(function (value) {
                validator.validateHex(value);
            });
        });
    });

});
