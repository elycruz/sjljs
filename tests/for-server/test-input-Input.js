/**
 * Created by Ely on 3/26/2016.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai'),
        sjl = require('./../../src/sjl');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe ('#input.Input', function () {

    "use strict";

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
