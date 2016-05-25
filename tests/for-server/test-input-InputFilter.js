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
        Input =             sjl.input.Input,
        InputFilter =       sjl.input.InputFilter,
        RegexValidator =    sjl.validator.RegexValidator,
        NumberValidator =   sjl.validator.NumberValidator,
        NotEmptyValidator = sjl.validator.NotEmptyValidator,
        AlnumValidator =    sjl.validator.AlnumValidator,
        BooleanFilter =         sjl.filter.BooleanFilter,
        StringToLowerFilter =   sjl.filter.StringToLowerFilter,
        StringTrimFilter =      sjl.filter.StringTrimFilter,
        SlugFilter =            sjl.filter.SlugFilter,
        StripTagsFilter =       sjl.filter.StripTagsFilter;

    describe('Constructor', function () {
        it ('should be a subclass of `sjl.stdlib.Extendable`.', function () {
            expect((new InputFilter())).to.be.instanceof(sjl.stdlib.Extendable);
        });
        it ('should construct with no parameters passed.', function () {
            expect((new InputFilter())).to.be.instanceof(InputFilter);
        });
        it ('should populate all properties passed in via hash object.', function () {
            // var options = {
            //     alias: 'hello',
            //     breakOnFailure: true,
            //     fallbackValue: 'hello world'
            // },
            //     inputFilter = new Input(options);
            // Object.keys(options).forEach(function (key) {
            //     expect(inputFilter[key]).to.equal(options[key]);
            // });
        });
    });

    describe('Interface', function () {
        var inputFilter = new InputFilter();
        [
            'isValid',

        ].forEach(function (method) {
            it('should have a `' + method + '` method.', function () {
                expect(inputFilter[method]).to.be.instanceof(Function);
            });
        });
    });

    describe('Properties.', function () {
        var inputFilter = new InputFilter();
        [
            ['data', Object],
            ['inputs', Object],
            ['invalidInputs', Object],
            ['validInputs', Object],
            ['messages', Object]
        ].forEach(function (args) {
            it('should have an `' + args[0] + '` property.', function () {
                var isValidProp = sjl.classOfIsMulti.apply(sjl, [inputFilter[args[0]]].concat(args.slice(1)));
                expect(isValidProp).to.equal(true);
            });
        });
    });

});
