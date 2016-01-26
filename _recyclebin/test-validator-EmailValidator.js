/**
 * Created by elyde on 1/15/2016.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai'),
        sjl = require('./../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

var EmailValidator = sjl.ns.refactor.validator.EmailValidator,
    Validator = sjl.ns.refactor.validator.Validator;

describe('sjl.ns.validator.EmailValidator', function () {

    it ('should be a subclass of `Validator`.', function () {
        var validator = new EmailValidator();
        expect(validator instanceof Validator).to.equal(true);
    });

    it ('should return `true` if value is a valid email address else it should return `false`.', function () {
        var validator = new EmailValidator(),
            values = [
                [true, 'hello@hello.com'],
                [true, 'hello@hello'],
                [true, 'abc@hello'],
                [false, 'wonderful'],
                //[false, '99 bottles of beer on the wall']
            ],
            // Falsy values count
            falsyValuesLen = values.filter(function (value) { return value[0] === false; }).length;

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            var result = validator.isValid(value[1]);
            console.log(value, result);
            expect(result).to.equal(value[0]);
        });

        // Expect messages for falsy values
        expect(validator.messages.length).to.equal(falsyValuesLen);
    });

});
