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

var Validator = sjl.ns.refactor.validator.Validator;

describe('sjl.ns.validator.Validator', function () {

    var expectedProperties = [
        '_messages'
        // ... @todo add rest of properties and their types here
    ];

    it ('should have the expected properties as their expected types.', function () {
        var validator = new Validator();
        expectedProperties.forEach(function (value) {
            expect(validator.hasOwnProperty(value)).to.equal(true);
        });
    });

});
