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
        it ('should be a subclass of `sjl.stdlib.Extendable`.', function () {
            expect((new Input())).to.be.instanceof(sjl.stdlib.Extendable);
        });
        it ('should construct with no parameters passed.', function () {
            expect((new Input())).to.be.instanceof(Input);
        });
        it ('should construct an instance with the `alias` property populated when first parameter is a string.', function () {
            var alias = 'hello';
            expect((new Input(alias)).alias).to.equal(alias);
        });
        it ('should populate all properties passed in via hash object.', function () {
            var options = {
                alias: 'hello',
                breakOnFailure: true,
                fallbackValue: 'hello world'
            },
                input = new Input(options);
            Object.keys(options).forEach(function (key) {
                expect(input[key]).to.equal(options[key]);
            });
        });
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
