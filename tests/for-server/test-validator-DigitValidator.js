/**
 * Created by elyde on 1/15/2016.
 */
describe('sjl.validator.DigitValidator', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var DigitValidator = sjl.validator.DigitValidator,
        Validator = sjl.validator.Validator,
        generalValidator = new DigitValidator();

    it ('should be a subclass of `Validator`.', function () {
        expect(generalValidator instanceof Validator).to.equal(true);
    });

    describe ('instance properties', function () {
        it ('should have a `pattern` property of type `RegExp`.', function () {
            expect(sjl.classOf(generalValidator.pattern)).to.equal(RegExp.name);
        });
    });

    it ('should return `true` if value contains only digits.', function () {
        var validator = new DigitValidator(),
            values = [
                [true, '999'],
                [true, '123'],
                [true, 12345],
                [true, 0x009900],
                [false, false],
                [false, true],
                [false, ['a', 'b', 'c']],
                [false, 'hello[]world99'],
                [false, '99 bottles of beer on the wall']
            ];

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            var result = validator.isValid(value[1]);
            expect(result).to.equal(value[0]);
            if (value[0] === false) {
                expect(validator.messages.length).to.equal(1);
            }
        });
    });

});
