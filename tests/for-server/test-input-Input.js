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

    var FilterChain =       sjl.filter.FilterChain,
        ValidatorChain =    sjl.validator.ValidatorChain,
        Input =             sjl.input.Input;

    describe('Constructor', function () {


    });

    describe('Interface', function () {
        var input = new Input();
        [
            'isValid',
            'mergeValidatorChain'
        ].forEach(function (method) {
            it('should have a `' + method + '` method.', function () {
                expect(input[method]).to.be.instanceof(Function);
            });
        });
    });

    describe('Properties.', function () {
        var input = new Input();
        [
            ['allowEmpty', Boolean],
            ['continueIfEmpty', Boolean],
            ['breakOnFailure', Boolean],
            ['fallbackValue', 'Undefined'],
            ['filterChain', 'Null', FilterChain],
            ['alias', String],
            ['required', Boolean],
            ['validatorChain', 'Null', ValidatorChain],
            ['value', 'Undefined'],
            ['rawValue', 'Undefined'],
            ['messages', Array],
            ['validationHasRun', Boolean]
        ].forEach(function (args) {
            it('should have an `' + args[0] + '` property.', function () {
                var isValidProp = sjl.classOfIsMulti.apply(sjl, [input[args[0]]].concat(args.slice(1)));
                expect(isValidProp).to.equal(true);
            });
        });
    });

});
