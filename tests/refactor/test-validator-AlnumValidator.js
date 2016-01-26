/**
 * Created by elyde on 1/15/2016.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai'),
        sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

var AlnumValidator = sjl.ns.refactor.validator.AlnumValidator,
    Validator = sjl.ns.refactor.validator.Validator;

describe('sjl.ns.validator.AlnumValidator', function () {

    it ('should be a subclass of `Validator`.', function () {
        var validator = new AlnumValidator();
        expect(validator instanceof Validator).to.equal(true);
    });

    it ('should return `true` value is `alpha numeric` and `false` otherwise.', function () {
        var validator = new AlnumValidator(),
            values = [
                [true, 'helloworld'],
                [true, 'testingtesting123testingtesting123'],
                [true, 'sallysellsseashellsdownbytheseashore'],
                [false, 'hello[]world'],
                [false, '99 bottles of beer on the wall']
            ],
            // Falsy values count
            falsyValuesLen = values.filter(function (value) { return value[0] === false; }).length;

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            expect(validator.isValid(value[1])).to.equal(value[0]);
        });

        // Expect messages for falsy values
        expect(validator.messages.length).to.equal(falsyValuesLen);
    });

});
