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

    var expectedPropertyAndTypes = {
        messages: 'Object',
        messagesMaxLength: 'Number',
        messageTemplates: 'Object',
        valueObscured: 'Boolean',
        value: 'Null'
    },
        expectedMethodNames = [

            // Value getter and setters
            //'messages',
            //'messagesMaxLength',
            //'messageTemplates',
            //'valueObscured',
            //'value',

            // Application methods
            'addErrorByKey',
            'clearMessages',
            'validate',
            'isValid'
        ];

    it ('should have the expected properties as expected types.', function () {
        var validator = new Validator();
        Object.keys(expectedPropertyAndTypes).forEach(function (key) {
            expect(validator.hasOwnProperty(key)).to.equal(true);
            expect(sjl.classOf(validator[key])).to.equal(expectedPropertyAndTypes[key]);
        });
    });

    it ('should have the expected methods.', function () {
        var validator = new Validator();
        expectedMethodNames.forEach(function (methodName) {
            expect(typeof validator[methodName]).to.equal('function');
            expect(typeof Validator.prototype[methodName]).to.equal('function');
        });
    });

});
