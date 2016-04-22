/**
 * Created by Ely on 3/26/2016.
 */

describe ('sjl.input.Input', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var Input = sjl.ns.input.Input;

    describe('Should have the appropriate interface', function () {
        var input = new Input(),
            propNames = [
                'allowEmpty',
                'continueIfEmpty',
                'breakOnFailure',
                'fallbackValue',
                'filterChain',
                'alias',
                'required',
                'validatorChain',
                'value',
                'rawValue',
                'messages'
            ],
            methodNames = [
                'isValid',
                'mergeValidatorChain'
            ],
            method;

        // Check methods exist
        for (method in methodNames) {
            method = methodNames[method];
            it('should have a `' + method + '` method.', function () {
                expect(typeof input[method]).to.equal('function');
            });
        }
    });

    describe('Should return a valid ValidatorChain via it\'s getter.', function () {

    });
});
