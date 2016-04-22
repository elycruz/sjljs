/**
 * Created by elyde on 1/15/2016.
 */
describe('sjl.validator.Validator', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var Validator = sjl.ns.validator.Validator,

        expectedPropertyAndTypes = {
            messages: 'Array',
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

    it('should have the expected properties as expected types.', function () {
        var validator = new Validator();
        Object.keys(expectedPropertyAndTypes).forEach(function (key) {
            expect(validator.hasOwnProperty(key)).to.equal(true);
            expect(sjl.classOf(validator[key])).to.equal(expectedPropertyAndTypes[key]);
        });
    });

    it('should have the expected methods.', function () {
        var validator = new Validator();
        expectedMethodNames.forEach(function (methodName) {
            expect(typeof validator[methodName]).to.equal('function');
            expect(typeof Validator.prototype[methodName]).to.equal('function');
        });
    });

});
