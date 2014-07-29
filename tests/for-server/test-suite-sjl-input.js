/**
 * Created by edelacruz on 7/28/2014.
 */
/**
 * Created by edelacruz on 7/28/2014.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Input', function () {

    "use strict";

    describe('Should have the appropriate interface', function () {
        var input = new sjl.Input(),
            propNames = [
                'allowEmpty',
                'breakOnFailure',
                'errorMessage',
                'filterChain',
                'name',
                'required',
                'validatorChain',
                'messages',
                'value'
            ],
            getAndSetMethodNames = [],
            otherMethodNames = [ 'isValid', 'merge' ],
            methodNames = [],
            method,
            prop;

        // Get prop setter and getter names
        for (prop in propNames) {
            prop = propNames[prop];
            getAndSetMethodNames.push('set' + sjl.ucaseFirst(prop));
            getAndSetMethodNames.push('get' + sjl.ucaseFirst(prop));
        }

        // Check methods exist
        methodNames = otherMethodNames.concat(getAndSetMethodNames);

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
